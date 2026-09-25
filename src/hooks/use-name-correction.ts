import {
    useEffect,
    useRef,
    useState
} from 'react'

import type {
    FieldValues,
    Path,
    UseFormReturn
} from 'react-hook-form'

export const useNameCorrection = <T extends FieldValues>(
    form: UseFormReturn<T>,
    currentName: string,
    fieldName: Path<T>
) => {
    const [correctedFrom, setCorrectedFrom] = useState<string | null>(null)
    const correctedToRef = useRef<string | null>(null)

    useEffect(() => {
        if (
            correctedToRef.current !== null
            && currentName.trim() !== correctedToRef.current
        ) {
            correctedToRef.current = null
            setCorrectedFrom(null)
        }
    }, [currentName])

    const apply = (from: string, to: string) => {
        correctedToRef.current = to
        setCorrectedFrom(from)
        form.setValue(fieldName, to as never)
    }

    const revert = () => {
        if (correctedFrom === null) return
        correctedToRef.current = null
        form.setValue(fieldName, correctedFrom as never)
        setCorrectedFrom(null)
    }

    return {
        correctedFrom,
        apply,
        revert
    }
}
