import { ActionIcon, Button, CloseButton, Switch } from '@mantine/core'

export default {
    ActionIcon: ActionIcon.extend({
        defaultProps: {
            radius: 'sm',
            variant: 'outline'
        },
        styles: {
            root: {
                borderWidth: 2
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
