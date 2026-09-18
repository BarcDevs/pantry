import { GRID_SKELETON_COUNT } from '@/constants/skeleton'

export const RecipeGridSkeletons = () => (
    <div className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {Array.from({ length: GRID_SKELETON_COUNT }).map((_, index) => (
            <div
                key={index}
                className={'h-45 animate-pulse rounded-lg border border-border bg-surface'}
            />
        ))}
    </div>
)
