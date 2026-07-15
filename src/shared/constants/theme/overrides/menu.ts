import { Combobox, Menu } from '@mantine/core'

export default {
    Menu: Menu.extend({
        defaultProps: {
            shadow: 'lg',
            withArrow: false,
            radius: 'md',
            transitionProps: {
                transition: 'fade',
                duration: 180,
                timingFunction: 'ease-out'
            },
            styles: {
                dropdown: {
                    backgroundColor: 'var(--compono-surface)',
                    border: '2px solid var(--compono-border)',
                    boxShadow: '4px 4px 0 rgba(26, 26, 26, 0.9)'
                },
                divider: {
                    borderColor: 'var(--compono-border)',
                    margin: '4px 0'
                }
            }
        }
    }),
    Combobox: Combobox.extend({
        defaultProps: {
            transitionProps: { transition: 'fade', duration: 200 }
        }
    })
}
