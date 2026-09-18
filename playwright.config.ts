import { defineConfig, devices } from '@playwright/test'

const port = process.env.E2E_PORT ?? '3000'
const baseURL = `http://localhost:${port}`

export default defineConfig({
    testDir: './e2e',
    globalSetup: './e2e/global-setup.ts',
    fullyParallel: true,
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
        env: { E2E_MOCK_AI: 'true' }
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
})
