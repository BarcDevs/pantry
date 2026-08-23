import { useState } from 'react'

import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { Button } from '@/components/shared/Button'
import { Calendar } from '@/components/ui/calendar'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

type ExpiryDateFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    label: string
}

export const ExpiryDateField = <T extends FieldValues>({
    control,
    name,
    label
}: ExpiryDateFieldProps<T>) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const value = field.value as string
                const selectedDate = value ? parseISO(value) : undefined

                return (
                    <FormItem>
                        <FormLabel>
                            {label}
                        </FormLabel>
                        <Popover
                            open={isOpen}
                            onOpenChange={setIsOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    type={'button'}
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
                                        field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                                        setIsOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )
            }}
        />
    )
}
