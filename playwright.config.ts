import { defineConfig, devices } from '@playwright/test'

const port = process.env.E2E_PORT ?? '3000'
const baseURL = `http://localhost:${port}`

export default defineConfig({
    testDir: './e2e',
    globalSetup: './e2e/global-setup.ts',
    fullyParallel: true,
    /**
     * CI runs one `next dev` server (not a production build) against one
     * Mongo instance - 2 parallel workers hitting both at once caused
     * intermittent `waitForURL` timeouts on heavier actions (recipe
     * generation) that never reproduced locally or under an isolated
     * single-worker run. One worker trades CI wall-clock time for
     * determinism; local runs keep full parallelism.
     */
    workers: process.env.CI ? 1 : undefined,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL,
        trace: 'on-first-retry'
    },
    webServer: {
        command: `npm run dev -- -p ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI && port === '3000',
        timeout: 120000,
        env: {
            E2E_MOCK_AI: 'true',
            E2E_MOCK_SEARCH: 'true',
            E2E_MOCK_EMAIL: 'true'
        }
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
})
