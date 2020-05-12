import { html, Component } from '../../deps/react.js'
import { StyleSheet, css } from '../../deps/aphrodite.js'

import { connect } from '../../deps/react-redux.js'
import { bindActionCreators } from '../../deps/redux.js'

import { getLocation } from '../modules/route/selectors.js'

import Page from '../components/layout/page.js'
import DisqusCount from '../components/disqus/disqusCount.js'
import Article from '../components/blocks/article.js'
import Category from '../components/blocks/category.js'
import resolveAsset from '../utils/resolveAsset.js'

class CategoryPage extends Component {
    constructor() {
        super()
        this.setActivePanel = this.setActivePanel.bind(this)
        this.state = {
            activePanel: 'posts',
        }
    }

    setActivePanel(event) {
        let panel = event.target.dataset.panel
        this.setState({
            activePanel: panel,
        })
    }

    componentWillReceiveProps(nextProps) {
        let { match } = this.props
        let activeCategoryId = match.params.categoryId
        let nextCategoryId = nextProps.match.params.categoryId
        if (activeCategoryId !== nextCategoryId) {
            this.setState({
                activePanel: 'posts',
            })
        }
    }

    render() {
        let { location, categories, articles, match } = this.props
        let activeCategoryId = match.params.categoryId
        let activeCategory = categories[activeCategoryId]
            ? categories[activeCategoryId]
            : {
                  title: '',
                  image: resolveAsset('/assets/default-sidebar.jpg'),
              }

        let { activePanel } = this.state
        return html`
            <${Page}
                title=${activeCategory.title}
                categories=${categories}
                articles=${articles}
                sidebarImage=${activeCategory.image}
            >
                <div className=${css(styles.subNav)}>
                    <button
                        className=${css(
                            styles.button,
                            activePanel === 'posts' && styles.buttonActive
                        )}
                        onClick=${this.setActivePanel}
                        data-panel="posts"
                    >
                        Posts
                    </button>
                    <button
                        className=${css(
                            styles.button,
                            activePanel === 'categories' && styles.buttonActive
                        )}
                        onClick=${this.setActivePanel}
                        data-panel="categories"
                    >
                        Categories
                    </button>
                </div>
                <div className=${css(styles.list)}>
                    ${activePanel === 'posts' &&
                    Object.values(articles)
                        .filter(
                            (article) => article.categoryId === activeCategoryId
                        )
                        .map(
                            (article) => html`
                                <${Article}
                                    key=${article.id}
                                    article=${article}
                                    category=${categories[article.categoryId]}
                                />
                            `
                        )}
                    ${activePanel === 'categories' &&
                    Object.values(categories).map(
                        (category) => html`
                            <${Category}
                                key=${category.id}
                                category=${category}
                            />
                        `
                    )}
                </div>
                <${DisqusCount} />
            <//>
        `
    }
}

function mapStateToProps(state) {
    return {
        location: getLocation(state),
        categories: state.category.categories,
        articles: state.article.articles,
    }
}

function mapDispatchToProps(dispatch) {
    return Object.assign(bindActionCreators({}, dispatch), { dispatch })
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage)

let styles = StyleSheet.create({
    subNav: {
        borderBottom: 'solid 1px #f5f5f5',
        lineHeight: '3rem',
    },
    button: {
        borderBottom: 'solid 2px #000',
        display: 'inline-block',
        fontWeight: 700,
        marginRight: '10px',
        fontSize: '1.2rem',
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        textTransform: 'uppercase',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        outline: 0,
        lineHeight: '30px',
        letterSpacing: '2pt',
        textDecoration: 'none',
        color: '#b6b6b6',
        border: 'none',
        ':active': {
            borderBottom: 'solid 2px #000',
            color: '#333337',
        },
        ':hover': {
            borderBottom: 'solid 2px #000',
            color: '#333337',
        },
        ':focus': {
            outline: 0,
        },
    },
    buttonActive: {
        borderBottom: 'solid 2px #000',
        color: '#333337',
    },
    list: {
        animation: 'fadein 2s',
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
    },
})
