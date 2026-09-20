import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export const calendarNavButtonClasses = cn(
    buttonVariants({ variant: 'ghost' }),
    'size-8 p-0 select-none aria-disabled:opacity-50 [&_svg]:rotate-180'
)
