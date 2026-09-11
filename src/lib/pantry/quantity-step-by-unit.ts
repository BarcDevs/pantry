import { PantryUnit } from '@/types/enums'

export const quantityStepByUnit: Record<PantryUnit, number> = {
    [PantryUnit.Units]: 1,
    [PantryUnit.Kg]: 0.1,
    [PantryUnit.L]: 0.1,
    [PantryUnit.G]: 50,
    [PantryUnit.Ml]: 50
}
