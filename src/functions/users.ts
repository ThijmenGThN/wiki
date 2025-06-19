"use server"

import { headers as nextHeaders } from 'next/headers'

import { User } from '@/types/payload-types'

import { getPayload } from './connector'

export async function getUser(): Promise<Partial<User> | null> {
    const payload = await getPayload()
    const headers = await nextHeaders()
    const { user } = await payload.auth({ headers })
    return user
}

export async function isLoggedIn(): Promise<boolean> {
    const user = await getUser()
    return !!user
}

export async function forgotPassword(email: string) {
    const payload = await getPayload()
    try {
        const res = await payload.forgotPassword({
            collection: 'users',
            data: { email }
        })
        console.log(res)
    } catch (error) {
        console.error('Error during forgot password:', error)
        return null
    }
}

export async function resetPassword(data: {
    token: string,
    password: string
}): Promise<boolean> {
    const payload = await getPayload()
    console.log(data)
    try {
        const result = await payload.resetPassword({
            collection: 'users',
            data,
            overrideAccess: false
        })
        console.log(result)
        return Boolean(result)
    } catch {
        return false
    }
}

export async function createUser(data: Omit<User, "id" | "role" | "updatedAt" | "createdAt">): Promise<User | null> {
    const payload = await getPayload()
    try {
        return await payload.create({
            collection: 'users',
            data: {
                ...data,
                role: "user"
            },
        })
    } catch (error) {
        console.error('Error creating user:', error)
        return null
    }
}

export async function updateUser(data: { firstname: string; lastname: string }): Promise<boolean> {
    const payload = await getPayload()
    try {
        const user = await getUser()
        if (!user || user.id === undefined) return false

        await payload.update({
            collection: 'users',
            id: user.id,
            data: {
                firstname: data.firstname,
                lastname: data.lastname
            },
            overrideAccess: false
        })

        return true
    } catch (error) {
        console.error('Error updating user:', error)
        return false
    }
}