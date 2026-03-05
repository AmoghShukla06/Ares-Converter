import { motion } from 'framer-motion';
import { FileIcon, Image, Film, Music, FileText, Archive, Type, BookOpen, BarChart3, Presentation, X } from 'lucide-react';
import { formatFileSize, getFormatFromFileName, FormatCategory } from '@ares/utils';

interface FilePreviewProps {
    file: globalThis.File;
    onRemove: () => void;
}

const CATEGORY_ICONS: Record<FormatCategory, React.ReactNode> = {
    video: <Film size={20} />,
    audio: <Music size={20} />,
    image: <Image size={20} />,
    document: <FileText size={20} />,
    presentation: <Presentation size={20} />,
    spreadsheet: <BarChart3 size={20} />,
    ebook: <BookOpen size={20} />,
    archive: <Archive size={20} />,
    subtitle: <Type size={20} />,
    font: <Type size={20} />,
    unknown: <FileIcon size={20} />,
};

export function FilePreview({ file, onRemove }: FilePreviewProps) {
    const format = getFormatFromFileName(file.name);
    const category = format?.category ?? 'unknown';
    const ext = format?.extension?.toUpperCase() ?? 'FILE';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)] transition-all duration-200"
        >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(category)}`}>
                {CATEGORY_ICONS[category]}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`format-badge ${category}`}>{ext}</span>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                        {formatFileSize(file.size)}
                    </span>
                </div>
            </div>

            {/* Remove button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Remove file"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}

function getCategoryColor(category: FormatCategory): string {
    const map: Record<FormatCategory, string> = {
        video: 'bg-indigo-500/15 text-indigo-400',
        audio: 'bg-green-500/15 text-green-400',
        image: 'bg-amber-500/15 text-amber-400',
        document: 'bg-blue-500/15 text-blue-400',
        presentation: 'bg-orange-500/15 text-orange-400',
        spreadsheet: 'bg-teal-500/15 text-teal-400',
        ebook: 'bg-pink-500/15 text-pink-400',
        archive: 'bg-red-500/15 text-red-400',
        subtitle: 'bg-purple-500/15 text-purple-400',
        font: 'bg-gray-500/15 text-gray-400',
        unknown: 'bg-gray-500/15 text-gray-400',
    };
    return map[category];
}
