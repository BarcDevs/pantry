import type { Control } from 'react-hook-form'

import {
    STORAGE_LOCATIONS,
    UNITS
} from '@/types/enums'

import { EmojiPickerField } from '@/components/pantry/add/emoji-picker-field'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { FormSelectField } from '@/components/shared/form/FormSelectField'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { toSelectOptions } from '@/lib/select-options'

import { pantryTexts } from '@/constants/texts/pantry'

import type { AddItemFormValues } from '@/schemas/add-item-form'

type AddItemFieldsProps = {
    control: Control<AddItemFormValues>
}

const storageOptions = toSelectOptions(STORAGE_LOCATIONS, pantryTexts.storageLabels)
const unitOptions = toSelectOptions(UNITS, pantryTexts.unitLabels)

export const AddItemFields = ({ control }: AddItemFieldsProps) => (
    <div className={'flex flex-col gap-4'}>
        <FormInputField
            control={control}
            name={'name'}
            label={pantryTexts.addForm.nameLabel}
            render={(field) => (
                <Input
                    {...field}
                    dir={'rtl'}
                    placeholder={pantryTexts.addForm.namePlaceholder}
                />
            )}
        />
        <EmojiPickerField
            control={control}
            name={'emoji'}
        />
        <div className={'grid grid-cols-2 gap-3'}>
            <FormInputField
                control={control}
                name={'quantity'}
                label={pantryTexts.addForm.quantityLabel}
                render={(field) => (
                    <Input
                        {...field}
                        type={'number'}
                        min={0}
                        step={0.1}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                )}
            />
            <FormSelectField
                control={control}
                name={'unit'}
                label={pantryTexts.addForm.unitLabel}
                options={unitOptions}
            />
        </div>
        <div className={'grid grid-cols-2 gap-3'}>
            <FormSelectField
                control={control}
                name={'storage'}
                label={pantryTexts.addForm.storageLabel}
                options={storageOptions}
            />
            <FormInputField
                control={control}
                name={'expiryDate'}
                label={pantryTexts.addForm.expiryLabel}
                render={(field) => (
                    <Input
                        {...field}
                        type={'date'}
                    />
                )}
            />
        </div>
        <FormInputField
            control={control}
            name={'notes'}
            label={pantryTexts.addForm.notesLabel}
            render={(field) => (
                <Textarea
                    {...field}
                    dir={'rtl'}
                    rows={3}
                />
            )}
        />
    </div>
)
