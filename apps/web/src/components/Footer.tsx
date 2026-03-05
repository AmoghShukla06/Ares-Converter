import { motion } from 'framer-motion';
import { Shield, Cpu, WifiOff, LucideIcon } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-[var(--color-border-primary)] mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Privacy badges */}
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <Badge icon={Shield} label="No tracking" />
                        <Badge icon={WifiOff} label="Offline capable" />
                        <Badge icon={Cpu} label="Local processing" />
                    </div>

                    {/* Credits */}
                    <div className="text-xs text-[var(--color-text-tertiary)] text-center sm:text-right">
                        <p>
                            <span className="font-medium text-[var(--color-text-secondary)]">Ares Converter</span>
                            {' '}— FOSS · MIT License
                        </p>
                        <p className="mt-0.5">
                            No ads · No analytics · No cloud uploads
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function Badge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
    return (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)]">
            <Icon size={12} />
            <span>{label}</span>
        </div>
    );
}
