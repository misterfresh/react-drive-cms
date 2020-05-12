import { html, PureComponent } from '../../../deps/react.js'
import { StyleSheet, css } from '../../../deps/aphrodite.js'
import { connect } from '../../../deps/react-redux.js'
import { bindActionCreators } from '../../../deps/redux.js'
import { Helmet } from '../../../deps/react-helmet.js'
import { getLocation } from '../../modules/route/selectors.js'
import * as categoryActions from '../../modules/category/actionCreators.js'

import Menu from '../../components/layout/menu.js'
import Sidebar from '../../components/layout/sidebar.js'
import blocks from '../../styles/blocks.js'

class Page extends PureComponent {
    static readyOnActions(dispatch) {
        return Promise.all([
            dispatch(categoryActions.fetchCategoriesIfNeeded()),
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
        Page.readyOnActions(this.props.dispatch)
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
        let {
            title,
            subtitle,
            description,
            sidebarImage,
            showLinks,
            children,
        } = this.props
        let { menuVisible } = this.state

        return html`
            <div className=${css(blocks.wrapper, styles.page)}>
                <${Helmet}
                    title=${title}
                    titleTemplate=${'%s - React Drive CMS'}
                    meta=${[
                        { 'char-set': 'utf-8' },
                        { name: 'description', content: title },
                    ]}
                />
                <button
                    className=${css(styles.menuBurger)}
                    onClick=${this.toggleMenu}
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
                        blocks.fadein,
                        menuVisible && styles.mainNarrow
                    )}
                >
                    <${Sidebar}
                        title=${title}
                        subtitle=${subtitle}
                        description=${description}
                        sidebarImage=${sidebarImage}
                        menuVisible=${menuVisible}
                        showLinks=${showLinks}
                    />
                    <section
                        className=${css(
                            styles.content,
                            menuVisible && styles.contentNarrow
                        )}
                    >
                        ${children}
                    </section>
                </main>
            </div>
        `
    }
}

function mapStateToProps(state) {
    return {
        location: getLocation(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(Page)

let styles = StyleSheet.create({
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
        display: 'block',
        transition: 'width linear 750ms',
        '@media (min-width: 768px)': {
            display: 'block',
        },
        '@media (min-width: 992px)': {
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'flex-end',
        },
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        maxWidth: '100%',
    },
    mainNarrow: {
        margin: 0,
        width: '100%',
        '@media (min-width: 768px)': {
            width: '60%',
            display: 'block',
        },
        '@media (min-width: 992px)': {
            display: 'block',
            width: '70%',
        },
        '@media (min-width: 1200px)': {
            width: '75%',
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'flex-end',
        },
    },
    content: {
        padding: '5rem',
        overflowX: 'hidden',
        maxWidth: '100%',
        transition: 'width linear 750ms',
        width: '100%',
        marginLeft: 0,
        '@media (min-width: 768px)': {
            width: '100%',
        },
        '@media (min-width: 992px)': {
            width: '60%',
        },
        '@media (min-width: 1200px)': {
            width: '60%',
        },
    },
    contentNarrow: {
        width: '100%',
        marginLeft: 0,
        '@media (min-width: 768px)': {
            width: '100%',
        },
        '@media (min-width: 992px)': {
            width: '100%',
        },
        '@media (min-width: 1200px)': {
            width: '52%',
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
