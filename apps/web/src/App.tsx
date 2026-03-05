import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Trash2, RefreshCw } from 'lucide-react';

import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { FilePreview } from './components/FilePreview';
import { FormatSelector } from './components/FormatSelector';
import { ConversionPanel } from './components/ConversionPanel';
import { ProgressPanel } from './components/ProgressPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { FormatShowcase } from './components/FormatShowcase';
import { Footer } from './components/Footer';

import { useTheme } from './hooks/useTheme';
import { useConversion } from './hooks/useConversion';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import { ConversionPreset, getFormatFromFileName } from '@ares/utils';
import { engine } from '@ares/converters';

function App() {
    const { theme, resolved, setTheme, toggle } = useTheme();
    const {
        jobs,
        history,
        addFiles,
        startConversion,
        convertAll,
        cancelJob,
        removeJob,
        clearJobs,
        downloadOutput,
        shareOutput,
        clearHistory,
    } = useConversion();

    // ─── Local state ──────────────────────────────────────────

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [outputFormat, setOutputFormat] = useState('');
    const [quality, setQuality] = useState(75);
    const [compression, setCompression] = useState(50);
    const [preset, setPreset] = useState<ConversionPreset>('balanced');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Handlers ─────────────────────────────────────────────

    const handleFilesSelected = useCallback(
        (files: File[]) => {
            setSelectedFiles((prev) => [...prev, ...files]);

            // Auto-detect a sensible output format
            if (!outputFormat && files.length > 0) {
                const firstFile = files[0];
                const ext = firstFile.name.split('.').pop()?.toLowerCase() ?? '';
                const targets = engine.getSupportedOutputFormats(ext);
                if (targets.length > 0) {
                    setOutputFormat(targets[0]);
                }
            }
        },
        [outputFormat],
    );

    const handleRemoveFile = useCallback((index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleConvert = useCallback(async () => {
        if (selectedFiles.length === 0 || !outputFormat) return;

        const newJobs = addFiles(selectedFiles, outputFormat, preset, quality, compression);
        setSelectedFiles([]);

        // Start all conversions
        for (const job of newJobs) {
            await startConversion(job.id);
        }
    }, [selectedFiles, outputFormat, preset, quality, compression, addFiles, startConversion]);

    const handleReset = useCallback(() => {
        setSelectedFiles([]);
        setOutputFormat('');
        setQuality(75);
        setCompression(50);
        setPreset('balanced');
    }, []);

    // ─── Keyboard shortcuts ──────────────────────────────────

    useKeyboardShortcuts([
        {
            key: 'o',
            ctrl: true,
            description: 'Open file picker',
            action: () => fileInputRef.current?.click(),
        },
        {
            key: 'Enter',
            ctrl: true,
            description: 'Start conversion',
            action: handleConvert,
        },
        {
            key: 'Escape',
            description: 'Clear selection',
            action: handleReset,
        },
    ]);

    // ─── Derived state ───────────────────────────────────────

    const inputFormat = selectedFiles.length > 0
        ? selectedFiles[0].name.split('.').pop()?.toLowerCase() ?? ''
        : '';

    const totalInputSize = selectedFiles.reduce((s, f) => s + f.size, 0);

    const canConvert =
        selectedFiles.length > 0 &&
        outputFormat &&
        engine.canConvert(inputFormat, outputFormat);

    const hasActiveJobs = jobs.some((j) => j.status === 'converting');

    return (
        <div className="min-h-screen w-full flex flex-col">
            {/* Animated background */}
            <div className="gradient-bg" />

            {/* Header */}
            <Header
                theme={theme}
                resolved={resolved}
                onThemeChange={setTheme}
                onToggle={toggle}
            />

            {/* Main content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 space-y-8">
                {/* Upload Zone */}
                <UploadZone
                    onFilesSelected={handleFilesSelected}
                    disabled={hasActiveJobs}
                />

                {/* Selected files */}
                <AnimatePresence mode="sync">
                    {selectedFiles.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                        >
                            {/* File previews */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                                        Selected Files ({selectedFiles.length})
                                    </h3>
                                    <button
                                        onClick={handleReset}
                                        className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        Clear all
                                    </button>
                                </div>
                                <AnimatePresence mode="popLayout">
                                    {selectedFiles.map((file, i) => (
                                        <FilePreview
                                            key={`${file.name}-${i}`}
                                            file={file}
                                            onRemove={() => handleRemoveFile(i)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Conversion settings */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Format selector */}
                                <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
                                    <FormatSelector
                                        inputFormat={inputFormat}
                                        selectedFormat={outputFormat}
                                        onFormatChange={setOutputFormat}
                                    />
                                </div>

                                {/* Quality/Compression */}
                                <div className="p-5 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
                                    <ConversionPanel
                                        quality={quality}
                                        compression={compression}
                                        preset={preset}
                                        inputSize={totalInputSize}
                                        onQualityChange={setQuality}
                                        onCompressionChange={setCompression}
                                        onPresetChange={setPreset}
                                    />
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConvert}
                                    disabled={!canConvert || hasActiveJobs}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${canConvert && !hasActiveJobs
                                        ? 'bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] text-white shadow-lg shadow-[var(--color-accent)]/25 hover:shadow-xl hover:shadow-[var(--color-accent)]/30'
                                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed'
                                        }`}
                                >
                                    {hasActiveJobs ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            <Play size={16} />
                                            Convert {selectedFiles.length > 1 ? `${selectedFiles.length} files` : ''}
                                        </>
                                    )}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleReset}
                                    className="py-3.5 px-6 rounded-xl font-medium text-sm border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200"
                                >
                                    Cancel
                                </motion.button>
                            </div>

                            {/* Keyboard shortcut hints */}
                            <div className="flex items-center gap-4 text-[10px] text-[var(--color-text-tertiary)]">
                                <span>
                                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] font-mono">Ctrl+Enter</kbd>
                                    {' '}to convert
                                </span>
                                <span>
                                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] font-mono">Esc</kbd>
                                    {' '}to clear
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress / Queue */}
                <ProgressPanel
                    jobs={jobs}
                    onDownload={downloadOutput}
                    onShare={shareOutput}
                    onCancel={cancelJob}
                    onRemove={removeJob}
                />

                {/* History */}
                <HistoryPanel history={history} onClear={clearHistory} />

                {/* Format showcase (show when no files selected) */}
                {selectedFiles.length === 0 && jobs.length === 0 && (
                    <FormatShowcase />
                )}
            </main>

            {/* Hidden file input for keyboard shortcut */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length > 0) handleFilesSelected(files);
                    e.target.value = '';
                }}
            />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;
