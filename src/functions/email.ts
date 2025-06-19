"use server"

import React from 'react'

import { render } from '@react-email/render'

import { getPayload } from "./connector"

export async function sendEmail(to: string, subject: string, email: () => React.JSX.Element): Promise<boolean> {
    const payload = await getPayload()
    try {
        await payload.sendEmail({
            to, subject,
            html: await render(email())
        })
        return true
    } catch (error) {
        console.error(`Error sending email to ${to},`, error)
        return false
    }
}
