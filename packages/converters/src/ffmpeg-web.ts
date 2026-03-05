import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Converter, ConvertOptions } from './base';
import { getMimeType } from '@ares/utils';

export interface FFmpegWebOptions {
    coreURL: string;
    wasmURL: string;
}

export class FFmpegWebConverter implements Converter {
    name = 'ffmpeg-web';
    private ffmpeg: FFmpeg;
    private loaded = false;
    private loadingPromise: Promise<void> | null = null;
    private options: FFmpegWebOptions;

    inputFormats = [
        // Video
        'mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v', 'mpeg', 'mpg',
        '3gp', '3g2', 'ts', 'mts', 'm2ts', 'vob', 'ogv', 'divx', 'rm', 'rmvb',
        'asf', 'f4v', 'mxf',
        // Audio
        'mp3', 'wav', 'aac', 'flac', 'ogg', 'opus', 'm4a', 'wma', 'alac', 'aiff', 'amr', 'mid', 'midi',
        // Images (added to expand available conversion options for users)
        'png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'tif', 'heic', 'heif', 'ico',
        'cr2', 'nef', 'arw', 'dng', 'orf', 'rw2', 'pef', 'srw'
    ];

    outputFormats = [
        // Video
        'mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'm4v', 'mpeg', '3gp', 'ogv', 'ts',
        // Audio
        'mp3', 'wav', 'aac', 'flac', 'ogg', 'opus', 'm4a', 'wma', 'aiff',
        // Images
        'png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico'
    ];

    constructor(options: FFmpegWebOptions) {
        this.options = options;
        this.ffmpeg = new FFmpeg();
    }

    supports(inputExt: string, outputExt: string): boolean {
        return this.inputFormats.includes(inputExt.toLowerCase()) &&
            this.outputFormats.includes(outputExt.toLowerCase());
    }

    async load() {
        if (this.loaded) return;
        if (this.loadingPromise) return this.loadingPromise;

        this.loadingPromise = this.ffmpeg.load({
            coreURL: this.options.coreURL,
            wasmURL: this.options.wasmURL,
        }).then(() => {
            this.loaded = true;
        });

        return this.loadingPromise;
    }

    async convert(
        input: File,
        outputFormat: string,
        options?: ConvertOptions,
        onProgress?: (progress: number) => void
    ): Promise<Blob> {
        await this.load();

        const inputExt = input.name.split('.').pop()?.toLowerCase();
        const inputName = `input_${Date.now()}.${inputExt}`;
        const outputName = `output_${Date.now()}.${outputFormat}`;

        let progressCallback = ({ progress }: { progress: number }) => {
            if (onProgress) {
                // ffmpeg progress is from 0 to 1
                onProgress(Math.round(progress * 100));
            }
        };

        this.ffmpeg.on('progress', progressCallback);

        // Write file and execute
        await this.ffmpeg.writeFile(inputName, await fetchFile(input));

        let args: string[] = [];

        // Ensure audio-to-video visualizer works
        const isAudioInput = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'opus', 'm4a', 'wma', 'aiff'].includes(inputExt || '');
        const isImageInput = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'avif', 'tiff'].includes(inputExt || '');
        const isVideoOutput = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', '3gp', 'flv', 'ogv'].includes(outputFormat.toLowerCase());

        if (isAudioInput && isVideoOutput) {
            args = [
                '-i', inputName,
                '-filter_complex', '[0:a]showwaves=s=1280x720:mode=line:colors=White[v]',
                '-map', '[v]',
                '-map', '0:a',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-pix_fmt', 'yuv420p',
                '-shortest'
            ];
        } else if (isImageInput && isVideoOutput) {
            // Create a 5-second video from a single image loop
            args = [
                '-loop', '1',
                '-i', inputName,
                '-c:v', 'libx264',
                '-t', '5',
                '-pix_fmt', 'yuv420p'
            ];
        } else {
            args = ['-i', inputName];
            // Very basic preset handling – this could be vastly expanded
            if (options?.preset === 'small') {
                args.push('-crf', '28');
            } else if (options?.preset === 'high') {
                args.push('-crf', '18');
            }
        }

        args.push(outputName);

        await this.ffmpeg.exec(args);

        const data = await this.ffmpeg.readFile(outputName);
        const mimeType = getMimeType(outputFormat);

        // Cleanup
        await this.ffmpeg.deleteFile(inputName);
        await this.ffmpeg.deleteFile(outputName);
        this.ffmpeg.off('progress', progressCallback);

        return new Blob([new Uint8Array(data as Uint8Array)], { type: mimeType });
    }
}
