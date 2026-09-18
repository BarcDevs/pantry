import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

type DestructiveButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const DestructiveButton = (props: DestructiveButtonProps) => (
    <Button
        variant={'destructive'}
        {...props}
    />
)
