import { recipesTexts } from '@/constants/texts/recipes'

export const SparsePantryWarning = () => (
    <p className={'rounded-lg bg-border-3 px-3 py-2.5 text-label text-ink-3'}>
        {recipesTexts.generate.sparsePantryWarning}
    </p>
)
