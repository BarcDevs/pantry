import { useState } from 'react'

import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/shared/buttons/Button'
import { Calendar } from '@/components/ui/calendar'
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
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start font-normal',
                        !selectedDate && 'text-ink-4'
                    )}
                >
                    <CalendarIcon className={'size-4'}/>
                    {selectedDate
                        ? format(selectedDate, 'dd/MM/yyyy')
                        : pantryTexts.addForm.expiryPlaceholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align={'start'}
                className={'w-auto p-0'}
            >
                <Calendar
                    mode={'single'}
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
