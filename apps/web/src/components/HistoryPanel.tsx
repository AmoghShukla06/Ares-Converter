import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { HistoryEntry } from '@ares/utils';
import { formatFileSize, formatDuration } from '@ares/utils';

interface HistoryPanelProps {
    history: HistoryEntry[];
    onClear: () => void;
}

export function HistoryPanel({ history, onClear }: HistoryPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (history.length === 0) return null;

    const displayed = isExpanded ? history : history.slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider flex items-center gap-2">
                    <Clock size={12} />
                    Conversion History
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--color-bg-tertiary)]">
                        {history.length}
                    </span>
                </h3>
                <button
                    onClick={onClear}
                    className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] transition-colors"
                >
                    <Trash2 size={12} />
                    Clear
                </button>
            </div>

            <div className="space-y-1.5">
                <AnimatePresence>
                    {displayed.map((entry) => (
                        <motion.div
                            key={entry.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-primary)]/50"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                                    {entry.fileName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-mono text-[var(--color-text-tertiary)] uppercase">
                                        {entry.inputFormat}
                                    </span>
                                    <ArrowRight size={8} className="text-[var(--color-text-tertiary)]" />
                                    <span className="text-[10px] font-mono text-[var(--color-accent)] uppercase">
                                        {entry.outputFormat}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <p className="text-[10px] text-[var(--color-text-tertiary)]">
                                    {formatFileSize(entry.inputSize)} → {formatFileSize(entry.outputSize)}
                                </p>
                                <p className="text-[10px] text-[var(--color-text-tertiary)]">
                                    {new Date(entry.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {history.length > 3 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-1 py-2 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={12} />
                            Show less
                        </>
                    ) : (
                        <>
                            <ChevronDown size={12} />
                            Show {history.length - 3} more
                        </>
                    )}
                </button>
            )}
        </motion.div>
    );
}
