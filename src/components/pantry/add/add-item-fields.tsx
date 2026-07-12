import type {
    FoodType,
    StorageLocation,
    Unit
} from '@/types/enums'
import {
    FOOD_TYPES,
    STORAGE_LOCATIONS,
    UNITS
} from '@/types/enums'

import { FormInputField } from '@/components/shared/FormInputField'
import { FormSelectField } from '@/components/shared/FormSelectField'

import { pantryTexts } from '@/constants/texts/pantry'

type AddItemFieldsProps = {
    values: {
        name: string
        storage: StorageLocation
        type: FoodType
        quantity: number
        unit: Unit
        expiryDate: string
        notes: string
    }
    handlers: {
        setName: (value: string) => void
        setStorage: (value: StorageLocation) => void
        setType: (value: FoodType) => void
        setQuantity: (value: number) => void
        setUnit: (value: Unit) => void
        setExpiryDate: (value: string) => void
        setNotes: (value: string) => void
    }
}

const storageOptions = STORAGE_LOCATIONS.map((location) => ({
    value: location,
    label: pantryTexts.storageLabels[location]
}))

const typeOptions = FOOD_TYPES.map((foodType) => ({
    value: foodType,
    label: pantryTexts.foodTypeLabels[foodType]
}))

const unitOptions = UNITS.map((unit) => ({
    value: unit,
    label: pantryTexts.unitLabels[unit]
}))

export const AddItemFields = ({
    values,
    handlers
}: AddItemFieldsProps) => (
    <div className={'flex flex-col gap-4'}>
        <FormInputField
            id={'item-name'}
            label={pantryTexts.addForm.nameLabel}
            value={values.name}
            onChange={(e) => handlers.setName(e.target.value)}
            placeholder={pantryTexts.addForm.namePlaceholder}
            required
        />
        <div className={'grid grid-cols-2 gap-3'}>
            <FormSelectField
                id={'item-storage'}
                label={pantryTexts.addForm.storageLabel}
                value={values.storage}
                options={storageOptions}
                onChange={handlers.setStorage}
            />
            <FormSelectField
                id={'item-type'}
                label={pantryTexts.addForm.typeLabel}
                value={values.type}
                options={typeOptions}
                onChange={handlers.setType}
            />
        </div>
        <div className={'grid grid-cols-2 gap-3'}>
            <FormInputField
                id={'item-quantity'}
                label={pantryTexts.addForm.quantityLabel}
                type={'number'}
                min={0}
                step={0.1}
                value={values.quantity}
                onChange={(e) => handlers.setQuantity(Number(e.target.value))}
                required
            />
            <FormSelectField
                id={'item-unit'}
                label={pantryTexts.addForm.unitLabel}
                value={values.unit}
                options={unitOptions}
                onChange={handlers.setUnit}
            />
        </div>
        <FormInputField
            id={'item-expiry'}
            label={pantryTexts.addForm.expiryLabel}
            type={'date'}
            value={values.expiryDate}
            onChange={(e) => handlers.setExpiryDate(e.target.value)}
        />
        <FormInputField
            id={'item-notes'}
            label={pantryTexts.addForm.notesLabel}
            value={values.notes}
            onChange={(e) => handlers.setNotes(e.target.value)}
        />
    </div>
)
