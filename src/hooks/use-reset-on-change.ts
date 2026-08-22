import { useState } from 'react'

export const useResetOnChange = <T,>(
    value: T,
    onChange: () => void
) => {
    const [prev, setPrev] = useState(value)
    if (value !== prev) {
        setPrev(value)
        onChange()
    }
}
