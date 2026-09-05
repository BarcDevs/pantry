import type { Control } from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import {
    PANTRY_UNITS,
    STORAGE_LOCATIONS } from '@/types/enums'

import { ExpiryDateField } from '@/components/pantry/add/expiry-date-field'
import { QuantityField } from '@/components/pantry/add/quantity-field'
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
const unitOptions = toSelectOptions(PANTRY_UNITS, pantryTexts.unitLabels)

export const AddItemFields = ({ control }: AddItemFieldsProps) => {
    const unit = useWatch({ control, name: 'unit' })

    return (
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
            <div className={'grid grid-cols-2 gap-3'}>
                <QuantityField
                    control={control}
                    name={'quantity'}
                    unit={unit}
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
                <ExpiryDateField
                    control={control}
                    name={'expiryDate'}
                    label={pantryTexts.addForm.expiryLabel}
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
}
