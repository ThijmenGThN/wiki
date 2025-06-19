"use server"

import { Setting } from '@/types/payload-types'
import { getPayload } from './connector'

export async function getSettings(): Promise<Setting> {
    const payload = await getPayload()

    const settings = await payload.findGlobal({ slug: 'settings' })

    return settings as Setting
}

export async function getSiteName(): Promise<string> {
    const settings = await getSettings()
    return settings.sitename || 'Wiki'
}

export async function getSiteSubtitle(): Promise<string> {
    const settings = await getSettings()
    return settings.subtitle || 'A customizable knowledge base.'
}

export async function getDisclaimer(): Promise<string> {
    const settings = await getSettings()
    return settings.disclaimer || 'This platform provides general information for reference purposes.'
}
