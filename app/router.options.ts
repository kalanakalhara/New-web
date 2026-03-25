import type { RouterConfig } from '@nuxt/schema'
import { themeRegistry } from '../lib/theme-loader'

export default {
    routes: () => {
        const routeMap = new Map<string, any>()

        for (const theme of Object.values(themeRegistry)) {
            for (const route of theme.routes) {
                if (!routeMap.has(route.path)) {
                    routeMap.set(route.path, {
                        name: route.name,
                        path: route.path,
                        component: route.component
                    })
                }
            }
        }

        return Array.from(routeMap.values())
    }
} satisfies RouterConfig