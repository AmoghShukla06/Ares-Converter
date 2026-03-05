import { Converter, ConvertOptions } from './base';

const DOC_INPUT = ['txt', 'md', 'html', 'csv'];
const DOC_OUTPUT = ['txt', 'html', 'md', 'csv'];

/**
 * Document converter for text-based formats.
 * Handles TXT, Markdown, HTML, and CSV conversions without external dependencies.
 * For DOCX/PDF conversions, use the DocumentAdvancedConverter (requires mammoth.js / pdf-lib).
 */
export class DocumentConverter implements Converter {
    name = 'Document Converter';
    inputFormats = DOC_INPUT;
    outputFormats = DOC_OUTPUT;

    supports(inputExt: string, outputExt: string): boolean {
        return (
            this.inputFormats.includes(inputExt.toLowerCase()) &&
            this.outputFormats.includes(outputExt.toLowerCase())
        );
    }

    async convert(
        input: File,
        outputFormat: string,
        _options?: ConvertOptions,
        onProgress?: (progress: number) => void,
    ): Promise<Blob> {
        onProgress?.(10);
        const text = await input.text();
        const inputExt = input.name.split('.').pop()?.toLowerCase() ?? '';

        onProgress?.(40);
        let result: string;

        if (inputExt === outputFormat) {
            result = text;
        } else if (inputExt === 'md' && outputFormat === 'html') {
            result = this.mdToHtml(text);
        } else if (inputExt === 'html' && outputFormat === 'md') {
            result = this.htmlToMd(text);
        } else if (inputExt === 'html' && outputFormat === 'txt') {
            result = this.htmlToTxt(text);
        } else if (inputExt === 'md' && outputFormat === 'txt') {
            result = this.mdToTxt(text);
        } else if (inputExt === 'txt' && outputFormat === 'html') {
            result = this.txtToHtml(text);
        } else if (inputExt === 'txt' && outputFormat === 'md') {
            result = text; // TXT is already valid markdown
        } else if (inputExt === 'csv' && outputFormat === 'html') {
            result = this.csvToHtml(text);
        } else {
            result = text;
        }

        onProgress?.(100);
        const mime = outputFormat === 'html' ? 'text/html' : 'text/plain';
        return new Blob([result], { type: `${mime};charset=utf-8` });
    }

    private mdToHtml(md: string): string {
        let html = md
            // Headers
            .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
            .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
            .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
            .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
            .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
            .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
            // Bold + Italic
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Code
            .replace(/`(.+?)`/g, '<code>$1</code>')
            // Links
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
            // Line breaks → paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted</title></head><body><p>${html}</p></body></html>`;
    }

    private htmlToMd(html: string): string {
        return html
            .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, (_, content) => `# ${content}\n\n`)
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
            .replace(/<code>(.*?)<\/code>/gi, '`$1`')
            .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<[^>]+>/g, '')
            .trim();
    }

    private htmlToTxt(html: string): string {
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
    }

    private mdToTxt(md: string): string {
        return md
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/`(.+?)`/g, '$1')
            .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
            .trim();
    }

    private txtToHtml(txt: string): string {
        const escaped = txt
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const body = escaped
            .split('\n\n')
            .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
            .join('\n');
        return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted</title></head><body>${body}</body></html>`;
    }

    private csvToHtml(csv: string): string {
        const rows = csv.trim().split('\n');
        const headerCells = rows[0]
            .split(',')
            .map((c) => `<th>${c.trim()}</th>`)
            .join('');
        const bodyRows = rows
            .slice(1)
            .map(
                (row) =>
                    '<tr>' + row.split(',').map((c) => `<td>${c.trim()}</td>`).join('') + '</tr>',
            )
            .join('\n');

        return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted</title>
<style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f4f4f4}</style>
</head><body><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></body></html>`;
    }
}
