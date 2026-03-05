import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Shield, Github } from 'lucide-react';

interface HeaderProps {
    theme: 'dark' | 'light' | 'system';
    resolved: 'dark' | 'light';
    onThemeChange: (t: 'dark' | 'light' | 'system') => void;
    onToggle: () => void;
}

export function Header({ theme, resolved, onThemeChange, onToggle }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-[var(--color-border-primary)] glass-card">
            <div className="max-w-6xl w-full mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    className="flex items-center gap-3 shrink-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center shadow-lg shadow-black/10 overflow-hidden border border-[var(--color-border-primary)]">
                        <img src="/logo.png" alt="Ares Converter Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                            Ares Converter
                        </h1>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] leading-none tracking-wide uppercase">
                            Privacy-First
                        </p>
                    </div>
                </motion.div>

                {/* Right side */}
                <motion.div
                    className="flex items-center gap-2 shrink-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* Privacy badge */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-medium">
                        <Shield size={12} />
                        <span>100% Local</span>
                    </div>

                    {/* Theme toggle */}
                    <div className="flex items-center rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-0.5">
                        <ThemeButton
                            active={theme === 'light'}
                            onClick={() => onThemeChange('light')}
                            title="Light mode"
                        >
                            <Sun size={14} />
                        </ThemeButton>
                        <ThemeButton
                            active={theme === 'system'}
                            onClick={() => onThemeChange('system')}
                            title="System theme"
                        >
                            <Monitor size={14} />
                        </ThemeButton>
                        <ThemeButton
                            active={theme === 'dark'}
                            onClick={() => onThemeChange('dark')}
                            title="Dark mode"
                        >
                            <Moon size={14} />
                        </ThemeButton>
                    </div>

                    {/* GitHub link */}
                    <a
                        href="https://github.com/ares-converter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200"
                        title="View on GitHub"
                    >
                        <Github size={18} />
                    </a>
                </motion.div>
            </div>
        </header>
    );
}

function ThemeButton({
    active,
    onClick,
    title,
    children,
}: {
    active: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-md transition-all duration-200 ${active
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                }`}
        >
            {children}
        </button>
    );
}
