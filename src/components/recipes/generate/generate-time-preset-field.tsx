import { useState } from 'react'

import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { SelectableOption } from '@/components/shared/SelectableOption'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const TIME_PRESETS = [
    15,
    30,
    60
] as const

type GenerateTimePresetFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    label: string
    presetSuffix: string
    customLabel: string
}

export const GenerateTimePresetField = <T extends FieldValues>({
    control,
    name,
    label,
    presetSuffix,
    customLabel
}: GenerateTimePresetFieldProps<T>) => {
    const [isCustom, setIsCustom] = useState(false)

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <div className={'grid grid-cols-4 gap-2'}>
                        {TIME_PRESETS.map((preset) => (
                            <SelectableOption
                                key={preset}
                                variant={'chip'}
                                emoji={''}
                                label={`${preset} ${presetSuffix}`}
                                isSelected={!isCustom && field.value === preset}
                                onSelect={() => {
                                    setIsCustom(false)
                                    field.onChange(preset)
                                }}
                            />
                        ))}
                        {isCustom
                            ? (
                                <Input
                                    type={'number'}
                                    min={1}
                                    autoFocus
                                    value={field.value as number}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    placeholder={customLabel}
                                />
                            )
                            : (
                                <SelectableOption
                                    variant={'chip'}
                                    emoji={''}
                                    label={customLabel}
                                    isSelected={false}
                                    onSelect={() => setIsCustom(true)}
                                />
                            )}
                    </div>
                </FormItem>
            )}
        />
    )
}
