import { Converter, ConvertOptions } from './base';

interface SubtitleEntry {
    index: number;
    startTime: string;
    endTime: string;
    text: string;
}

const SUBTITLE_FORMATS = ['srt', 'vtt', 'ass', 'ssa'];

/**
 * Subtitle converter — fully text-based, no external dependencies.
 * Supports SRT ↔ VTT ↔ ASS/SSA conversions.
 */
export class SubtitleConverter implements Converter {
    name = 'Subtitle Converter';
    inputFormats = SUBTITLE_FORMATS;
    outputFormats = SUBTITLE_FORMATS;

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

        onProgress?.(30);
        const entries = this.parse(text, inputExt);

        onProgress?.(60);
        const output = this.serialize(entries, outputFormat.toLowerCase());

        onProgress?.(100);
        return new Blob([output], { type: 'text/plain;charset=utf-8' });
    }

    // ─── Parsers ───────────────────────────────────────────────────

    private parse(text: string, format: string): SubtitleEntry[] {
        switch (format) {
            case 'srt':
                return this.parseSRT(text);
            case 'vtt':
                return this.parseVTT(text);
            case 'ass':
            case 'ssa':
                return this.parseASS(text);
            default:
                throw new Error(`Unsupported input format: ${format}`);
        }
    }

    private parseSRT(text: string): SubtitleEntry[] {
        const blocks = text.trim().split(/\n\s*\n/);
        return blocks.map((block) => {
            const lines = block.trim().split('\n');
            const index = parseInt(lines[0], 10);
            const [startTime, endTime] = (lines[1] ?? '').split(' --> ').map((t) => t.trim());
            const content = lines.slice(2).join('\n');
            return { index, startTime, endTime, text: content };
        });
    }

    private parseVTT(text: string): SubtitleEntry[] {
        const blocks = text
            .replace(/^WEBVTT.*\n\n?/, '')
            .trim()
            .split(/\n\s*\n/);
        return blocks.map((block, i) => {
            const lines = block.trim().split('\n');
            let timeLineIdx = 0;
            for (let j = 0; j < lines.length; j++) {
                if (lines[j].includes('-->')) {
                    timeLineIdx = j;
                    break;
                }
            }
            const [startTime, endTime] = lines[timeLineIdx]
                .split(' --> ')
                .map((t) => t.trim().replace('.', ','));
            const content = lines.slice(timeLineIdx + 1).join('\n');
            return { index: i + 1, startTime, endTime, text: content };
        });
    }

    private parseASS(text: string): SubtitleEntry[] {
        const lines = text.split('\n');
        const entries: SubtitleEntry[] = [];
        let idx = 1;
        for (const line of lines) {
            if (line.startsWith('Dialogue:')) {
                const parts = line.substring(10).split(',');
                if (parts.length >= 10) {
                    const startTime = this.assTimeToSrt(parts[1].trim());
                    const endTime = this.assTimeToSrt(parts[2].trim());
                    const content = parts.slice(9).join(',').replace(/\{[^}]*\}/g, '').trim();
                    entries.push({ index: idx++, startTime, endTime, text: content });
                }
            }
        }
        return entries;
    }

    // ─── Serializers ───────────────────────────────────────────────

    private serialize(entries: SubtitleEntry[], format: string): string {
        switch (format) {
            case 'srt':
                return this.serializeSRT(entries);
            case 'vtt':
                return this.serializeVTT(entries);
            case 'ass':
            case 'ssa':
                return this.serializeASS(entries);
            default:
                throw new Error(`Unsupported output format: ${format}`);
        }
    }

    private serializeSRT(entries: SubtitleEntry[]): string {
        return entries
            .map((e) => `${e.index}\n${e.startTime} --> ${e.endTime}\n${e.text}`)
            .join('\n\n');
    }

    private serializeVTT(entries: SubtitleEntry[]): string {
        const header = 'WEBVTT\n\n';
        return (
            header +
            entries
                .map((e) => {
                    const start = e.startTime.replace(',', '.');
                    const end = e.endTime.replace(',', '.');
                    return `${start} --> ${end}\n${e.text}`;
                })
                .join('\n\n')
        );
    }

    private serializeASS(entries: SubtitleEntry[]): string {
        const header = `[Script Info]
Title: Converted by Ares Converter
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,48,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,2,1,2,10,10,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;

        const dialogues = entries
            .map((e) => {
                const start = this.srtTimeToAss(e.startTime);
                const end = this.srtTimeToAss(e.endTime);
                return `Dialogue: 0,${start},${end},Default,,0,0,0,,${e.text}`;
            })
            .join('\n');

        return header + dialogues;
    }

    // ─── Time Helpers ─────────────────────────────────────────────

    private assTimeToSrt(assTime: string): string {
        // ASS: h:mm:ss.cc → SRT: hh:mm:ss,mmm
        const parts = assTime.split(':');
        if (parts.length !== 3) return assTime;
        const h = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const secParts = parts[2].split('.');
        const s = secParts[0].padStart(2, '0');
        const cs = secParts[1] ?? '00';
        const ms = (parseInt(cs, 10) * 10).toString().padStart(3, '0');
        return `${h}:${m}:${s},${ms}`;
    }

    private srtTimeToAss(srtTime: string): string {
        // SRT: hh:mm:ss,mmm → ASS: h:mm:ss.cc
        const clean = srtTime.replace(',', '.');
        const parts = clean.split(':');
        if (parts.length !== 3) return srtTime;
        const h = parseInt(parts[0], 10).toString();
        const m = parts[1].padStart(2, '0');
        const secParts = parts[2].split('.');
        const s = secParts[0].padStart(2, '0');
        const ms = secParts[1] ?? '000';
        const cs = Math.round(parseInt(ms, 10) / 10)
            .toString()
            .padStart(2, '0');
        return `${h}:${m}:${s}.${cs}`;
    }
}
