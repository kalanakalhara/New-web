import { getThemeDefinition } from '../../lib/theme-loader'

export default defineNuxtRouteMiddleware(async (to) => {
    const { loadSettings, settings } = useAppSettings()
    const { activeThemeName, setActiveTheme } = useActiveTheme()

    if (!settings.value) {
        try {
            const appSettings = await loadSettings()
            setActiveTheme(appSettings.name)
        } catch {
            setActiveTheme('default')
        }
    }

    const activeTheme = getThemeDefinition(activeThemeName.value)

    const isAllowed = activeTheme.routes.some((route) => {
        const regexPattern = route.path
            .replace(/:[^/]+/g, '[^/]+')
            .replace(/\//g, '\\/')

        const regex = new RegExp(`^${regexPattern}$`)
        return regex.test(to.path)
    })

    if (!isAllowed) {
        return abortNavigation(createError({
            statusCode: 404,
            statusMessage: 'This page does not exist in the active theme'
        }))
    }
})