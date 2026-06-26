import nextJest from 'next/jest.js'

import type { Config } from 'jest'

const createJestConfig = nextJest({
    dir: './'
})

const config: Config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/e2e/'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(bson|mongodb)/)'
    ]
}

export default createJestConfig(config)
