# Ares Converter — Architecture Overview

## Monorepo Structure

Ares Converter uses **pnpm workspaces** to manage a cross-platform monorepo.

### Apps

- **`apps/web`** — The primary web application built with Vite, React, TypeScript, and TailwindCSS v4. Uses Framer Motion for animations and the Canvas API for image conversions.
- **`apps/desktop`** — Tauri desktop app wrapping the web frontend with a Rust backend. Provides native file system access, FFmpeg integration, and system share dialogs.
- **`apps/mobile`** — Expo (React Native) mobile app with file picker, local conversion, and sharing capabilities.

### Packages

- **`packages/utils`** — Shared types, format registry (180+ formats), MIME type mappings, and utility functions.
- **`packages/converters`** — Conversion engine with specialized converters for images (Canvas API), subtitles (SRT/VTT/ASS), and documents (MD/HTML/TXT/CSV).

## Conversion Pipeline

```
User drops file  →  Format detected  →  Output format selected
                                              ↓
                                     ConversionEngine.convert()
                                              ↓
                                     Route to specialized converter
                                              ↓
                                 ImageConverter / SubtitleConverter / DocumentConverter
                                              ↓
                                     Output Blob generated
                                              ↓
                                    Download / Share / History
```

## Privacy Architecture

- **No network requests** — The app makes zero outbound API calls. The only network request is loading Google Fonts (Inter) from the CDN.
- **No storage on servers** — Files are processed in-memory using the Canvas API, ArrayBuffers, or text manipulation.
- **No telemetry** — No analytics SDK, no error reporting, no usage tracking.
- **LocalStorage only** — Conversion history and theme preference are stored in the browser's localStorage. No IndexedDB, no server-side storage.

## Adding New Converters

1. Create a new class implementing the `Converter` interface from `packages/converters/src/base.ts`
2. Register it in `packages/converters/src/engine.ts` by adding to the `converters` array
3. Add format mappings in `packages/utils/src/formats.ts` if needed
