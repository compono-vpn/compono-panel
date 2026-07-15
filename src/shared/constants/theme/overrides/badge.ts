import { Badge } from '@mantine/core'

export default {
    Badge: Badge.extend({
        defaultProps: {
            color: 'var(--compono-ink)',
            radius: 'md',
            variant: 'outline'
        }
    })
}
