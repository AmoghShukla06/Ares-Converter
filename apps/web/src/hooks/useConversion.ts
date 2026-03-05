import { useState, useCallback, useRef } from 'react';
import {
    ConversionJob,
    ConversionPreset,
    ConversionStatus,
    HistoryEntry,
} from '@ares/utils';
import { uid, generateOutputFileName, estimateOutputSize } from '@ares/utils';
import { engine } from '@ares/converters';
import { getFormatFromFileName } from '@ares/utils';

const MAX_HISTORY = 50;

export function useConversion() {
    const [jobs, setJobsState] = useState<ConversionJob[]>([]);
    const jobsRef = useRef<ConversionJob[]>([]);

    const setJobs = useCallback((updater: React.SetStateAction<ConversionJob[]>) => {
        setJobsState(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            jobsRef.current = next;
            return next;
        });
    }, []);

    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        try {
            const stored = localStorage.getItem('ares-history');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const activeJobsRef = useRef<Map<string, AbortController>>(new Map());

    // ─── Add files to queue ────────────────────────────────────

    const addFiles = useCallback(
        (files: File[], outputFormat: string, preset: ConversionPreset = 'balanced', quality = 75, compression = 50) => {
            const newJobs: ConversionJob[] = files.map((file) => ({
                id: uid(),
                fileName: file.name,
                fileSize: file.size,
                inputFormat: file.name.split('.').pop()?.toLowerCase() ?? '',
                outputFormat,
                status: 'queued' as ConversionStatus,
                progress: 0,
                inputFile: file,
                preset,
                quality,
                compression,
                outputFileName: generateOutputFileName(file.name, outputFormat),
            }));

            setJobs((prev) => [...prev, ...newJobs]);
            return newJobs;
        },
        [],
    );

    // ─── Start conversion ─────────────────────────────────────

    const startConversion = useCallback(
        async (jobId: string) => {
            setJobs((prev) =>
                prev.map((j) =>
                    j.id === jobId
                        ? { ...j, status: 'converting' as ConversionStatus, startedAt: Date.now(), progress: 0 }
                        : j,
                ),
            );

            // Fetch the actual latest job safely via ref
            const currentJob = jobsRef.current.find((j) => j.id === jobId);

            if (!currentJob) return;

            try {
                const blob = await engine.convert(
                    currentJob.inputFile,
                    currentJob.outputFormat,
                    {
                        quality: currentJob.quality,
                        compression: currentJob.compression,
                    },
                    (progress) => {
                        setJobs((prev) =>
                            prev.map((j) => (j.id === jobId ? { ...j, progress } : j)),
                        );
                    },
                );

                const completedAt = Date.now();
                setJobs((prev) =>
                    prev.map((j) =>
                        j.id === jobId
                            ? {
                                ...j,
                                status: 'completed' as ConversionStatus,
                                progress: 100,
                                outputBlob: blob,
                                completedAt,
                            }
                            : j,
                    ),
                );

                // Add to history
                const entry: HistoryEntry = {
                    id: uid(),
                    fileName: currentJob.fileName,
                    inputFormat: currentJob.inputFormat,
                    outputFormat: currentJob.outputFormat,
                    inputSize: currentJob.fileSize,
                    outputSize: blob.size,
                    timestamp: completedAt,
                    duration: completedAt - (currentJob.startedAt ?? completedAt),
                };

                setHistory((prev) => {
                    const updated = [entry, ...prev].slice(0, MAX_HISTORY);
                    localStorage.setItem('ares-history', JSON.stringify(updated));
                    return updated;
                });
            } catch (err) {
                setJobs((prev) =>
                    prev.map((j) =>
                        j.id === jobId
                            ? {
                                ...j,
                                status: 'failed' as ConversionStatus,
                                error: err instanceof Error ? err.message : 'Conversion failed',
                            }
                            : j,
                    ),
                );
            }
        },
        [jobs],
    );

    // ─── Convert all queued jobs ──────────────────────────────

    const convertAll = useCallback(async () => {
        const queued = jobs.filter((j) => j.status === 'queued');
        for (const job of queued) {
            await startConversion(job.id);
        }
    }, [jobs, startConversion]);

    // ─── Cancel a job ─────────────────────────────────────────

    const cancelJob = useCallback((jobId: string) => {
        activeJobsRef.current.get(jobId)?.abort();
        activeJobsRef.current.delete(jobId);
        setJobs((prev) =>
            prev.map((j) =>
                j.id === jobId ? { ...j, status: 'cancelled' as ConversionStatus } : j,
            ),
        );
    }, []);

    // ─── Remove a job from queue ──────────────────────────────

    const removeJob = useCallback((jobId: string) => {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }, []);

    // ─── Clear all jobs ───────────────────────────────────────

    const clearJobs = useCallback(() => {
        setJobs([]);
    }, []);

    // ─── Download output ─────────────────────────────────────

    const downloadOutput = useCallback((job: ConversionJob) => {
        if (!job.outputBlob) return;
        const url = URL.createObjectURL(job.outputBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = job.outputFileName ?? `converted.${job.outputFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    // ─── Share output ─────────────────────────────────────────

    const shareOutput = useCallback(async (job: ConversionJob) => {
        if (!job.outputBlob || !navigator.share) return;

        const fileName = job.outputFileName ?? `converted.${job.outputFormat}`;
        const file = new File([job.outputBlob], fileName, { type: job.outputBlob.type });

        try {
            await navigator.share({
                title: 'Ares Converter',
                text: `Converted ${job.fileName} to ${job.outputFormat.toUpperCase()}`,
                files: [file],
            });
        } catch {
            // User cancelled or share API not supported with files
        }
    }, []);

    // ─── Clear history ────────────────────────────────────────

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem('ares-history');
    }, []);

    // ─── Estimated size ───────────────────────────────────────

    const getEstimatedSize = useCallback(
        (inputSize: number, quality: number, compression: number) => {
            return estimateOutputSize(inputSize, quality, compression);
        },
        [],
    );

    return {
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
        getEstimatedSize,
    };
}
