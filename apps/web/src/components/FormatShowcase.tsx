import { motion } from 'framer-motion';
import { Film, Music, Image, FileText, Archive, Type, BookOpen, BarChart3, Presentation, Zap } from 'lucide-react';
import { FORMAT_COUNT } from '@ares/utils';

const CATEGORIES = [
    { icon: Film, label: 'Video', count: 23, color: 'from-indigo-500 to-indigo-600' },
    { icon: Music, label: 'Audio', count: 13, color: 'from-green-500 to-emerald-600' },
    { icon: Image, label: 'Images', count: 18, color: 'from-amber-500 to-orange-600' },
    { icon: FileText, label: 'Documents', count: 9, color: 'from-blue-500 to-blue-600' },
    { icon: Presentation, label: 'Presentations', count: 3, color: 'from-orange-500 to-red-500' },
    { icon: BarChart3, label: 'Spreadsheets', count: 4, color: 'from-teal-500 to-cyan-600' },
    { icon: BookOpen, label: 'Ebooks', count: 5, color: 'from-pink-500 to-rose-600' },
    { icon: Archive, label: 'Archives', count: 7, color: 'from-red-500 to-red-600' },
    { icon: Type, label: 'Subtitles', count: 4, color: 'from-purple-500 to-violet-600' },
];

export function FormatShowcase() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] flex items-center justify-center">
                        <Zap size={12} className="text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Supported Formats
                    </h3>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)] tabular-nums">
                    {FORMAT_COUNT}+ formats
                </span>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2">
                {CATEGORIES.map((cat, i) => (
                    <motion.div
                        key={cat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                        className="group flex items-center gap-2.5 p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)] transition-all duration-200 cursor-default"
                    >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                            <cat.icon size={14} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                                {cat.label}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-tertiary)]">
                                {cat.count} formats
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
