import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark';
        return (localStorage.getItem('ares-theme') as Theme) || 'system';
    });

    const [resolved, setResolved] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        function resolve() {
            if (theme === 'system') {
                setResolved(mediaQuery.matches ? 'dark' : 'light');
            } else {
                setResolved(theme);
            }
        }

        resolve();
        mediaQuery.addEventListener('change', resolve);
        return () => mediaQuery.removeEventListener('change', resolve);
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(resolved);
        localStorage.setItem('ares-theme', theme);
    }, [resolved, theme]);

    const setTheme = (t: Theme) => setThemeState(t);
    const toggle = () => {
        const next: Theme = resolved === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    return { theme, resolved, setTheme, toggle };
}
