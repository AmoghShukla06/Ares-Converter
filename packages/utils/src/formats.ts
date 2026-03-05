import { FormatCategory, FormatDescriptor } from './types';

// ─── Video Formats ──────────────────────────────────────────────
const VIDEO_EXTENSIONS = [
    'mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v', 'mpeg', 'mpg',
    '3gp', '3g2', 'ts', 'mts', 'm2ts', 'vob', 'ogv', 'divx', 'rm', 'rmvb',
    'asf', 'f4v', 'mxf',
] as const;

const VIDEO_TARGETS = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v', 'mpeg', '3gp', 'ogv', 'ts'];

// ─── Audio Formats ──────────────────────────────────────────────
const AUDIO_EXTENSIONS = [
    'mp3', 'wav', 'aac', 'flac', 'ogg', 'opus', 'm4a', 'wma', 'alac', 'aiff', 'amr', 'mid', 'midi',
] as const;

const AUDIO_TARGETS = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'opus', 'm4a', 'wma', 'aiff'];

// ─── Image Formats ──────────────────────────────────────────────
const IMAGE_EXTENSIONS = [
    'png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'tif', 'heic', 'heif', 'ico', 'svg',
    'cr2', 'nef', 'arw', 'dng', 'orf', 'rw2', 'pef', 'srw',
] as const;

const IMAGE_TARGETS = ['png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'];

// ─── Document Formats ───────────────────────────────────────────
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md', 'html', 'epub'] as const;
const DOCUMENT_TARGETS = ['pdf', 'docx', 'txt', 'html', 'md'];

// ─── Presentation Formats ───────────────────────────────────────
const PRESENTATION_EXTENSIONS = ['ppt', 'pptx', 'odp'] as const;
const PRESENTATION_TARGETS = ['pptx', 'pdf', 'odp'];

// ─── Spreadsheet Formats ────────────────────────────────────────
const SPREADSHEET_EXTENSIONS = ['xls', 'xlsx', 'ods', 'csv'] as const;
const SPREADSHEET_TARGETS = ['xlsx', 'csv', 'ods'];

// ─── Ebook Formats ──────────────────────────────────────────────
const EBOOK_EXTENSIONS = ['epub', 'mobi', 'azw', 'azw3', 'fb2'] as const;
const EBOOK_TARGETS = ['epub', 'pdf', 'txt'];

// ─── Archive Formats ────────────────────────────────────────────
const ARCHIVE_EXTENSIONS = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'] as const;
const ARCHIVE_TARGETS = ['zip', 'tar', 'gz'];

// ─── Subtitle Formats ──────────────────────────────────────────
const SUBTITLE_EXTENSIONS = ['srt', 'ass', 'ssa', 'vtt'] as const;
const SUBTITLE_TARGETS = ['srt', 'ass', 'vtt'];

// ─── MIME Map ───────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
    // Video
    mp4: 'video/mp4', mkv: 'video/x-matroska', avi: 'video/x-msvideo',
    mov: 'video/quicktime', webm: 'video/webm', wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv', m4v: 'video/x-m4v', mpeg: 'video/mpeg',
    mpg: 'video/mpeg', '3gp': 'video/3gpp', '3g2': 'video/3gpp2',
    ts: 'video/mp2t', mts: 'video/mp2t', m2ts: 'video/mp2t',
    vob: 'video/dvd', ogv: 'video/ogg', divx: 'video/divx',
    rm: 'application/vnd.rn-realmedia', rmvb: 'application/vnd.rn-realmedia-vbr',
    asf: 'video/x-ms-asf', f4v: 'video/mp4', mxf: 'application/mxf',
    // Audio
    mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac',
    flac: 'audio/flac', ogg: 'audio/ogg', opus: 'audio/opus',
    m4a: 'audio/mp4', wma: 'audio/x-ms-wma', alac: 'audio/mp4',
    aiff: 'audio/aiff', amr: 'audio/amr', mid: 'audio/midi', midi: 'audio/midi',
    // Image
    png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg',
    webp: 'image/webp', avif: 'image/avif', gif: 'image/gif',
    bmp: 'image/bmp', tiff: 'image/tiff', tif: 'image/tiff',
    heic: 'image/heic', heif: 'image/heif', ico: 'image/x-icon',
    svg: 'image/svg+xml', cr2: 'image/x-canon-cr2', nef: 'image/x-nikon-nef',
    arw: 'image/x-sony-arw', dng: 'image/x-adobe-dng',
    // Document
    pdf: 'application/pdf', doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    odt: 'application/vnd.oasis.opendocument.text', rtf: 'application/rtf',
    txt: 'text/plain', md: 'text/markdown', html: 'text/html',
    // Presentation
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    odp: 'application/vnd.oasis.opendocument.presentation',
    // Spreadsheet
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ods: 'application/vnd.oasis.opendocument.spreadsheet', csv: 'text/csv',
    // Ebook
    epub: 'application/epub+zip', mobi: 'application/x-mobipocket-ebook',
    azw: 'application/vnd.amazon.ebook', azw3: 'application/vnd.amazon.ebook',
    fb2: 'application/x-fictionbook+xml',
    // Archive
    zip: 'application/zip', rar: 'application/vnd.rar',
    '7z': 'application/x-7z-compressed', tar: 'application/x-tar',
    gz: 'application/gzip', bz2: 'application/x-bzip2', xz: 'application/x-xz',
    // Subtitle
    srt: 'application/x-subrip', ass: 'text/x-ssa', ssa: 'text/x-ssa',
    vtt: 'text/vtt',
};

// ─── Build the Registry ─────────────────────────────────────────

function buildFormats<T extends readonly string[]>(
    extensions: T,
    category: FormatCategory,
    targets: string[],
): FormatDescriptor[] {
    return extensions.map((ext) => ({
        extension: ext,
        label: ext.toUpperCase(),
        mime: MIME_MAP[ext] || 'application/octet-stream',
        category,
        convertibleTo: targets.filter((t) => t !== ext),
    }));
}

const ALL_FORMATS: FormatDescriptor[] = [
    ...buildFormats(VIDEO_EXTENSIONS, 'video', VIDEO_TARGETS),
    ...buildFormats(AUDIO_EXTENSIONS, 'audio', AUDIO_TARGETS),
    ...buildFormats(IMAGE_EXTENSIONS, 'image', IMAGE_TARGETS),
    ...buildFormats(DOCUMENT_EXTENSIONS, 'document', DOCUMENT_TARGETS),
    ...buildFormats(PRESENTATION_EXTENSIONS, 'presentation', PRESENTATION_TARGETS),
    ...buildFormats(SPREADSHEET_EXTENSIONS, 'spreadsheet', SPREADSHEET_TARGETS),
    ...buildFormats(EBOOK_EXTENSIONS, 'ebook', EBOOK_TARGETS),
    ...buildFormats(ARCHIVE_EXTENSIONS, 'archive', ARCHIVE_TARGETS),
    ...buildFormats(SUBTITLE_EXTENSIONS, 'subtitle', SUBTITLE_TARGETS),
];

// ─── Registry API ───────────────────────────────────────────────

const byExtension = new Map<string, FormatDescriptor>();
ALL_FORMATS.forEach((f) => byExtension.set(f.extension, f));

/** Get format descriptor from file extension (without dot) */
export function getFormat(extension: string): FormatDescriptor | undefined {
    return byExtension.get(extension.toLowerCase().replace(/^\./, ''));
}

/** Get format from a filename */
export function getFormatFromFileName(fileName: string): FormatDescriptor | undefined {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? getFormat(ext) : undefined;
}

/** Detect category from a file extension */
export function detectCategory(extension: string): FormatCategory {
    return getFormat(extension)?.category ?? 'unknown';
}

/** List all formats in a category */
export function getFormatsByCategory(category: FormatCategory): FormatDescriptor[] {
    return ALL_FORMATS.filter((f) => f.category === category);
}

/** Get valid conversion targets for a given extension */
export function getConversionTargets(extension: string): string[] {
    return getFormat(extension)?.convertibleTo ?? [];
}

/** All supported extensions */
export function getAllExtensions(): string[] {
    return ALL_FORMATS.map((f) => f.extension);
}

/** All supported categories */
export function getAllCategories(): FormatCategory[] {
    return [...new Set(ALL_FORMATS.map((f) => f.category))];
}

/** Get MIME type for extension */
export function getMimeType(extension: string): string {
    return MIME_MAP[extension.toLowerCase().replace(/^\./, '')] ?? 'application/octet-stream';
}

/** All registered formats */
export const FORMAT_REGISTRY = ALL_FORMATS;

/** Count of all supported formats */
export const FORMAT_COUNT = ALL_FORMATS.length;
