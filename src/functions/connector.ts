
import config from '@payload-config'
import { BasePayload, getPayload as init } from 'payload'

let payload: BasePayload | null = null

export async function getPayload() {
    if (process.env.DOCKER == 'building') return {} as BasePayload
    return payload ?? (payload = await init({ config }))
}
