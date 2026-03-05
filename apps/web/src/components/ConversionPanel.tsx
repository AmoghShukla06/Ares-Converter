import { motion } from 'framer-motion';
import { Sparkles, Scale, Package, Settings2 } from 'lucide-react';
import { ConversionPreset, PRESETS, PresetConfig } from '@ares/utils';
import { formatFileSize, estimateOutputSize } from '@ares/utils';

interface ConversionPanelProps {
    quality: number;
    compression: number;
    preset: ConversionPreset;
    inputSize: number;
    onQualityChange: (v: number) => void;
    onCompressionChange: (v: number) => void;
    onPresetChange: (p: ConversionPreset) => void;
}

const PRESET_ICONS: Record<ConversionPreset, React.ReactNode> = {
    'high-quality': <Sparkles size={14} />,
    balanced: <Scale size={14} />,
    'small-size': <Package size={14} />,
    custom: <Settings2 size={14} />,
};

export function ConversionPanel({
    quality,
    compression,
    preset,
    inputSize,
    onQualityChange,
    onCompressionChange,
    onPresetChange,
}: ConversionPanelProps) {
    const estimatedSize = estimateOutputSize(inputSize, quality, compression);

    const handlePreset = (p: ConversionPreset) => {
        onPresetChange(p);
        if (p !== 'custom') {
            const config = PRESETS[p];
            onQualityChange(config.quality);
            onCompressionChange(config.compression);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
        >
            {/* Presets */}
            <div>
                <label className="block text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">
                    Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.entries(PRESETS) as [ConversionPreset, PresetConfig][]).map(
                        ([key, config]) => (
                            <button
                                key={key}
                                onClick={() => handlePreset(key)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200
                  ${preset === key
                                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                                        : 'border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                            >
                                {PRESET_ICONS[key]}
                                <span className="truncate">{config.label}</span>
                            </button>
                        ),
                    )}
                </div>
            </div>

            {/* Quality slider */}
            <Slider
                label="Quality"
                value={quality}
                onChange={(v) => {
                    onQualityChange(v);
                    onPresetChange('custom');
                }}
                min={1}
                max={100}
                suffix="%"
                color="var(--color-accent)"
            />

            {/* Compression slider */}
            <Slider
                label="Compression"
                value={compression}
                onChange={(v) => {
                    onCompressionChange(v);
                    onPresetChange('custom');
                }}
                min={0}
                max={100}
                suffix="%"
                color="var(--color-warning)"
            />

            {/* Size estimate */}
            {inputSize > 0 && (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                    <span className="text-xs text-[var(--color-text-tertiary)]">Estimated output</span>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        ~{formatFileSize(estimatedSize)}
                    </span>
                </div>
            )}
        </motion.div>
    );
}

// ─── Slider sub-component ────────────────────────────────────

function Slider({
    label,
    value,
    onChange,
    min,
    max,
    suffix,
    color,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    suffix: string;
    color: string;
}) {
    const pct = ((value - min) / (max - min)) * 100;

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    {label}
                </label>
                <span className="text-sm font-semibold text-[var(--color-text-primary)] tabular-nums">
                    {value}{suffix}
                </span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--color-bg-tertiary) ${pct}%, var(--color-bg-tertiary) 100%)`,
                    }}
                />
            </div>
        </div>
    );
}
