/** Format a file size in bytes to a human-readable string */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Generate a unique ID */
export function uid(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Format duration in seconds to mm:ss or hh:mm:ss */
export function formatDuration(seconds: number): string {
    if (!seconds || seconds < 0) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Estimate output file size based on quality/compression */
export function estimateOutputSize(
    inputSize: number,
    quality: number,
    compression: number,
): number {
    const qualityFactor = quality / 100;
    const compressionFactor = 1 - compression / 100;
    return Math.round(inputSize * qualityFactor * compressionFactor * 0.8 + inputSize * 0.1);
}

/** Get file extension from filename */
export function getExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() ?? '';
}

/** Generate output filename */
export function generateOutputFileName(
    inputName: string,
    targetFormat: string,
    customName?: string,
): string {
    const baseName = customName || inputName.replace(/\.[^.]+$/, '');
    return `${baseName}.${targetFormat}`;
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Delay promise */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Check if Web Workers are available */
export function supportsWorkers(): boolean {
    return typeof Worker !== 'undefined';
}

/** Check if Web Share API is available */
export function supportsShare(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
}

/** Check if the app is running in a secure context (HTTPS or localhost) */
export function isSecureContext(): boolean {
    return typeof window !== 'undefined' && window.isSecureContext;
}
