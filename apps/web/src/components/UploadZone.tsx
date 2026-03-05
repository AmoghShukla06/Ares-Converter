import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileUp, Sparkles } from 'lucide-react';

interface UploadZoneProps {
    onFilesSelected: (files: File[]) => void;
    disabled?: boolean;
}

export function UploadZone({ onFilesSelected, disabled }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;

            if (disabled) return;

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                onFilesSelected(files);
            }
        },
        [onFilesSelected, disabled],
    );

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            onFilesSelected(files);
        }
        // Reset input
        e.target.value = '';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div
                id="upload-zone"
                className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-out overflow-hidden
          ${isDragging
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] scale-[1.01]'
                        : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-bg-secondary)]/50'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {/* Gradient border glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, var(--color-accent-subtle) 0%, transparent 70%)',
                    }}
                />

                <div className="relative py-16 px-8 flex flex-col items-center justify-center gap-5">
                    {/* Animated icon */}
                    <motion.div
                        className={`
              w-20 h-20 rounded-2xl flex items-center justify-center
              ${isDragging
                                ? 'bg-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/30'
                                : 'bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] group-hover:from-[var(--color-accent)]/20 group-hover:to-[var(--color-accent)]/5'
                            }
              transition-all duration-300
            `}
                        animate={isDragging ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
                        transition={{ duration: 0.6, repeat: isDragging ? Infinity : 0 }}
                    >
                        <AnimatePresence mode="wait">
                            {isDragging ? (
                                <motion.div
                                    key="dropping"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                >
                                    <FileUp size={36} className="text-white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="upload"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <Upload size={36} className="text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent)] transition-colors duration-300" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Text */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1.5">
                            {isDragging ? 'Drop files here' : 'Drop files here or click to upload'}
                        </h3>
                        <p className="text-sm text-[var(--color-text-tertiary)] max-w-md">
                            Supports images, videos, audio, documents, subtitles, and more.
                            <br />
                            <span className="inline-flex items-center gap-1 mt-1 text-[var(--color-accent)]">
                                <Sparkles size={12} />
                                All processing happens locally on your device
                            </span>
                        </p>
                    </div>

                    {/* Keyboard shortcut hint */}
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                        <kbd className="px-2 py-0.5 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] font-mono text-[10px]">
                            Ctrl+O
                        </kbd>
                        <span>to open file picker</span>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </motion.div>
    );
}
