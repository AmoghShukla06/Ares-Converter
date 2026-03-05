import { Converter, ConvertOptions } from './base';

const IMAGE_INPUT = ['png', 'jpeg', 'jpg', 'webp', 'gif', 'bmp', 'avif', 'tiff', 'tif', 'ico', 'svg'];
const IMAGE_OUTPUT = ['png', 'jpeg', 'jpg', 'webp', 'bmp', 'gif'];

/**
 * Image converter using the Canvas API.
 * Works in all modern browsers without external dependencies.
 */
export class ImageConverter implements Converter {
    name = 'Image Converter';
    inputFormats = IMAGE_INPUT;
    outputFormats = IMAGE_OUTPUT;

    supports(inputExt: string, outputExt: string): boolean {
        return (
            this.inputFormats.includes(inputExt.toLowerCase()) &&
            this.outputFormats.includes(outputExt.toLowerCase())
        );
    }

    async convert(
        input: File,
        outputFormat: string,
        options?: ConvertOptions,
        onProgress?: (progress: number) => void,
    ): Promise<Blob> {
        onProgress?.(10);

        const bitmap = await createImageBitmap(input);
        onProgress?.(30);

        let width = options?.width ?? bitmap.width;
        let height = options?.height ?? bitmap.height;

        // Maintain aspect ratio if only one dimension specified
        if (options?.width && !options?.height) {
            height = Math.round(bitmap.height * (options.width / bitmap.width));
        } else if (options?.height && !options?.width) {
            width = Math.round(bitmap.width * (options.height / bitmap.height));
        }

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not create canvas context');

        const mimeType = this.getMimeType(outputFormat);

        // Fix for transparent PNGs converting to JPEG (which doesn't support transparency)
        // Fill with white background first so transparent pixels don't become black
        if (mimeType === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(bitmap, 0, 0, width, height);
        onProgress?.(60);

        const quality = (options?.quality ?? 85) / 100;

        const blob = await canvas.convertToBlob({ type: mimeType, quality });
        onProgress?.(100);

        return blob;
    }

    private getMimeType(format: string): string {
        const map: Record<string, string> = {
            png: 'image/png',
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            webp: 'image/webp',
            bmp: 'image/bmp',
            gif: 'image/gif',
        };
        return map[format.toLowerCase()] ?? 'image/png';
    }
}
