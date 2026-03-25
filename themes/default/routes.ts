import type { ThemeRouteItem } from '../../types/theme'

export default [
    {
        name: 'default-home',
        path: '/',
        component: () => import('./pages/home.vue')
    },
    {
        name: 'default-about',
        path: '/about',
        component: () => import('./pages/about.vue')
    }
] satisfies ThemeRouteItem[]