import { createTheme } from '@mantine/core'

import { variantColorResolver } from './colors-resolver'
import components from './overrides'

export const theme = createTheme({
    variantColorResolver,
    components,
    cursorType: 'pointer',
    fontFamily:
        'Inter, Vazirmatn, Apple Color Emoji, Noto Sans SC, Twemoji Country Flags, sans-serif',
    fontFamilyMonospace: 'Fira Mono, monospace',
    breakpoints: {
        xs: '30em',
        sm: '40em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        '3xl': '120em',
        '4xl': '160em'
    },

    scale: 1,
    fontSmoothing: true,
    focusRing: 'auto',
    white: '#fffdf5',
    black: '#1a1a1a',
    colors: {
        dark: [
            '#fffdf5',
            '#f1eee4',
            '#d4d0c6',
            '#aaa69e',
            '#77746e',
            '#4c4a46',
            '#33322f',
            '#242321',
            '#1a1a1a',
            '#111111'
        ],

        blue: [
            '#ddf4ff',
            '#b6e3ff',
            '#80ccff',
            '#54aeff',
            '#218bff',
            '#0969da',
            '#0550ae',
            '#033d8b',
            '#0a3069',
            '#002155'
        ],
        green: [
            '#dafbe1',
            '#aceebb',
            '#6fdd8b',
            '#4ac26b',
            '#2da44e',
            '#1a7f37',
            '#116329',
            '#044f1e',
            '#003d16',
            '#002d11'
        ],
        yellow: [
            '#fffbe6',
            '#fff5b8',
            '#ffec80',
            '#ffe347',
            '#ffdc1f',
            '#ffd600',
            '#e6c100',
            '#b39400',
            '#806a00',
            '#4d4000'
        ],
        orange: [
            '#fff1e5',
            '#ffd8b5',
            '#ffb77c',
            '#fb8f44',
            '#e16f24',
            '#bc4c00',
            '#953800',
            '#762c00',
            '#5c2200',
            '#471700'
        ]
    },
    primaryShade: 5,
    primaryColor: 'yellow',
    autoContrast: true,
    luminanceThreshold: 0.3,
    headings: {
        fontWeight: '700',
        fontFamily: 'Inter, Vazirmatn, sans-serif'
    },
    defaultRadius: 'sm'
})
