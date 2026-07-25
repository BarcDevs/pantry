const SKELETON_COUNT = 6

export const RecipeGridSkeletons = () => (
    <div className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div
                key={index}
                className={'h-45 animate-pulse rounded-lg border border-border bg-surface'}
            />
        ))}
    </div>
)
