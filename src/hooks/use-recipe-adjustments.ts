import { useState } from 'react'

import { recipesTexts } from '@/constants/texts/recipes'

type AdjustmentValues = {
    instruction: string
    usedReplacements: Record<string, boolean>
    chosenReplacements: Record<string, string>
    usedRemovals: Record<string, boolean>
}

const initialValues: AdjustmentValues = {
    instruction: '',
    usedReplacements: {},
    chosenReplacements: {},
    usedRemovals: {}
}

const toggleInstructionLine = (
    instruction: string,
    line: string,
    isOn: boolean
) => (
    isOn
        ? instruction.split(', ').filter((entry) => entry.trim() !== line).join(', ')
        : (instruction ? `${instruction}, ${line}` : line)
)

export const useRecipeAdjustments = () => {
    const [values, setValues] = useState<AdjustmentValues>(initialValues)

    const setField = <Key extends keyof AdjustmentValues>(
        key: Key,
        value: AdjustmentValues[Key]
    ) => setValues((current) => ({
        ...current,
        [key]: value
    }))

    const toggleReplacement = (
        ingredientName: string,
        ingredientLabel: string,
        replacementName: string
    ) => {
        const isOn = values.usedReplacements[ingredientName]
        const line = recipesTexts.result.replacementAdjustmentLine(replacementName, ingredientLabel)

        setValues((current) => ({
            ...current,
            usedReplacements: {
                ...current.usedReplacements,
                [ingredientName]: !isOn
            },
            instruction: toggleInstructionLine(
                current.instruction,
                line,
                isOn
            )
        }))
    }

    const chooseReplacement = (
        ingredientName: string,
        ingredientLabel: string,
        currentName: string,
        chosenName: string
    ) => setValues((current) => {
        const swapped = current.usedReplacements[ingredientName]
            ? toggleInstructionLine(
                toggleInstructionLine(
                    current.instruction,
                    recipesTexts.result.replacementAdjustmentLine(currentName, ingredientLabel),
                    true
                ),
                recipesTexts.result.replacementAdjustmentLine(chosenName, ingredientLabel),
                false
            )
            : current.instruction

        return {
            ...current,
            chosenReplacements: {
                ...current.chosenReplacements,
                [ingredientName]: chosenName
            },
            instruction: swapped
        }
    })

    const toggleRemoval = (ingredientName: string, ingredientLabel: string) => {
        const isOn = values.usedRemovals[ingredientName]
        const line = recipesTexts.result.removalAdjustmentLine(ingredientLabel)

        setValues((current) => ({
            ...current,
            usedRemovals: {
                ...current.usedRemovals,
                [ingredientName]: !isOn
            },
            instruction: toggleInstructionLine(
                current.instruction,
                line,
                isOn
            )
        }))
    }

    const reset = () => setValues(initialValues)

    return {
        values,
        setField,
        actions: {
            toggleReplacement,
            chooseReplacement,
            toggleRemoval,
            reset
        }
    }
}
