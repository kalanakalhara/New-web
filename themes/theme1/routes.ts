import type { ThemeRouteItem } from '../../types/theme'

export default [
    {
        name: 'theme1-home',
        path: '/',
        component: () => import('./pages/home.vue')
    },
    {
        name: 'theme1-about',
        path: '/about',
        component: () => import('./pages/about.vue')
    },
    {
        name: 'theme1-restaurant',
        path: '/restaurants/:slug',
        component: () => import('./pages/restaurants/[slug].vue')
    },
    {
        name: 'theme1-restaurant-dishes',
        path: '/restaurants/:slug/dishes',
        component: () => import('./pages/restaurants/[slug]/dishes.vue')
    }
] satisfies ThemeRouteItem[]