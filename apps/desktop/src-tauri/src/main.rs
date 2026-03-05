#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::Manager;

/// Run a native FFmpeg command for video/audio conversion.
/// Falls back to the web app's ffmpeg.wasm if the native binary is not found.
#[tauri::command]
fn convert_with_ffmpeg(
    input_path: String,
    output_path: String,
    args: Vec<String>,
) -> Result<String, String> {
    let mut cmd = Command::new("ffmpeg");
    cmd.arg("-i").arg(&input_path);
    for arg in &args {
        cmd.arg(arg);
    }
    cmd.arg("-y").arg(&output_path);

    match cmd.output() {
        Ok(output) => {
            if output.status.success() {
                Ok(format!("Converted: {}", output_path))
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                Err(format!("FFmpeg error: {}", stderr))
            }
        }
        Err(e) => Err(format!("Failed to run FFmpeg: {}. Make sure FFmpeg is installed.", e)),
    }
}

/// Get system information for the about dialog
#[tauri::command]
fn get_system_info() -> String {
    format!(
        "Ares Converter v1.0.0\nOS: {} {}\nArch: {}",
        std::env::consts::OS,
        std::env::consts::FAMILY,
        std::env::consts::ARCH,
    )
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_with_ffmpeg, get_system_info])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Ares Converter");
}
