const SKELETON_COUNT = 6

export const PantryGridSkeletons = () => (
    <div className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <div
                key={index}
                className={'h-28 animate-pulse rounded-2xl border border-border bg-surface'}
            />
        ))}
    </div>
)
