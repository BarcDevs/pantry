import type { ReactNode } from 'react'

type RecipeBodyGridProps = {
    children: ReactNode
}

export const RecipeBodyGrid = ({ children }: RecipeBodyGridProps) => (
    <div className={'grid grid-cols-1 gap-5.5 md:grid-cols-2'}>
        {children}
    </div>
)
