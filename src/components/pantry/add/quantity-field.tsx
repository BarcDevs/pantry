import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { Unit } from '@/types/enums'

import { MinusIcon } from '@/components/icons/minus-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { Button } from '@/components/shared/Button'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { pantryTexts } from '@/constants/texts/pantry'

const stepByUnit: Record<Unit, number> = {
    [Unit.Units]: 1,
    [Unit.Kg]: 0.1,
    [Unit.L]: 0.1,
    [Unit.G]: 50,
    [Unit.Ml]: 50
}

type QuantityFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    unit: Unit
}

export const QuantityField = <T extends FieldValues>({
    control,
    name,
    unit
}: QuantityFieldProps<T>) => {
    const step = stepByUnit[unit]

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const value = field.value as number

                return (
                    <FormItem>
                        <FormLabel>
                            {pantryTexts.addForm.quantityLabel}
                        </FormLabel>
                        <div className={'flex items-center gap-1.5'}>
                            <Button
                                type={'button'}
                                variant={'outline'}
                                size={'icon'}
                                disabled={value <= step}
                                onClick={() => field.onChange(
                                    Math.round((value - step) * 100) / 100
                                )}
                            >
                                <MinusIcon/>
                            </Button>
                            <Input
                                {...field}
                                type={'number'}
                                min={step}
                                step={step}
                                className={'text-center'}
                                onChange={(e) => {
                                    const next = Number(e.target.value)
                                    field.onChange(Number.isNaN(next) ? 0 : next)
                                }}
                            />
                            <Button
                                type={'button'}
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => field.onChange(
                                    Math.round((value + step) * 100) / 100
                                )}
                            >
                                <PlusIcon/>
                            </Button>
                        </div>
                    </FormItem>
                )
            }}
        />
    )
}
