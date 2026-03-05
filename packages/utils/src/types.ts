// ─── Format Categories ───────────────────────────────────────────

export type FormatCategory =
    | 'video'
    | 'audio'
    | 'image'
    | 'document'
    | 'presentation'
    | 'spreadsheet'
    | 'ebook'
    | 'archive'
    | 'subtitle'
    | 'font'
    | 'unknown';

// ─── Format Descriptor ──────────────────────────────────────────

export interface FormatDescriptor {
    extension: string;
    label: string;
    mime: string;
    category: FormatCategory;
    convertibleTo: string[]; // extensions
}

// ─── Conversion Job ─────────────────────────────────────────────

export type ConversionStatus =
    | 'queued'
    | 'converting'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'paused';

export interface ConversionJob {
    id: string;
    fileName: string;
    fileSize: number;
    inputFormat: string;
    outputFormat: string;
    status: ConversionStatus;
    progress: number; // 0-100
    eta?: number; // seconds remaining
    startedAt?: number;
    completedAt?: number;
    error?: string;
    inputFile: File;
    outputBlob?: Blob;
    preset?: ConversionPreset;
    quality?: number; // 0-100
    compression?: number; // 0-100
    outputFileName?: string;
}

// ─── Presets ────────────────────────────────────────────────────

export type ConversionPreset = 'high-quality' | 'balanced' | 'small-size' | 'custom';

export interface PresetConfig {
    name: string;
    label: string;
    description: string;
    quality: number;
    compression: number;
    icon: string;
}

export const PRESETS: Record<ConversionPreset, PresetConfig> = {
    'high-quality': {
        name: 'high-quality',
        label: 'High Quality',
        description: 'Maximum quality, larger file size',
        quality: 95,
        compression: 10,
        icon: '✨',
    },
    balanced: {
        name: 'balanced',
        label: 'Balanced',
        description: 'Good quality with reasonable file size',
        quality: 75,
        compression: 50,
        icon: '⚖️',
    },
    'small-size': {
        name: 'small-size',
        label: 'Small Size',
        description: 'Smaller file, reduced quality',
        quality: 50,
        compression: 80,
        icon: '📦',
    },
    custom: {
        name: 'custom',
        label: 'Custom',
        description: 'Set your own quality and compression',
        quality: 75,
        compression: 50,
        icon: '🎛️',
    },
};

// ─── Conversion History ─────────────────────────────────────────

export interface HistoryEntry {
    id: string;
    fileName: string;
    inputFormat: string;
    outputFormat: string;
    inputSize: number;
    outputSize: number;
    timestamp: number;
    duration: number; // ms
}

// ─── Share Target ───────────────────────────────────────────────

export interface ShareTarget {
    id: string;
    label: string;
    icon: string;
    available: boolean;
}
