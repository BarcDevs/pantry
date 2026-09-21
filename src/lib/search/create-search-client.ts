import type { RecipeSearchClient } from '@/lib/search/types'
import { createYouSearchClient } from '@/lib/search/you-search-client'

import env from '@/config/env'

export const createSearchClient = (): RecipeSearchClient | null =>
    env.youcomApiKey
        ? createYouSearchClient(env.youcomApiKey)
        : null
