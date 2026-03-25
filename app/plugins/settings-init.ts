export default defineNuxtPlugin(async () => {
    const { loadSettings } = useAppSettings()
    const { setActiveTheme } = useActiveTheme()

    try {
        const settings = await loadSettings()
        setActiveTheme(settings.name)
    } catch (error) {
        console.error('Failed to load settings:', error)
        setActiveTheme('default')
    }
})