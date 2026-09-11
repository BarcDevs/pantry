'use client'

import Link from 'next/link'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

export const AddMethodLinks = () => (
    <div className={'mb-6 flex flex-wrap gap-3'}>
        <Link
            href={routes.addReceipt}
            className={'flex min-w-37.5 flex-1 items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground'}
        >
            <span className={'text-2xl'}>
                {'📷'}
            </span>
            <span>
                <span className={'block text-label font-bold'}>
                    {pantryTexts.addForm.scanTileTitle}
                </span>
                <span className={'block text-caption opacity-85'}>
                    {pantryTexts.addForm.scanTileSubtitle}
                </span>
            </span>
        </Link>
        <Link
            href={routes.addPaste}
            className={'flex min-w-37.5 flex-1 items-center gap-3 rounded-2xl border border-border-2 bg-surface p-4'}
        >
            <span className={'text-2xl'}>
                {'🔗'}
            </span>
            <span>
                <span className={'block text-label font-bold text-ink'}>
                    {pantryTexts.addForm.pasteLinkTileTitle}
                </span>
                <span className={'block text-caption text-ink-3'}>
                    {pantryTexts.addForm.pasteLinkTileSubtitle}
                </span>
            </span>
        </Link>
        <Link
            href={`${routes.addPaste}?tab=text`}
            className={'flex min-w-37.5 flex-1 items-center gap-3 rounded-2xl border border-border-2 bg-surface p-4'}
        >
            <span className={'text-2xl'}>
                {'📋'}
            </span>
            <span>
                <span className={'block text-label font-bold text-ink'}>
                    {pantryTexts.addForm.pasteTextTileTitle}
                </span>
                <span className={'block text-caption text-ink-3'}>
                    {pantryTexts.addForm.pasteTextTileSubtitle}
                </span>
            </span>
        </Link>
    </div>
)
