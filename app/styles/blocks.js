import { StyleSheet } from '../../deps/aphrodite.js'

const opacityKeyframes = {
    from: {
        opacity: 0,
    },

    to: {
        opacity: 1,
    },
}
let blocks = StyleSheet.create({
    outline: {
        border: '0.1rem solid transparent',
    },
    image: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
    },
    center: {
        width: '30%',
        margin: 'auto',
    },
    container: {
        padding: '0.5rem',
    },
    col: {
        flexGrow: 1,
    },
    row: {
        display: 'flex',
    },
    wrapper: {
        position: 'relative',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        maxWidth: '100%',
    },
    block: {
        background: '#fff',
        padding: 10,
        borderRadius: 4,
        position: 'relative',
        cursor: 'default',
    },
    fadein: {
        animationName: [opacityKeyframes],
        animationDuration: '1s, 1s',
        animationIterationCount: 1,
    },
})

export default blocks
