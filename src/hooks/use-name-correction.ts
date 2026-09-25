import { useState } from 'react'

import type {
    FieldValues,
    Path,
    UseFormReturn
} from 'react-hook-form'
import { useWatch } from 'react-hook-form'

type Correction = {
    from: string
    to: string
}

export const useNameCorrection = <T extends FieldValues>(
    form: UseFormReturn<T>,
    fieldName: Path<T>
) => {
    const currentValue = useWatch({
        control: form.control,
        name: fieldName
    }) as string
    const [correction, setCorrection] = useState<Correction | null>(null)
    const [prevValue, setPrevValue] = useState(currentValue)

    if (currentValue !== prevValue) {
        setPrevValue(currentValue)
        if (correction !== null && currentValue !== correction.to) {
            setCorrection(null)
        }
    }

    const apply = (from: string, to: string) => {
        setCorrection({ from, to })
        form.setValue(fieldName, to as never)
    }

    const revert = () => {
        if (!correction) return
        form.setValue(fieldName, correction.from as never)
        setCorrection(null)
    }

    return {
        correctedFrom: correction?.from ?? null,
        apply,
        revert
    }
}
