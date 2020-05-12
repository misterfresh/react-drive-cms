import { html, PureComponent } from '../../../deps/react.js'
import { StyleSheet, css } from '../../../deps/aphrodite.js'
import { Link } from '../../../deps/react-router-dom.js'
import resolveAsset from '../../utils/resolveAsset.js'
const conf = window.appConf

class Footer extends PureComponent {
    render({ article, category, articles, menuVisible }) {
        return html`
            <footer className=${css(styles.footer)}>
                <div
                    className=${css(
                        styles.footerTop,
                        menuVisible && styles.topNarrow
                    )}
                >
                    <${Link}
                        to="/about"
                        title="About"
                        className=${css(styles.profileLink)}
                    >
                        <img
                            src=${resolveAsset('/assets/profile-1.jpg')}
                            className=${css(styles.profile)}
                            alt="user-image"
                        />
                    <//>

                    <div
                        className=${css(
                            styles.credits,
                            menuVisible && styles.creditsNarrow
                        )}
                    >
                        <p className=${css(styles.p)}>
                            Published on the${' '}
                            <span className=${css(styles.underline)}>
                                ${article.date}
                            </span>
                            ${' '}by${' '}
                            <${Link}
                                to="/about"
                                title="About"
                                className=${css(styles.blueLink)}
                            >
                                ${conf.author}
                            <//>
                            ${' '}in${' '}
                            <${Link}
                                to=${category.uri}
                                title=${category.title}
                                className=${css(styles.blueLink)}
                            >
                                ${category.title}
                            <//>
                        </p>
                    </div>

                    <div className=${css(styles.social)}>
                        <p className=${css(styles.p)}>Share this article</p>
                        <div className=${css(styles.socialLinks)}>
                            <a
                                className=${css(styles.socialIcon)}
                                href="#"
                                data-platform="twitter"
                                data-message="Message about this post"
                            >
                                <i className="icon-twitter" />
                            </a>

                            <a
                                className=${css(styles.socialIcon)}
                                href="#"
                                data-platform="facebook"
                                data-message="Message about this post"
                            >
                                <i className="icon-facebook-official" />
                            </a>

                            <${Link}
                                className=${css(styles.socialIcon)}
                                data-platform="mail"
                                to="/contact"
                            >
                                <i className="icon-mail-alt" />
                            <//>
                        </div>
                    </div>
                </div>
                <div className=${css(styles.footerBottom)}>
                    ${Object.values(articles).map(
                        (article) => html`
                            <div
                                className=${css(
                                    styles.otherArticle,
                                    menuVisible && styles.otherArticleNarrow
                                )}
                                style=${{
                                    backgroundImage: `url(${article.image})`,
                                }}
                            >
                                <div className=${css(styles.overlay)} />
                                <${Link}
                                    to=${article.uri}
                                    title=${article.title}
                                    className=${css(styles.otherArticleTitle)}
                                >
                                    ${article.title}
                                <//>
                            </div>
                        `
                    )}
                </div>
            </footer>
        `
    }
}

export default Footer

let styles = StyleSheet.create({
    footer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderTop: 'solid 1px #E9E9E9',
        padding: '3rem',
    },
    footerTop: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        '@media (min-width: 768px)': {
            flexDirection: 'row',
        },
        '@media (min-width: 992px)': {
            flexDirection: 'row',
        },
        marginBottom: '3rem',
        alignItems: 'center',
    },
    topNarrow: {
        '@media (min-width: 768px)': {
            flexDirection: 'column',
        },
        '@media (min-width: 992px)': {
            flexDirection: 'row',
        },
    },
    profile: {
        width: '6rem',
        padding: 0,
        border: 0,
        borderRadius: '50%',
        height: '6rem',
        marginBottom: '1rem',
    },
    credits: {
        width: '100%',
        marginBottom: '1rem',
        '@media (min-width: 768px)': {
            borderRight: 'solid 4px #E9E9E9',
            padding: 0,
            width: '50%',
        },
        '@media (min-width: 992px)': {
            borderRight: 'solid 4px #E9E9E9',
            padding: 0,
            width: '50%',
        },
    },
    creditsNarrow: {
        '@media (min-width: 768px)': {
            borderRight: 'none',
            borderBottom: 'solid 4px #E9E9E9',
            padding: 0,
            width: '100%',
        },
        '@media (min-width: 992px)': {
            borderBottom: 'none',
            borderRight: 'solid 4px #E9E9E9',
            padding: 0,
            width: '50%',
        },
    },
    p: {
        paddingRight: '2rem',
        letterSpacing: '2px',
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        fontSize: '1.1rem',
        textTransform: 'uppercase',
        color: '#000000',
        lineHeight: '30px',
        margin: 0,
    },
    underline: {
        borderBottom: 'solid 1px #222',
    },
    blueLink: {
        color: '#337ab7',
        textDecoration: 'none',
    },
    share: {},
    social: {},
    socialLinks: {
        display: 'flex',
    },
    socialIcon: {
        margin: '0 10px',
        display: 'inline-block',
        color: '#ccc',
        borderBottom: 'solid 1px #fAfafa',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        fontSize: '2.4rem',
        ':hover': {
            color: '#aaa',
        },
    },
    footerBottom: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'end',
    },
    otherArticle: {
        display: 'flex',
        justifyContent: 'center',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        height: '20rem',
        pointerEvents: 'auto',
        width: '80%',
        position: 'relative',
        marginRight: '10%',
        marginLeft: '10%',
        marginBottom: '3rem',
        '@media (min-width: 768px)': {
            width: '40%',
            marginRight: '5%',
            marginLeft: '5%',
        },
        '@media (min-width: 992px)': {
            width: '27.3%',
            marginRight: '3%',
            marginLeft: '3%',
        },
        '@media (min-width: 1200px)': {
            width: '27.3%',
            marginRight: '3%',
            marginLeft: '3%',
        },
    },
    otherArticleNarrow: {
        width: '80%',
        marginRight: '10%',
        marginLeft: '10%',
        '@media (min-width: 768px)': {
            width: '80%',
            marginRight: '10%',
            marginLeft: '10%',
        },
        '@media (min-width: 992px)': {
            width: '40%',
            marginRight: '5%',
            marginLeft: '5%',
        },
        '@media (min-width: 1200px)': {
            width: '27.3%',
            marginRight: '3%',
            marginLeft: '3%',
        },
    },

    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 2,
        backgroundColor: 'rgba(50,50,50,.5)',
        top: 0,
        left: 0,
        pointerEvents: 'none',
    },
    otherArticleTitle: {
        color: '#E9E9E9',
        marginRight: '5px',
        cursor: 'pointer',
        borderBottom: 'solid 1px #fAfafa',
        textDecoration: 'none',
        backgroundColor: 'transparent',
        fontSize: 'large',
        letterSpacing: '2px',
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        textTransform: 'uppercase',
        lineHeight: '30px',
        margin: 0,
        alignSelf: 'center',
        zIndex: 5,
        ':hover': {
            color: '#fff',
        },
    },
})
