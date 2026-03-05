import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Download, Share2, Loader2 } from 'lucide-react';
import { ConversionJob, ConversionStatus } from '@ares/utils';
import { formatFileSize, formatDuration } from '@ares/utils';

interface ProgressBarProps {
    jobs: ConversionJob[];
    onDownload: (job: ConversionJob) => void;
    onShare: (job: ConversionJob) => void;
    onCancel: (jobId: string) => void;
    onRemove: (jobId: string) => void;
}

export function ProgressPanel({ jobs, onDownload, onShare, onCancel, onRemove }: ProgressBarProps) {
    if (jobs.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
        >
            <h3 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Conversion Queue
            </h3>

            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onDownload={() => onDownload(job)}
                            onShare={() => onShare(job)}
                            onCancel={() => onCancel(job.id)}
                            onRemove={() => onRemove(job.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function JobCard({
    job,
    onDownload,
    onShare,
    onCancel,
    onRemove,
}: {
    job: ConversionJob;
    onDownload: () => void;
    onShare: () => void;
    onCancel: () => void;
    onRemove: () => void;
}) {
    const statusConfig = getStatusConfig(job.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10, height: 0 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]"
        >
            {/* Status icon */}
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${statusConfig.bg}`}>
                {job.status === 'converting' ? (
                    <Loader2 size={16} className={`${statusConfig.text} animate-spin`} />
                ) : (
                    <statusConfig.icon size={16} className={statusConfig.text} />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                        {job.fileName}
                    </p>
                    <span className="text-[10px] text-[var(--color-text-tertiary)] shrink-0">
                        → {job.outputFormat.toUpperCase()}
                    </span>
                </div>

                {/* Progress bar */}
                {(job.status === 'converting' || job.status === 'queued') && (
                    <div className="mt-2 w-full bg-[var(--color-bg-tertiary)] rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-gradient-start)] to-[var(--color-gradient-end)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${job.progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                )}

                {/* Status text */}
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${statusConfig.text}`}>
                        {job.status === 'converting'
                            ? `${job.progress}%`
                            : job.status === 'completed'
                                ? `${formatFileSize(job.outputBlob?.size ?? 0)}`
                                : job.status === 'failed'
                                    ? job.error ?? 'Failed'
                                    : statusConfig.label}
                    </span>
                    {job.eta != null && job.eta > 0 && (
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                            • ETA {formatDuration(job.eta)}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
                {job.status === 'completed' && (
                    <>
                        <button
                            onClick={onDownload}
                            className="p-2 rounded-lg text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                            title="Download"
                        >
                            <Download size={16} />
                        </button>
                        {typeof navigator !== 'undefined' && 'share' in navigator && (
                            <button
                                onClick={onShare}
                                className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                                title="Share"
                            >
                                <Share2 size={16} />
                            </button>
                        )}
                    </>
                )}
                {(job.status === 'converting' || job.status === 'queued') && (
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                        title="Cancel"
                    >
                        <X size={16} />
                    </button>
                )}
                {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && (
                    <button
                        onClick={onRemove}
                        className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                        title="Remove"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

function getStatusConfig(status: ConversionStatus) {
    switch (status) {
        case 'queued':
            return { icon: Loader2, bg: 'bg-[var(--color-bg-tertiary)]', text: 'text-[var(--color-text-tertiary)]', label: 'Queued' };
        case 'converting':
            return { icon: Loader2, bg: 'bg-[var(--color-accent)]/15', text: 'text-[var(--color-accent)]', label: 'Converting...' };
        case 'completed':
            return { icon: Check, bg: 'bg-[var(--color-success)]/15', text: 'text-[var(--color-success)]', label: 'Completed' };
        case 'failed':
            return { icon: AlertCircle, bg: 'bg-[var(--color-danger)]/15', text: 'text-[var(--color-danger)]', label: 'Failed' };
        case 'cancelled':
            return { icon: X, bg: 'bg-[var(--color-warning)]/15', text: 'text-[var(--color-warning)]', label: 'Cancelled' };
        case 'paused':
            return { icon: Loader2, bg: 'bg-[var(--color-warning)]/15', text: 'text-[var(--color-warning)]', label: 'Paused' };
    }
}
