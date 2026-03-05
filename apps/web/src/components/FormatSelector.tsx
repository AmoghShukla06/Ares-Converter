import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import { getConversionTargets, getFormat, FormatCategory } from '@ares/utils';
import { engine } from '@ares/converters';

interface FormatSelectorProps {
    inputFormat: string;
    selectedFormat: string;
    onFormatChange: (format: string) => void;
}

export function FormatSelector({ inputFormat, selectedFormat, onFormatChange }: FormatSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Get targets only from the engine to ensure they are actually supported
    const targets = useMemo(() => {
        return engine.getSupportedOutputFormats(inputFormat).sort();
    }, [inputFormat]);

    const filtered = useMemo(() => {
        if (!search) return targets;
        return targets.filter((t) => t.toLowerCase().includes(search.toLowerCase()));
    }, [targets, search]);

    const inputInfo = getFormat(inputFormat);
    const outputInfo = getFormat(selectedFormat);

    return (
        <div className="relative">
            <label className="block text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                Convert to
            </label>

            {/* Conversion direction indicator */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`format-badge ${inputInfo?.category ?? 'unknown'}`}>
                    {inputFormat.toUpperCase()}
                </span>
                <ArrowRight size={14} className="text-[var(--color-text-tertiary)]" />
                <span className={`format-badge ${outputInfo?.category ?? inputInfo?.category ?? 'unknown'}`}>
                    {selectedFormat.toUpperCase()}
                </span>
            </div>

            {/* Dropdown trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)] text-[var(--color-text-primary)] transition-all duration-200"
            >
                <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                <ChevronDown
                    size={16}
                    className={`text-[var(--color-text-tertiary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-primary)] shadow-2xl shadow-black/30 overflow-hidden"
                    >
                        {/* Search */}
                        <div className="p-2 border-b border-[var(--color-border-primary)]">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                                <input
                                    type="text"
                                    placeholder="Search formats..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Format list */}
                        <div className="max-h-48 overflow-y-auto p-1">
                            {filtered.length > 0 ? (
                                filtered.map((format) => {
                                    const info = getFormat(format);
                                    const isSelected = format === selectedFormat;
                                    return (
                                        <button
                                            key={format}
                                            onClick={() => {
                                                onFormatChange(format);
                                                setIsOpen(false);
                                                setSearch('');
                                            }}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150
                        ${isSelected
                                                    ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                                                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                                }`}
                                        >
                                            <span className="font-mono text-sm font-semibold uppercase">
                                                {format}
                                            </span>
                                            <span className="text-xs text-[var(--color-text-tertiary)]">
                                                {info?.mime ?? ''}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-4 text-center text-sm text-[var(--color-text-tertiary)]">
                                    No matching formats
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsOpen(false);
                        setSearch('');
                    }}
                />
            )}
        </div>
    );
}
