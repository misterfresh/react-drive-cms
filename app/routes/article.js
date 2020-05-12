import { html, Component } from '../../deps/react.js'
import { StyleSheet, css } from '../../deps/aphrodite.js'
import { Helmet } from '../../deps/react-helmet.js'

import { bindActionCreators } from '../../deps/redux.js'
import { connect } from '../../deps/react-redux.js'

import { getLocation } from '../modules/route/selectors.js'
import * as categoryActions from '../modules/category/actionCreators.js'
import * as articleActions from '../modules/article/actionCreators.js'

import Menu from '../components/layout/menu.js'
import blocks from '../styles/blocks.js'
import Footer from '../components/layout/footer.js'
import DisqusThread from '../components/disqus/disqusThread.js'

class Article extends Component {
    static readyOnActions(dispatch, activeArticleId) {
        return Promise.all([
            dispatch(categoryActions.fetchCategoriesIfNeeded()),
            dispatch(articleActions.fetchArticleIfNeeded(activeArticleId)),
        ])
    }

    constructor() {
        super()
        this.toggleMenu = this.toggleMenu.bind(this)
        this.state = {
            menuVisible: !(
                typeof window !== 'undefined' && window.innerWidth < 769
            ),
        }
    }

    componentDidMount() {
        let { match } = this.props
        let activeArticleId = match.params.articleId
        Article.readyOnActions(this.props.dispatch, activeArticleId)
    }

    componentWillReceiveProps(nextProps) {
        let { match } = this.props
        let activeArticleId = match.params.articleId
        if (nextProps.match.params.articleId !== activeArticleId) {
            Article.readyOnActions(
                this.props.dispatch,
                nextProps.match.params.articleId
            ).then((loaded) => {
                let element = document.getElementById('article-header')
                element.scrollIntoView()
            })
        }
    }

    toggleMenu() {
        let { menuVisible } = this.state
        this.setState(
            {
                menuVisible: !menuVisible,
            },
            (param) => param
        )
    }

    render() {
        let { texts, articles, categories, match } = this.props
        let activeArticleId = match.params.articleId
        let activeArticle = { title: '', id: activeArticleId },
            activeText,
            category = { title: '', uri: '/' }
        if (
            typeof articles[activeArticleId] !== 'undefined' &&
            typeof texts[activeArticleId] !== 'undefined' &&
            typeof categories[articles[activeArticleId].categoryId] !==
                'undefined'
        ) {
            activeArticle = articles[activeArticleId]
            activeText = texts[activeArticleId]
            category = categories[activeArticle.categoryId]
        }

        let { menuVisible } = this.state

        return html`
            <div className=${css(blocks.wrapper, styles.page)}>
                <${Helmet}
                    title=${activeArticle.title}
                    titleTemplate=${'%s - React Drive CMS'}
                    meta=${[
                        { 'char-set': 'utf-8' },
                        { name: 'description', content: activeArticle.title },
                    ]}
                />
                <button
                    className=${css(styles.menuBurger)}
                    onClick=${this.toggleMenu}
                    id="menu-burger"
                >
                    <div className=${css(styles.bar)} />
                    <div className=${css(styles.bar)} />
                    <div className=${css(styles.bar)} />
                </button>
                <${Menu} menuVisible=${menuVisible} />
                <main
                    className=${css(
                        blocks.wrapper,
                        styles.main,
                        menuVisible && styles.mainNarrow
                    )}
                >
                    <header
                        className=${css(styles.hero)}
                        role="banner"
                        style=${{
                            backgroundImage: `url(${activeArticle.image})`,
                        }}
                        id="article-header"
                    />
                    <section
                        className=${css(
                            styles.content,
                            menuVisible && styles.contentNarrow
                        )}
                    >
                        <h1 id="article-title" className=${css(styles.title)}>
                            ${activeArticle.title}
                        </h1>
                        <p className="{css(styles.p)}">
                            ${activeArticle.subtitle}
                        </p>
                        <div
                            className=${css(styles.text)}
                            dangerouslySetInnerHTML=${{ __html: activeText }}
                        />
                        <${DisqusThread}
                            id=${activeArticle.id}
                            title=${activeArticle.title}
                        />
                    </section>
                    <${Footer}
                        article=${activeArticle}
                        articles=${articles}
                        category=${category}
                        menuVisible=${menuVisible}
                    />
                </main>
            </div>
        `
    }
}

function mapStateToProps(state) {
    return {
        location: getLocation(state),
        articles: state.article.articles,
        categories: state.category.categories,
        texts: state.article.texts,
    }
}

function mapDispatchToProps(dispatch) {
    return Object.assign(
        bindActionCreators(
            {
                ...categoryActions,
            },
            dispatch
        ),
        { dispatch }
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Article)

const opacityKeyframes = {
    from: {
        opacity: 0,
    },

    to: {
        opacity: 1,
    },
}

let styles = StyleSheet.create({
    hero: {
        position: 'relative',
        display: 'block',
        height: '15rem',
        width: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        '@media (min-width: 768px)': {
            height: '30rem',
        },
        overflowX: 'hidden',
        maxWidth: '100%',
    },
    title: {
        paddingTop: '20pt',
        color: '#000000',
        fontSize: '20pt',
        paddingBottom: '6pt',
        fontFamily: '"Arial"',
        lineHeight: '1.15',
        pageBreakAfter: 'avoid',
        orphans: 2,
        widows: 2,
        textAlign: 'left',
        letterSpacing: '-1pt',
        marginTop: '20px',
        margin: '.67em 0',
        fontWeight: 700,
        marginBottom: '10px',
    },
    p: {
        margin: 0,
        paddingTop: '0pt',
        color: '#666666',
        fontSize: '15pt',
        paddingBottom: '16pt',
        fontFamily: '"Arial"',
        lineHeight: '1.15',
        pageBreakAfter: 'avoid',
        orphans: 2,
        widows: 2,
        textAlign: 'left',
    },
    text: {},
    page: {
        display: 'flex',
        width: '100%',
        justifyContent: 'flex-end',
        overflowX: 'hidden',
        maxWidth: '100%',
    },
    main: {
        opacity: 1,
        width: '100%',
        overflowX: 'hidden',
        display: 'block',
        transition: 'width linear 750ms',
        margin: 0,
        padding: 0,
        animationName: [opacityKeyframes],
        animationDuration: '1s, 1s',
        animationIterationCount: 1,
        maxWidth: '100%',
    },
    mainNarrow: {
        '@media (min-width: 768px)': {
            width: '60%',
        },
        '@media (min-width: 992px)': {
            width: '70%',
        },
        '@media (min-width: 1200px)': {
            width: '75%',
        },
    },
    content: {
        display: 'block',
        width: '100%',
        padding: '3rem 8%',
        '@media (min-width: 768px)': {
            padding: '3rem 16%',
        },
        '@media (min-width: 992px)': {
            padding: '3rem 18%',
        },
        '@media (min-width: 1200px)': {
            padding: '3rem 24%',
        },
        overflowX: 'hidden',
        maxWidth: '100%',
    },
    contentNarrow: {
        display: 'block',
        width: '100%',
        padding: '3rem 8%',
        '@media (min-width: 768px)': {
            padding: '3rem 8%',
        },
        '@media (min-width: 992px)': {
            padding: '3rem 12%',
        },
        '@media (min-width: 1200px)': {
            padding: '3rem 20%',
        },
    },

    menuBurger: {
        position: 'fixed',
        top: '1.5rem',
        left: '1.5rem',
        zIndex: '15',
        borderRadius: 5,
        height: '4rem',
        width: '4rem',
        background: '#333',
        paddingTop: 8,
        cursor: 'pointer',
        borderBottom: '0 transparent',
        boxShadow: '#948b8b 2px 2px 10px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        outline: 0,
        border: 0,
        ':hover': {
            color: '#fff',
            outline: 0,
            background: '#999',
        },
        ':focus': {
            outline: 0,
        },
    },
    bar: {
        height: '0.5rem',
        width: '2.8rem',
        display: 'block',
        margin: '0 6px 5px',
        background: '#fff',
        borderRadius: '0.3rem',
    },
})
