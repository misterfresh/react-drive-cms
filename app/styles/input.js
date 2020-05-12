import { StyleSheet } from '../../deps/aphrodite.js'

let input = StyleSheet.create({
    base: {
        display: 'block',
        width: '100%',
        padding: '.5rem .75rem',
        fontSize: '1.6rem',
        lineHeight: '1.25',
        color: '#464a4c',
        backgroundColor: '#fff',
        backgroundImage: 'none',
        backgroundClip: 'padding-box',
        border: '.1rem solid rgba(0,0,0,.15)',
        borderRadius: '.25rem',
        transition:
            'border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s',
        marginBottom: 10,
        '::placeholder': {
            maxWidth: '92%',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
    error: {
        border: '.1rem solid red',
        '::placeholder': {
            maxWidth: '92%',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            color: 'red',
        },
    },
})

export default input
