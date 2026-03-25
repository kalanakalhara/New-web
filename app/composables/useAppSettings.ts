import type { AppSettings } from '../../types/theme'

export const useAppSettings = () => {
    const settings = useState<AppSettings | null>('app-settings', () => null)
    const loaded = useState<boolean>('app-settings-loaded', () => false)

    async function loadSettings() {
        if (loaded.value && settings.value) {
            return settings.value
        }

        const { apiBase } = useRuntimeConfig().public
        const data = await $fetch<AppSettings>(`${apiBase}/settings/`)
        settings.value = data
        loaded.value = true

        return data
    }

    return {
        settings,
        loaded,
        loadSettings
    }
}