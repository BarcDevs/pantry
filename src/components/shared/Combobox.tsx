import { useState } from 'react'

import type { ComponentProps } from 'react'

import { Input } from '@/components/shared/Input'
import {
    Popover,
    PopoverAnchor,
    PopoverContent
} from '@/components/ui/popover'

const maxSuggestions = 8

type ComboboxProps = ComponentProps<typeof Input> & {
    suggestions: readonly string[]
    onSelect: (value: string) => void
}

export const Combobox = ({
    suggestions,
    onSelect,
    value,
    onFocus,
    onBlur,
    ...props
}: ComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const query = typeof value === 'string' ? value.trim() : ''
    const matches = query.length > 0
        ? suggestions
            .filter((item) => item.includes(query))
            .slice(0, maxSuggestions)
        : []

    return (
        <Popover open={isOpen && matches.length > 0}>
            <PopoverAnchor asChild>
                <Input
                    value={value}
                    onFocus={(event) => {
                        onFocus?.(event)
                        setIsOpen(true)
                    }}
                    onBlur={(event) => {
                        onBlur?.(event)
                        setIsOpen(false)
                    }}
                    {...props}
                />
            </PopoverAnchor>
            <PopoverContent
                align={'start'}
                className={'w-(--radix-popover-trigger-width) p-1'}
                onOpenAutoFocus={(event) => event.preventDefault()}
            >
                <div className={'flex flex-col'}>
                    {matches.map((item) => (
                        <button
                            key={item}
                            type={'button'}
                            className={'rounded-sm px-2 py-1.5 text-start text-sm hover:bg-accent'}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                                onSelect(item)
                                setIsOpen(false)
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
