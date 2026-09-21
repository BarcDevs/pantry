import { secondInMs } from '@/constants/time'

export const searchEndpointUrl = 'https://ydc-index.io/v1/search'
export const searchRequestTimeoutMs = 5 * secondInMs
export const webSearchBudgetMs = 25 * secondInMs
export const maxCandidatesPerStage = 3
export const searchResultsCount = 10
export const searchSafeSearchLevel = 'moderate'

export const SearchLanguage = {
    Hebrew: 'HE',
    English: 'EN'
} as const
export type SearchLanguage = typeof SearchLanguage[keyof typeof SearchLanguage]

export const excludedSearchDomains = [
    'youtube.com',
    'youtu.be',
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'pinterest.com',
    'x.com',
    'twitter.com',
    'reddit.com'
]
