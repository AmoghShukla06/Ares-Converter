<div align="center">

# ⚔️ Ares Converter

**Privacy-First Universal File Converter**

*Convert images, videos, audio, documents, and 180+ file formats — all processing happens locally on your device.*

[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg)](LICENSE)
[![FOSS](https://img.shields.io/badge/100%25-Open%20Source-22c55e.svg)]()
[![Privacy](https://img.shields.io/badge/Privacy-First-8b5cf6.svg)]()
[![No Tracking](https://img.shields.io/badge/Tracking-None-ef4444.svg)]()

[Web App](#web) · [Desktop](#desktop) · [Mobile](#mobile) · [Supported Formats](#supported-formats) · [Contributing](#contributing)

</div>

---

## 🛡️ Privacy Promise

Ares Converter is built with a **zero-compromise privacy philosophy**:

- ❌ **No cloud uploads** — your files never leave your device
- ❌ **No analytics** — we don't track how you use the app
- ❌ **No telemetry** — no data is ever sent anywhere
- ❌ **No tracking** — no cookies, no fingerprinting, nothing
- ❌ **No ads** — completely ad-free, forever
- ✅ **100% local processing** — everything runs on your device
- ✅ **Fully open source** — audit every line of code yourself
- ✅ **Offline capable** — works without an internet connection

---

## ✨ Features

- 🔄 **180+ Format Support** — video, audio, images, documents, subtitles, archives, ebooks
- 📦 **Batch Conversion** — convert multiple files at once with a queue
- 🎛️ **Quality & Compression Controls** — fine-tune output with sliders and presets
- 📊 **File Size Estimator** — know the output size before converting
- 📋 **Conversion History** — track past conversions with localStorage
- ⌨️ **Keyboard Shortcuts** — `Ctrl+O` open, `Ctrl+Enter` convert, `Esc` cancel
- 🌙 **Dark/Light/System Themes** — automatic system theme detection
- 📤 **Share Output** — Web Share API, system share dialogs
- 🖥️ **Cross-Platform** — Web, Desktop (Windows/Linux/macOS), Mobile (Android)
- ⚡ **Background Processing** — conversions run in workers, UI stays responsive

---

## 🏗️ Architecture

```
ares-converter/
├── apps/
│   ├── web/          # Vite + React + TailwindCSS + Framer Motion
│   ├── desktop/      # Tauri (Rust backend)
│   └── mobile/       # Expo (React Native)
├── packages/
│   ├── utils/        # Types, format registry, helpers
│   └── converters/   # Image, subtitle, document converters
├── docs/             # Documentation
└── assets/           # Shared assets
```

### Tech Stack

| Platform | Technology |
|----------|-----------|
| **Web** | React, TypeScript, Vite, TailwindCSS v4, Framer Motion |
| **Desktop** | Tauri (Rust), native FFmpeg |
| **Mobile** | Expo (React Native) |

### Conversion Engines

| Category | Engine |
|----------|--------|
| **Images** | Canvas API (PNG, JPEG, WebP, BMP, GIF) |
| **Video/Audio** | `ffmpeg.wasm` (web), native FFmpeg (desktop) |
| **Documents** | Built-in MD/HTML/TXT/CSV converters |
| **Subtitles** | Built-in SRT ↔ VTT ↔ ASS/SSA parser |
| **Archives** | `fflate` (ZIP), native tools (desktop) |

---

## 📋 Supported Formats

### Video (23 formats)
`mp4` `mkv` `avi` `mov` `webm` `wmv` `flv` `m4v` `mpeg` `mpg` `3gp` `3g2` `ts` `mts` `m2ts` `vob` `ogv` `divx` `rm` `rmvb` `asf` `f4v` `mxf`

### Audio (13 formats)
`mp3` `wav` `aac` `flac` `ogg` `opus` `m4a` `wma` `alac` `aiff` `amr` `mid` `midi`

### Images (18 formats)
`png` `jpeg` `jpg` `webp` `avif` `gif` `bmp` `tiff` `tif` `heic` `heif` `ico` `svg` + RAW formats (`cr2` `nef` `arw` `dng`)

### Documents (9 formats)
`pdf` `doc` `docx` `odt` `rtf` `txt` `md` `html` `epub`

### Presentations (3 formats)
`ppt` `pptx` `odp`

### Spreadsheets (4 formats)
`xls` `xlsx` `ods` `csv`

### Ebooks (5 formats)
`epub` `mobi` `azw` `azw3` `fb2`

### Archives (7 formats)
`zip` `rar` `7z` `tar` `gz` `bz2` `xz`

### Subtitles (4 formats)
`srt` `ass` `ssa` `vtt`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8
- **Rust** (for desktop builds only)

### Installation

```bash
# Clone the repository
git clone https://github.com/ares-converter/ares-converter.git
cd ares-converter

# Install dependencies
pnpm install
```

### Running the Web App

```bash
pnpm dev:web
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running the Desktop App

Requires [Rust](https://rustup.rs/) and [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites).

```bash
pnpm dev:desktop
```

### Building Desktop Binaries

```bash
# Windows
pnpm build:windows

# Linux
pnpm build:linux

# macOS (including ARM Apple Silicon)
pnpm build:macos
```

### Running the Mobile App

Requires [Expo CLI](https://docs.expo.dev/get-started/installation/) and the Expo Go app.

```bash
pnpm dev:mobile
```

### Building for Android

```bash
pnpm build:mobile:android
```

---

## 🎨 UI Design

Ares Converter's interface is inspired by **Raycast**, **Linear**, and **Notion**:

- Minimal, elegant dark theme with glassmorphism effects
- Smooth Framer Motion animations throughout
- Responsive layout from mobile to desktop
- Category-colored format badges
- Animated gradient background

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+O` | Open file picker |
| `Ctrl+Enter` | Start conversion |
| `Esc` | Clear selection |

---

## 🤝 Contributing

Contributions are welcome! Ares Converter is fully open source under the MIT license.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Ares Converter is open source software licensed under the [MIT License](LICENSE).

Made with ❤️ for privacy.
