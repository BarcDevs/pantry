/**
 * @jest-environment node
 */
jest.mock('@/config/env', () => ({
    __esModule: true,
    default: {}
}))

import env from '@/config/env'

import { createSearchClient } from '../create-search-client'

describe('createSearchClient', () => {
    it('returns null when no key is configured', () => {
        env.youcomApiKey = undefined
        expect(createSearchClient()).toBeNull()
    })

    it('returns a client when a key is configured', () => {
        env.youcomApiKey = 'k'
        expect(createSearchClient()).not.toBeNull()
    })
})
