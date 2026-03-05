import { Converter, ConvertOptions } from './base';
import { ImageConverter } from './image';
import { SubtitleConverter } from './subtitle';
import { DocumentConverter } from './document';
import { ArchiveConverter } from './archive';
import { SpreadsheetConverter } from './spreadsheet';
import { PdfConverter } from './pdf';

/**
 * Master converter — routes conversion requests to the right specialized converter.
 * This is the main entry point for all conversions.
 */
export class ConversionEngine {
    private converters: Converter[] = [];

    constructor() {
        this.converters = [
            new ImageConverter(),
            new SubtitleConverter(),
            new DocumentConverter(),
            new ArchiveConverter(),
            new SpreadsheetConverter(),
            new PdfConverter(),
        ];
    }

    /** Add a custom converter dynamically (e.g. FFmpegWebConverter) */
    registerConverter(converter: Converter) {
        // Unshift so dynamic converters take precedence over default ones
        this.converters.unshift(converter);
    }

    /** Find a converter that supports the given conversion */
    findConverter(inputExt: string, outputExt: string): Converter | undefined {
        return this.converters.find((c) => c.supports(inputExt, outputExt));
    }

    /** Check if a conversion is supported */
    canConvert(inputExt: string, outputExt: string): boolean {
        return !!this.findConverter(inputExt, outputExt);
    }

    /** Run a conversion */
    async convert(
        input: File,
        outputFormat: string,
        options?: ConvertOptions,
        onProgress?: (progress: number) => void,
    ): Promise<Blob> {
        const inputExt = input.name.split('.').pop()?.toLowerCase() ?? '';
        const converter = this.findConverter(inputExt, outputFormat);

        if (!converter) {
            throw new Error(
                `No converter available for ${inputExt.toUpperCase()} → ${outputFormat.toUpperCase()}`,
            );
        }

        return converter.convert(input, outputFormat, options, onProgress);
    }

    /** Get all supported input formats */
    getSupportedInputFormats(): string[] {
        const formats = new Set<string>();
        this.converters.forEach((c) => c.inputFormats.forEach((f) => formats.add(f)));
        return [...formats];
    }

    /** Get all supported output formats for a given input */
    getSupportedOutputFormats(inputExt: string): string[] {
        const formats = new Set<string>();
        this.converters.forEach((c) => {
            if (c.inputFormats.includes(inputExt.toLowerCase())) {
                c.outputFormats.forEach((f) => formats.add(f));
            }
        });
        // Remove the input format itself
        formats.delete(inputExt.toLowerCase());
        return [...formats];
    }
}

// Singleton instance
export const engine = new ConversionEngine();
