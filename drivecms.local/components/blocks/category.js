import {html} from '/react.js'
import { StyleSheet, css } from '/aphrodite.js'
import { Link } from '/react-router-dom.js'

let Category = ({ category }) => html`
    <div
        className=${css(styles.category)}
        style=${{
            backgroundImage: `url(${category.image})`
        }}
    >
        <h2 className=${css(styles.title)}>
            <${Link}
                to=${category.uri}
                title=${category.title}
                className=${css(styles.link)}
            >
                ${category.title}
            <//>
        </h2>
    </div>
`

export default Category

let styles = StyleSheet.create({
    category: {
        height: '30rem',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        width: '100%',
        '@media (min-width: 768px)': {
            width: '100%'
        },
        '@media (min-width: 992px)': {
            width: '48%'
        },
        position: 'relative',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'flex-end'
    },
    link: {
        color: '#fff',
        cursor: 'pointer',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        fontSize: '2rem',
        borderBottom: 'solid 1px #fAfafa',
        ':hover': {
            cursor: 'pointer',
            textDecoration: 'none',
            backgroundColor: 'transparent',
            outline: 0,
            color: '#999',
            borderBottom: 'solid 1px #999',
            transition: 'all .4s'
        }
    },
    title: {
        background: 'rgba(50,50,50,.5)',
        width: '100%',
        fontSize: '2rem',
        color: '#fff',
        padding: '10px',
        fontWeight: 700,
        lineHeight: '1.1',
        bottom: 0,
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        marginBottom: 0
    }
})
