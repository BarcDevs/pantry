import { useState } from 'react'

import { recipesTexts } from '@/constants/texts/recipes'

export const useRecipeAdjustments = () => {
    const [instruction, setInstruction] = useState('')
    const [usedReplacements, setUsedReplacements] = useState<Record<string, boolean>>({})

    const toggleReplacement = (ingredientName: string, replacementName: string) => {
        const line = recipesTexts.result.replacementAdjustmentLine(replacementName, ingredientName)
        const isOn = !!usedReplacements[ingredientName]

        setUsedReplacements((current) => ({ ...current, [ingredientName]: !isOn }))
        setInstruction((current) => (
            isOn
                ? current.split('\n').filter((entry) => entry.trim() !== line).join('\n')
                : (current ? `${current}\n${line}` : line)
        ))
    }

    const reset = () => {
        setInstruction('')
        setUsedReplacements({})
    }

    return {
        instruction,
        setInstruction,
        usedReplacements,
        toggleReplacement,
        reset
    }
}
