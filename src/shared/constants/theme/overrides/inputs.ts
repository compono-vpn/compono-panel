import { InputBase, PasswordInput, Select, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'

export default {
    InputBase: InputBase.extend({
        defaultProps: {
            radius: 'sm'
        },
        styles: {
            input: { borderWidth: 2 }
        }
    }),
    PasswordInput: PasswordInput.extend({
        defaultProps: {
            radius: 'sm'
        },
        styles: {
            input: { borderWidth: 2 }
        }
    }),
    TextInput: TextInput.extend({
        defaultProps: {
            radius: 'sm'
        },
        styles: {
            input: { borderWidth: 2 }
        }
    }),
    Select: Select.extend({
        defaultProps: {
            radius: 'sm'
        },
        styles: {
            input: { borderWidth: 2 }
        }
    }),
    DateTimePicker: DateTimePicker.extend({
        defaultProps: {
            radius: 'sm'
        },
        styles: {
            input: { borderWidth: 2 }
        }
    })
}
