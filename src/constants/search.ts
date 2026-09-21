import { FoodType } from '@/types/enums'

import { secondInMs } from '@/constants/time'

export const searchEndpointUrl = 'https://ydc-index.io/v1/search'
export const searchRequestTimeoutMs = 3 * secondInMs
export const candidateFetchTimeoutMs = 3 * secondInMs
export const webSearchBudgetMs = 15 * secondInMs
export const hebrewStageBudgetMs = 9 * secondInMs
export const maxCandidatesPerStage = 3
export const aiStructuringTimeoutMs = 8 * secondInMs
export const conversionTimeoutMs = 8 * secondInMs
export const queryTranslationTimeoutMs = 3 * secondInMs
export const minBudgetForEnglishStageMs = 6 * secondInMs
export const minStepBudgetMs = secondInMs
export const maxQueryIngredients = 4
export const searchResultsCount = 10
export const searchSafeSearchLevel = 'moderate'

export const SearchLanguage = {
    Hebrew: 'HE',
    English: 'EN'
} as const
export type SearchLanguage = typeof SearchLanguage[keyof typeof SearchLanguage]

/** Pantry categories a search query draws its ingredients from, most useful first. Others rank last. */
export const queryCategoryPriority: Array<FoodType> = [
    FoodType.Meat,
    FoodType.Fish,
    FoodType.Eggs,
    FoodType.Vegetables,
    FoodType.Dairy,
    FoodType.Grains
]

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
