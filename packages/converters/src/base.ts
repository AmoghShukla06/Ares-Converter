/** Base interface for all converters */
export interface Converter {
    /** Human-readable name */
    name: string;
    /** Supported input extensions */
    inputFormats: string[];
    /** Supported output extensions */
    outputFormats: string[];
    /** Check if this converter supports the given conversion */
    supports(inputExt: string, outputExt: string): boolean;
    /** Run the conversion */
    convert(
        input: File,
        outputFormat: string,
        options?: ConvertOptions,
        onProgress?: (progress: number) => void,
    ): Promise<Blob>;
}

export interface ConvertOptions {
    quality?: number; // 0-100
    compression?: number; // 0-100
    width?: number;
    height?: number;
    bitrate?: string;
    sampleRate?: number;
    preset?: string;
}
