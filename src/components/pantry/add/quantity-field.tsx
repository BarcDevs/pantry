import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { PantryUnit } from '@/types/enums'

import { MinusIcon } from '@/components/icons/minus-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { Button } from '@/components/shared/Button'
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { pantryTexts } from '@/constants/texts/pantry'

const stepByUnit: Record<PantryUnit, number> = {
    [PantryUnit.Units]: 1,
    [PantryUnit.Kg]: 0.1,
    [PantryUnit.L]: 0.1,
    [PantryUnit.G]: 50,
    [PantryUnit.Ml]: 50
}

type QuantityFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    unit: PantryUnit
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
                                className={'text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'}
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
                        <FormMessage/>
                    </FormItem>
                )
            }}
        />
    )
}
