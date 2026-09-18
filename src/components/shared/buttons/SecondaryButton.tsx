import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

type SecondaryButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const SecondaryButton = (props: SecondaryButtonProps) => (
    <Button
        variant={'outline'}
        {...props}
    />
)
