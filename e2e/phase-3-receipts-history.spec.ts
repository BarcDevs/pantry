import path from 'path'

import {
    type Browser,
    type BrowserContext,
    expect,
    type Page,
    test
} from '@playwright/test'

import { signUp } from './helpers/auth'

const RECEIPT_IMAGE = path.join(
    __dirname,
    'fixtures',
    'receipt.png'
)
const RECEIPT_PDF = path.join(
    __dirname,
    'fixtures',
    'receipt.pdf'
)

let sharedStorageState: Awaited<ReturnType<BrowserContext['storageState']>> | undefined

const createAuthedPage = async (browser: Browser): Promise<Page> => {
    const context = sharedStorageState
        ? await browser.newContext({ storageState: sharedStorageState })
        : await browser.newContext()
    return context.newPage()
}

const confirmReceiptReview = async (page: Page) => {
    await expect(page.getByText('עגבניות')).toBeVisible({ timeout: 20000 })
    await page.getByRole('button', { name: 'הוספה למזווה' }).click()
    await expect(page.getByText('הפריטים נוספו למזווה')).toBeVisible({ timeout: 15000 })
}

test.describe.configure({ mode: 'serial' })

test.describe('phase 3 - receipts and history', () => {
    test.beforeAll(async ({ browser }) => {
        test.setTimeout(60000)
        const page = await createAuthedPage(browser)
        await signUp(page)
        sharedStorageState = await page.context().storageState()
        await page.close()
    })

    test('scan a receipt image and add items to pantry', async ({ browser }) => {
        test.setTimeout(60000)
        const page = await createAuthedPage(browser)

        await page.goto('/add/receipt')
        await page.locator('#receipt-file-input').setInputFiles(RECEIPT_IMAGE)

        await confirmReceiptReview(page)

        await page.close()
    })

    test('scan a receipt PDF and add items to pantry', async ({ browser }) => {
        test.setTimeout(60000)
        const page = await createAuthedPage(browser)

        await page.goto('/add/receipt')
        await page.locator('#receipt-file-input').setInputFiles(RECEIPT_PDF)

        await confirmReceiptReview(page)

        await page.close()
    })

    test('import receipt items from a pasted URL', async ({ browser }) => {
        test.setTimeout(60000)
        const page = await createAuthedPage(browser)

        await page.goto('/add/paste')
        await page.getByPlaceholder('https://...').fill('https://example.com')
        await page.getByRole('button', { name: 'ייבוא', exact: true }).click()

        await confirmReceiptReview(page)

        await page.close()
    })

    test('import a recipe from a URL', async ({ browser }) => {
        test.setTimeout(60000)
        const page = await createAuthedPage(browser)

        await page.goto('/recipes/import')
        await page.getByPlaceholder('https://...').fill('https://example.com')
        await page.getByRole('button', { name: 'ייבוא', exact: true }).click()

        await expect(page.getByText('מתכון לדוגמה')).toBeVisible({ timeout: 20000 })
        await page.getByRole('button', { name: 'שמירה למתכונים שלי' }).click()
        await expect(page.getByText('המתכון נשמר')).toBeVisible({ timeout: 15000 })

        await page.close()
    })

    test('import a recipe from pasted text', async ({ browser }) => {
        test.setTimeout(60000)
        const page = await createAuthedPage(browser)

        await page.goto('/recipes/import')
        await page.getByRole('button', { name: 'טקסט', exact: true }).click()
        await page.getByPlaceholder('שם המתכון, מצרכים, אופן ההכנה...').fill(
            'מרק עדשים: עדשים, בצל, גזר. לבשל 30 דקות.'
        )
        await page.getByRole('button', { name: 'ייבוא', exact: true }).click()

        await expect(page.getByText('מתכון לדוגמה')).toBeVisible({ timeout: 20000 })
        await page.getByRole('button', { name: 'שמירה למתכונים שלי' }).click()
        await expect(page.getByText('המתכון נשמר')).toBeVisible({ timeout: 15000 })

        await page.close()
    })

    test('cooking history lists a cooked recipe and lets you edit its rating', async ({ browser }) => {
        test.setTimeout(120000)
        const page = await createAuthedPage(browser)

        await page.goto('/add')
        await page.getByRole('textbox', { name: 'שם המוצר' }).fill('עגבניות')
        await page.getByRole('spinbutton', { name: 'כמות' }).fill('2')
        await page.waitForTimeout(1000)
        await page.getByRole('button', { name: 'הוספה למזווה' }).click()
        await page.waitForURL('**/pantry', { timeout: 30000 })

        await page.goto('/generate')
        await page.getByRole('button', { name: 'רק מהמזווה' }).waitFor()
        await page.getByRole('button', { name: '✦ צור מתכון' }).click()
        await page.waitForURL('**/generate/result', { timeout: 30000 })

        await page.getByRole('button', { name: 'שמירה לספרייה' }).click()
        await expect(page.getByText('נשמר')).toBeVisible({ timeout: 15000 })

        await page.getByRole('button', { name: /התחל לבשל/ }).click()
        await page.waitForURL('**/recipes/*/cook', { timeout: 15000 })
        await page.getByRole('button', { name: 'סיום בישול' }).click()
        await page.waitForURL('**/recipes/*/deduct', { timeout: 15000 })
        await page.getByRole('button', { name: 'דלג - השאר את המזווה ללא שינוי' }).click()
        await page.waitForURL('**/recipes/*/rate', { timeout: 15000 })

        await page.getByRole('button', { name: '3 כוכבים' }).click()
        await page.getByRole('button', { name: 'סיום ושמירה בהיסטוריה' }).click()
        await page.waitForURL('**/pantry', { timeout: 15000 })

        await page.goto('/history')
        await expect(page.getByRole('heading', { name: 'היסטוריית בישול' })).toBeVisible()
        await expect(page.getByRole('button', { name: '3 כוכבים, נבחר' })).toBeVisible({ timeout: 15000 })

        await page.getByRole('button', { name: '5 כוכבים' }).click()
        await expect(page.getByRole('button', { name: '5 כוכבים, נבחר' })).toBeVisible({ timeout: 15000 })

        await page.close()
    })
})
