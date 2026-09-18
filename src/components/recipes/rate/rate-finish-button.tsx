import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'

import { recipesTexts } from '@/constants/texts/recipes'

type RateFinishButtonProps = {
    rating: number
    isSubmitting: boolean
    onClick: () => void
}

export const RateFinishButton = ({
    rating,
    isSubmitting,
    onClick
}: RateFinishButtonProps) => (
    <PrimaryButton
        onClick={onClick}
        disabled={isSubmitting}
        className={'w-full cursor-pointer bg-green text-body font-bold text-surface hover:bg-green/90'}
    >
        {rating > 0 ? recipesTexts.rate.finishWithRating : recipesTexts.rate.finishWithoutRating}
    </PrimaryButton>
)
