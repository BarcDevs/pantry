import { execSync } from 'child_process'
import { existsSync } from 'fs'

const files = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(f => /\.(ts|tsx|js|mjs|jsx)$/.test(f) && existsSync(f))

if (!files.length) process.exit(0)

try {
    const extraArgs = process.argv.slice(2).join(' ')
    execSync(`npx eslint --no-warn-ignored ${extraArgs} ${files.join(' ')}`,
        { stdio: 'inherit', shell: true })
} catch (e) {
    process.exit(e.status ?? 1)
}
