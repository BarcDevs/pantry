import { execSync, spawnSync } from 'child_process'
import { existsSync } from 'fs'

const files = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(f => /\.(ts|tsx|js|mjs|jsx)$/.test(f) && existsSync(f))

if (!files.length) process.exit(0)

const extraArgs = process.argv.slice(2)
const result = spawnSync(
    process.execPath,
    ['node_modules/eslint/bin/eslint.js', '--no-warn-ignored', ...extraArgs, ...files],
    { stdio: 'inherit' }
)
process.exit(result.status ?? 0)
