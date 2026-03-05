import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { engine, FFmpegWebConverter } from '@ares/converters';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';

// Initialize and register FFmpeg capability for web
const ffmpegWeb = new FFmpegWebConverter({ coreURL, wasmURL });
engine.registerConverter(ffmpegWeb);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
