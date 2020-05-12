import { html, Component } from '../../../deps/react.js'
import { StyleSheet, css } from '../../../deps/aphrodite.js'
import { Link } from '../../../deps/react-router-dom.js'
import { connect } from '../../../deps/react-redux.js'
import { bindActionCreators } from '../../../deps/redux.js'

class Menu extends Component {
    constructor() {
        super()
        this.toggleCategory = this.toggleCategory.bind(this)

        this.state = {
            activeCategory: false,
        }
    }

    toggleCategory(event) {
        let { activeCategory } = this.state
        let category = event.target.dataset.category
        this.setState({
            activeCategory: category !== activeCategory ? category : false,
        })
    }

    componentWillReceiveProps(nextProps) {
        let { categories } = nextProps
        if (categories && Object.values(categories).length) {
            this.setState({
                activeCategory: Object.values(categories)[0]['id'],
            })
        }
    }

    render() {
        let { categories, articles, menuVisible } = this.props
        let { activeCategory } = this.state
        return html`
            <nav
                id="menu"
                className=${css(styles.menu, menuVisible && styles.menuOpen)}
            >
                <ul className=${css(styles.list)}>
                    <li className=${css(styles.item)}>
                        <i className=${'fas fa-home ' + css(styles.icon)} />
                        <${Link}
                            to="/"
                            title="Home"
                            className=${css(styles.itemLink)}
                        >
                            Home
                        <//>
                    </li>
                    <li className=${css(styles.item)}>
                        <i className=${'fas fa-user ' + css(styles.icon)} />
                        <${Link}
                            to="/about"
                            title="About"
                            className=${css(styles.itemLink)}
                        >
                            About
                        <//>
                    </li>
                    <li className=${css(styles.item)}>
                        <i
                            className=${'fas fa-paper-plane ' +
                            css(styles.icon)}
                        />
                        <${Link}
                            to="/contact"
                            title="Contact"
                            className=${css(styles.itemLink)}
                        >
                            Contact
                        <//>
                    </li>
                </ul>
                <hr className=${css(styles.separator)} />
                <ul className=${css(styles.list)}>
                    ${Object.values(categories).map(
                        (category, index) => html`
                            <li key=${category.id}>
                                <i
                                    className=${'fas fa-angle-right ' +
                                    css(styles.icon)}
                                />
                                <button
                                    title=${category.title}
                                    onClick=${this.toggleCategory}
                                    className=${css(styles.itemLink)}
                                    data-category=${category.id}
                                >
                                    ${category.title}
                                </button>

                                <ul className=${css(styles.subList)}>
                                    ${Object.values(articles)
                                        .filter(
                                            (article) =>
                                                article.categoryId ===
                                                category.id
                                        )
                                        .map(
                                            (article) => html`
                                                <li
                                                    key=${article.id}
                                                    className=${css(
                                                        styles.subItem,
                                                        category.id ===
                                                            activeCategory &&
                                                            styles.subItemExpanded
                                                    )}
                                                >
                                                    <${Link}
                                                        key=${article.id}
                                                        title=${article.title}
                                                        to=${article.uri}
                                                        className=${css(
                                                            styles.subItemLink
                                                        )}
                                                    >
                                                        ${article.title}
                                                    <//>
                                                </li>
                                            `
                                        )}
                                </ul>
                            </li>
                        `
                    )}
                </ul>
            </nav>
        `
    }
}

function mapStateToProps(state) {
    return {
        categories: state.category.categories,
        articles: state.article.articles,
    }
}

function mapDispatchToProps(dispatch) {
    return Object.assign(bindActionCreators({}, dispatch), { dispatch })
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)

let styles = StyleSheet.create({
    menu: {
        backgroundColor: '#333',
        overflow: 'hidden',
        zIndex: 10,
        display: 'block',
        top: 0,
        left: 0,
        height: '100%',
        boxShadow: '#000 2px 2px 10px',
        paddingTop: '5rem',
        transition: 'opacity linear 750ms,width linear 750ms',
        width: 0,
        opacity: 0,
        paddingRight: 0,
        position: 'fixed',
    },
    menuOpen: {
        opacity: 1,
        width: '100%',
        '@media (min-width: 768px)': {
            width: '40%',
        },
        '@media (min-width: 992px)': {
            width: '30%',
        },
        '@media (min-width: 1200px)': {
            width: '25%',
        },
    },
    icon: {
        padding: '0 20px',
        color: '#DADADA',
        fontSize: '1.6rem',
    },
    list: {
        padding: '10px 0',
        fontSize: '1.6rem',
        marginBottom: 20,
        marginTop: 0,
    },
    item: {
        margin: 0,
        listStyle: 'none',
        padding: '10px 0',
        fontSize: '1.6rem',
    },
    itemLink: {
        color: '#DADADA',
        fontWeight: 500,
        fontSize: 'large',
        borderBottom: '0 transparent',
        backgroundColor: 'transparent',
        outline: 0,
        border: 0,
        cursor: 'pointer',
        ':hover': {
            color: '#fff',
            outline: 0,
        },
        ':focus': {
            outline: 0,
        },
        fontFamily: 'Arial',
    },
    separator: {
        margin: '20px auto',
        display: 'block',
        border: '1px solid #dededc',
        height: 0,
        width: '40%',
    },
    subList: {
        marginLeft: '15px',
        paddingTop: 0,
        paddingBottom: 0,
        position: 'relative',
        padding: '10px 0',
        marginBottom: 0,
        fontSize: '1.6rem',
        marginTop: 0,
    },
    subItem: {
        padding: 0,
        height: 0,
        overflow: 'hidden',
        opacity: '.1',
        position: 'relative',
        fontSize: 'small',
        margin: 0,
        listStyle: 'none',
        transition: 'opacity ease 750ms,height linear 750ms',
    },
    subItemExpanded: {
        opacity: 1,
        height: '4.5rem',
        transition: 'opacity ease 750ms,height linear 750ms',
    },
    subItemLink: {
        fontSize: 'medium',
        position: 'relative',
        color: '#DADADA',
        fontWeight: 500,
        borderBottom: '0 transparent',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        fontStyle: 'normal',
        top: '10px',
        ':hover': {
            borderBottom: 'none',
            color: '#fff',
        },
        fontFamily: 'Arial',
    },
})
