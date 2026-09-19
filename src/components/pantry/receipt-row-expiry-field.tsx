import { useState } from 'react'

import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { ExpiryCalendar } from '@/components/pantry/expiry-calendar'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptRowExpiryFieldProps = {
    value: string
    onChange: (value: string) => void
}

export const ReceiptRowExpiryField = ({
    value,
    onChange
}: ReceiptRowExpiryFieldProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectedDate = value ? parseISO(value) : undefined

    return (
        <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <PopoverTrigger asChild>
                <SecondaryButton
                    className={cn(
                        'w-full justify-start font-normal',
                        !selectedDate && 'text-ink-4'
                    )}
                >
                    <CalendarIcon className={'size-4'}/>
                    {selectedDate
                        ? format(selectedDate, 'dd/MM/yyyy')
                        : pantryTexts.addForm.expiryPlaceholder}
                </SecondaryButton>
            </PopoverTrigger>
            <PopoverContent
                align={'start'}
                dir={'rtl'}
                className={'w-auto p-0'}
            >
                <ExpiryCalendar
                    selected={selectedDate}
                    onSelect={(date) => {
                        onChange(date ? format(date, 'yyyy-MM-dd') : '')
                        setIsOpen(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
