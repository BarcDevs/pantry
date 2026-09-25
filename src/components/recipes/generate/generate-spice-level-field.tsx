import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import type { SpiceLevel } from '@/types/recipe'

import { SelectableOption } from '@/components/shared/SelectableOption'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'

import { recipesTexts } from '@/constants/texts/recipes'

const spiceLevels: SpiceLevel[] = [0, 1, 2, 3]

type GenerateSpiceLevelFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
}

export const GenerateSpiceLevelField = <T extends FieldValues>({
    control,
    name
}: GenerateSpiceLevelFieldProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>
                    {recipesTexts.generate.maxSpiceLevelLabel}
                </FormLabel>
                <div className={'flex flex-wrap gap-2'}>
                    {spiceLevels.map((level) => (
                        <SelectableOption
                            key={level}
                            variant={'chip'}
                            emoji={''}
                            label={recipesTexts.generate.spiceLevelOptions[level]}
                            isSelected={field.value === level}
                            onSelect={() => field.onChange(level)}
                        />
                    ))}
                </div>
            </FormItem>
        )}
    />
)
