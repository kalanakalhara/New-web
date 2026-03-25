import type { ThemeDefinition } from '../../types/theme'
import config from './theme.config'
import routes from './routes'

export default {
    ...config,
    routes,
} satisfies ThemeDefinition
