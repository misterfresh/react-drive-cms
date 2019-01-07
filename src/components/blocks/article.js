import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { pure } from 'recompose'
import { Link } from 'react-router-dom'

let Article = ({ article, category }) => (
    <article className={css(styles.article)}>
        <h2>
            <Link
                to={article.uri}
                title={article.title}
                className={css(styles.title)}
            >
                {article.title}
            </Link>
        </h2>
        <p className={css(styles.p, styles.description)}>{article.subtitle}</p>
        <p className={css(styles.p, styles.meta)}>
            <span
                title={'Comments for ' + article.title}
                data-disqus-url={
                    window.location.protocol +
                    window.location.hostname +
                    article.uri
                }
                data-disqus-identifier={article.id}
                className={'disqus-comment-count ' + css(styles.comments)}
            />
            &nbsp;-&nbsp; Published in : &nbsp;
            <Link
                title={category.title}
                to={category.uri}
                className={css(styles.category)}
            >
                {category.title}
            </Link>
        </p>
    </article>
)

export default pure(Article)

let styles = StyleSheet.create({
    article: {
        padding: '30px 0',
        display: 'block',
        borderBottom: 'solid 1px #f5f5f5'
    },
    title: {
        textDecoration: 'none',
        color: '#333337',
        fontSize: '2.4rem',
        marginTop: 0,
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        fontWeight: 700,
        marginBottom: '10px',
        lineHeight: '1.1',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        '@media (min-width: 992px)': { fontSize: '3.2rem' },
        ':hover': { color: '#b6b6b6' }
    },
    p: {
        margin: '0 0 10px',
        fontFamily: '"Droid Serif",serif',
        fontSize: '1.6rem',
        '@media (min-width: 992px)': {
            fontSize: '1.8rem'
        }
    },
    description: {
        marginBottom: '30px'
    },
    meta: {
        color: '#b6b6b6'
    },
    comments: {},
    category: {
        textDecoration: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        outline: 0,
        transition: 'all .4s',
        color: '#b6b6b6',
        borderBottom: '1px solid #b6b6b6',
        ':hover': {
            textDecoration: 'none',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            color: '#333337',
            outline: 0,
            transition: 'all .4s',
            borderBottom: '1px solid #b6b6b6'
        }
    }
})
