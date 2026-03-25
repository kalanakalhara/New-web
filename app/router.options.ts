import type { RouterConfig } from '@nuxt/schema'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import { themeRegistry } from '../lib/theme-loader'

/**
 * Collect every unique route path from all themes.
 * For each path, create a wrapper component that resolves the correct
 * theme component at runtime based on the active theme.
 */
export default {
    routes: () => {
        // Build a map: path → { themeName → componentLoader }
        const pathMap = new Map<string, Record<string, () => Promise<any>>>()

        for (const theme of Object.values(themeRegistry)) {
            for (const route of theme.routes) {
                if (!pathMap.has(route.path)) {
                    pathMap.set(route.path, {})
                }
                pathMap.get(route.path)![theme.key] = route.component
            }
        }

        return Array.from(pathMap.entries()).map(([path, componentsByTheme]) => {
            // Derive a stable route name from the path
            const name = 'theme-route-' + path.replace(/\//g, '-').replace(/:/g, '').replace(/^-/, '') || 'index'

            // Wrapper component: resolves the active theme's component at runtime
            const wrapper = defineComponent({
                name: 'ThemeRouteWrapper',
                setup() {
                    const activeThemeName = useState<string>('active-theme-name', () => 'default')

                    const AsyncComp = computed(() => {
                        // Pick the active theme's component loader, fall back to default
                        const loader =
                            componentsByTheme[activeThemeName.value] ??
                            componentsByTheme['default']

                        if (!loader) return null

                        return defineAsyncComponent(loader)
                    })

                    return () => AsyncComp.value ? h(AsyncComp.value) : null
                }
            })

            return {
                name,
                path,
                component: wrapper,
            }
        })
    },
} satisfies RouterConfig