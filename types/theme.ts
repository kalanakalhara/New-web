export interface ThemeColors {
    background: string
    surface: string
    primary: string
    secondary: string
    accent: string
    text_primary: string
    text_secondary: string
    text_inverse: string
    success: string
    warning: string
    danger: string
    info: string
    shadow: string
}

export interface ThemeColorModes {
    light: ThemeColors
    dark: ThemeColors
}

export interface AppSettings {
    name: string
    author: string
    version: string
    colors: ThemeColorModes
}

export interface ThemeRouteItem {
    name: string
    path: string
    component: () => Promise<any>
}

export interface ThemeDefinition {
    key: string
    label: string
    routes: ThemeRouteItem[]
}