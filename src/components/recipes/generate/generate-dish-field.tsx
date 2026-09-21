import type { Control } from 'react-hook-form'

import { Input } from '@/components/shared/Input'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { recipesTexts } from '@/constants/texts/recipes'

import type { GenerateRecipeFormValues } from '@/schemas/generate-recipe-form'

type GenerateDishFieldProps = {
    control: Control<GenerateRecipeFormValues>
}

const texts = recipesTexts.generate

export const GenerateDishField = ({
    control
}: GenerateDishFieldProps) => (
    <div className={'rounded-lg border border-border-2 bg-surface p-5'}>
        <FormField
            control={control}
            name={'customInstructions'}
            render={({ field }) => (
                <FormItem className={'gap-0'}>
                    <div className={'mb-1 flex items-center gap-2'}>
                        <FormLabel className={'text-[14px] font-bold leading-normal text-ink-2'}>
                            {texts.dishLabel}
                        </FormLabel>
                        <span className={'text-caption font-semibold text-ink-4'}>
                            {texts.dishOptionalMarker}
                        </span>
                    </div>
                    <p className={'mb-[13px] text-caption leading-normal text-ink-4'}>
                        {texts.dishHint}
                    </p>
                    <FormControl>
                        <Input
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={texts.dishPlaceholder}
                            className={'h-auto rounded-[12px] border-border bg-[#faf8f2] px-[14px] py-[13px] text-body text-ink shadow-none md:text-body'}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    </div>
)
