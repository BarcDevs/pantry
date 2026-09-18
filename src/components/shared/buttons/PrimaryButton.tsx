import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

type PrimaryButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const PrimaryButton = (props: PrimaryButtonProps) => (
    <Button
        variant={'default'}
        {...props}
    />
)
