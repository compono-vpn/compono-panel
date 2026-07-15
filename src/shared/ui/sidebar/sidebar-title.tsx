import { Text } from '@mantine/core'
import { useMemo } from 'react'

import { useGetAuthStatus } from '@shared/api/hooks/auth/auth.query.hooks'
import { parseColoredTextUtil } from '@shared/utils/misc'

import classes from './sidebar.module.css'

export const SidebarTitleShared = () => {
    const { data: authStatus } = useGetAuthStatus()

    const titleParts = useMemo(() => {
        if (authStatus?.branding.title) {
            return parseColoredTextUtil(authStatus.branding.title)
        }

        return [{ text: 'COMPONO VPN', color: 'var(--compono-ink)' }]
    }, [authStatus?.branding.title])

    return (
        <Text className={classes.logoTitle}>
            {titleParts.map((part, index) => (
                <Text c={part.color || 'var(--compono-ink)'} component="span" inherit key={index}>
                    {part.text}
                </Text>
            ))}
        </Text>
    )
}
