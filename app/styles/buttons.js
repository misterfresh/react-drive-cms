import { StyleSheet } from '../../deps/aphrodite.js'

let buttons = StyleSheet.create({
    base: {
        display: 'inline-block',
        fontWeight: '400',
        lineHeight: '1.25rem',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        userSelect: 'none',
        border: '0.1rem solid transparent',
        padding: '1rem 1rem',
        fontSize: '1.6rem',
        borderRadius: '.5rem',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        textDecoration: 'none',
        color: '#fff',
        backgroundColor: '#0275d8',
        borderColor: '#0275d8',
        ':hover': {
            textDecoration: 'none',
            backgroundColor: '#025aa5',
            borderColor: '#01549b',
            color: '#fff',
        },
    },
    large: {
        padding: '1.5rem',
        fontSize: '2rem',
        borderRadius: '.5rem',
    },
    block: {
        display: 'block',
        width: '100%',
    },
    disabled: {
        pointerEvents: 'none',
        backgroundColor: '#85c6f2',
        borderColor: '#85c6f2',
        ':hover': {
            backgroundColor: '#85c6f2',
            borderColor: '#85c6f2',
            cursor: 'not-allowed',
        },
    },
})

export default buttons
