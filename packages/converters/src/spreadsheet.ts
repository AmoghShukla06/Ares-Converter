import { Converter, ConvertOptions } from './base';
import * as XLSX from 'xlsx';

export class SpreadsheetConverter implements Converter {
    name = 'Spreadsheet Converter';
    inputFormats = ['xls', 'xlsx', 'ods', 'csv'];
    outputFormats = ['xlsx', 'csv', 'ods', 'html', 'txt'];

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
        onProgress?.(10);

        const data = await input.arrayBuffer();
        onProgress?.(40);

        // Read workbook
        const wb = XLSX.read(data, { type: 'array' });
        onProgress?.(70);

        // Get extension for writing
        const formatMap: Record<string, XLSX.BookType> = {
            'xlsx': 'xlsx',
            'csv': 'csv',
            'ods': 'ods',
            'html': 'html',
            'txt': 'txt'
        };
        const bookType = formatMap[outputFormat.toLowerCase()] || 'xlsx';

        // Write
        const outArray = XLSX.write(wb, { bookType, type: 'array' });
        onProgress?.(100);

        const mimeMap: Record<string, string> = {
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv': 'text/csv',
            'ods': 'application/vnd.oasis.opendocument.spreadsheet',
            'html': 'text/html',
            'txt': 'text/plain'
        };

        return new Blob([outArray], { type: mimeMap[bookType] || 'application/octet-stream' });
    }
}
