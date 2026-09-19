import { startOfToday } from 'date-fns'
import { he } from 'react-day-picker/locale'

import { buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

import { cn } from '@/lib/utils'

const yearsAhead = 20

type ExpiryCalendarProps = {
    selected?: Date
    onSelect: (date: Date | undefined) => void
}

export const ExpiryCalendar = ({
    selected,
    onSelect
}: ExpiryCalendarProps) => {
    const today = startOfToday()

    return (
        <Calendar
            mode={'single'}
            selected={selected}
            defaultMonth={selected}
            onSelect={onSelect}
            captionLayout={'dropdown'}
            locale={he}
            dir={'rtl'}
            disabled={{ before: today }}
            startMonth={today}
            endMonth={new Date(today.getFullYear() + yearsAhead, 11)}
            classNames={{
                button_previous: cn(buttonVariants({ variant: 'ghost' }), 'size-8 p-0 select-none aria-disabled:opacity-50 [&_svg]:rotate-180'),
                button_next: cn(buttonVariants({ variant: 'ghost' }), 'size-8 p-0 select-none aria-disabled:opacity-50 [&_svg]:rotate-180'),
                dropdowns: 'flex h-8 w-full items-center justify-center gap-1.5 text-sm font-medium',
                dropdown_root: 'relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50',
                dropdown: 'absolute inset-0 cursor-pointer bg-popover opacity-0',
                caption_label: 'flex h-8 items-center gap-1 rounded-md ps-2 pe-1 text-sm font-medium select-none [&>svg]:size-3.5 [&>svg]:text-muted-foreground'
            }}
        />
    )
}
