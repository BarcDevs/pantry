import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            shadow: [
                {
                    shadow: [
                        'card',
                        'button',
                        'button-ember',
                        'sheet',
                        'chip'
                    ]
                }
            ]
        }
    }
})

export const cn = (...inputs: ClassValue[]) =>
    customTwMerge(clsx(inputs))
