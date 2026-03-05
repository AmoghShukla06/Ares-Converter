import { Converter, ConvertOptions } from './base';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export class PdfConverter implements Converter {
    name = 'PDF Converter';
    inputFormats = ['png', 'jpg', 'jpeg', 'txt'];
    outputFormats = ['pdf'];

    supports(inputExt: string, outputExt: string): boolean {
        return this.inputFormats.includes(inputExt.toLowerCase()) &&
            this.outputFormats.includes(outputExt.toLowerCase());
    }

    async convert(
        input: File,
        outputFormat: string,
        _options?: ConvertOptions,
        onProgress?: (progress: number) => void
    ): Promise<Blob> {
        if (outputFormat.toLowerCase() !== 'pdf') throw new Error("Only PDF output supported");

        const ext = input.name.split('.').pop()?.toLowerCase() || '';
        const pdfDoc = await PDFDocument.create();
        onProgress?.(30);

        if (ext === 'txt') {
            const text = await input.text();
            const page = pdfDoc.addPage();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const lines = text.split('\n');
            let y = page.getHeight() - 50;
            for (const line of lines) {
                if (y < 50) break; // Keep it simple and clip long documents for now
                page.drawText(line, { x: 50, y, size: 12, font });
                y -= 15;
            }
        } else {
            const imageBytes = await input.arrayBuffer();
            let image;
            if (ext === 'png') image = await pdfDoc.embedPng(imageBytes);
            else image = await pdfDoc.embedJpg(imageBytes);

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }

        onProgress?.(80);
        const pdfBytes = await pdfDoc.save();
        onProgress?.(100);

        return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    }
}
