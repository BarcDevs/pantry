import type { ClassName } from '@/types/react'
import type { SpiceLevel } from '@/types/recipe'

import { cn } from '@/lib/utils'

type SpiceLevelIndicatorProps = {
    spiceLevel: SpiceLevel
    className?: ClassName
}

export const SpiceLevelIndicator = ({
    spiceLevel,
    className
}: SpiceLevelIndicatorProps) => (
    spiceLevel > 0 ? (
        <span className={cn('text-caption', className)}>
            {'🌶️'.repeat(spiceLevel)}
        </span>
    ) : null
)
