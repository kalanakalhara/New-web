import type { ThemeDefinition } from '../types/theme'

import defaultRoutes from '../themes/default/routes'
import theme1Routes from '../themes/theme1/routes'

export const themeRegistry: Record<string, ThemeDefinition> = {
    default: {
        key: 'default',
        label: 'Default Theme',
        routes: defaultRoutes
    },
    theme1: {
        key: 'theme1',
        label: 'Theme 1',
        routes: theme1Routes
    }
}

export function getThemeDefinition(themeName: string): ThemeDefinition {
    return themeRegistry[themeName] || themeRegistry.default
}