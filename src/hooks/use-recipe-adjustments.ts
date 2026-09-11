import { useState } from 'react'

import { recipesTexts } from '@/constants/texts/recipes'

export const useRecipeAdjustments = () => {
    const [instruction, setInstruction] = useState('')
    const [usedReplacements, setUsedReplacements] = useState<Record<string, boolean>>({})
    const [usedRemovals, setUsedRemovals] = useState<Record<string, boolean>>({})

    const toggleLine = (
        line: string,
        isOn: boolean
    ) => {
        setInstruction((current) => (
            isOn
                ? current.split('\n').filter((entry) => entry.trim() !== line).join('\n')
                : (current ? `${current}\n${line}` : line)
        ))
    }

    const toggleReplacement = (ingredientName: string, replacementName: string) => {
        const isOn = !!usedReplacements[ingredientName]

        setUsedReplacements((current) => ({ ...current, [ingredientName]: !isOn }))
        toggleLine(recipesTexts.result.replacementAdjustmentLine(replacementName, ingredientName), isOn)
    }

    const toggleRemoval = (ingredientName: string) => {
        const isOn = !!usedRemovals[ingredientName]

        setUsedRemovals((current) => ({ ...current, [ingredientName]: !isOn }))
        toggleLine(recipesTexts.result.removalAdjustmentLine(ingredientName), isOn)
    }

    const reset = () => {
        setInstruction('')
        setUsedReplacements({})
        setUsedRemovals({})
    }

    return {
        instruction,
        setInstruction,
        usedReplacements,
        toggleReplacement,
        usedRemovals,
        toggleRemoval,
        reset
    }
}
