import type { SearchLanguage } from '@/constants/search'

export type SearchResult = {
    url: string
    title: string
}

export type RecipeSearchClient = {
    search: (
        query: string,
        options: { language: SearchLanguage }
    ) => Promise<SearchResult[]>
}
