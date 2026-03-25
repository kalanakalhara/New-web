import type { ThemeDefinition } from '../types/theme'

// Auto-discovers all themes/*/index.ts at build time — no manual imports needed.
// To add a new theme, just create its directory with an index.ts barrel file.
const modules = import.meta.glob<{ default: ThemeDefinition }>(
    '../themes/*/index.ts',
    { eager: true }
)

export const themeRegistry: Record<string, ThemeDefinition> = {}

for (const path in modules) {
    const theme = modules[path]?.default
    if (theme?.key) {
        themeRegistry[theme.key] = theme
    }
}

export function getThemeDefinition(themeName: string): ThemeDefinition {
    return themeRegistry[themeName] || themeRegistry['default']
}