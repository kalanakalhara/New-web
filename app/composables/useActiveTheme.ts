import { getThemeDefinition } from '../../lib/theme-loader'

export const useActiveTheme = () => {
    const activeThemeName = useState<string>('active-theme-name', () => 'default')

    function setActiveTheme(themeName: string) {
        activeThemeName.value = themeName || 'default'
    }

    const activeTheme = computed(() => getThemeDefinition(activeThemeName.value))

    return {
        activeThemeName,
        activeTheme,
        setActiveTheme
    }
}