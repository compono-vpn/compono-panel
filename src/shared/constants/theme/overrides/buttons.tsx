import { ActionIcon, Anchor, Button, CloseButton, Switch } from '@mantine/core'

export default {
    ActionIcon: ActionIcon.extend({
        defaultProps: {
            color: 'var(--compono-ink)',
            radius: 'sm',
            variant: 'outline'
        },
        styles: {
            root: {
                borderWidth: 2
            }
        }
    }),
    Anchor: Anchor.extend({
        defaultProps: {
            c: 'var(--compono-ink)',
            underline: 'hover'
        },
        styles: {
            root: {
                textDecorationColor: 'var(--compono-accent)',
                textDecorationThickness: 2,
                textUnderlineOffset: 3
            }
        }
    }),
    Button: Button.extend({
        defaultProps: {
            radius: 'sm',
            variant: 'filled'
        },
        styles: {
            root: {
                border: '2px solid var(--compono-border)',
                fontWeight: 700,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }
        }
    }),
    CloseButton: CloseButton.extend({
        defaultProps: {
            size: 'lg'
        }
    }),
    Switch: Switch.extend({
        defaultProps: {
            radius: 'sm'
        }
    })
}
