import { html } from '../../lib/htm-preact.js'
import { avoidReload } from '../../utils/avoidReload.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'
const conf = window.appConf

export const Footer = ({
    article = {},
    category = {},
    articles,
    menuVisible,
}) => {
    return html`
        <style>
            footer {
                width: 100%;
                background-color: #f5f5f5;
                border-top: solid 1px #e9e9e9;
                padding: 3rem;
            }

            footer .top {
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                margin-bottom: 3rem;
                align-items: center;
            }

            .credits {
                width: 100%;
                margin-bottom: 1rem;
            }

            .other-article {
                display: flex;
                justify-content: center;
                background-position: center center;
                background-size: cover;
                height: 20rem;
                pointer-events: auto;
                width: 80%;
                position: relative;
                margin-right: 10%;
                margin-left: 10%;
                margin-bottom: 3rem;
            }

            .other-article-narrow {
                width: 80%;
                margin-right: 10%;
                margin-left: 10%;
            }

            @media (min-width: 768px) : {
                footer .top {
                    flex-direction: row;
                }

                .top-narrow {
                    flex-direction: column;
                }

                .credits {
                    border-right: solid 4px #e9e9e9;
                    padding: 0;
                    width: 50%;
                }

                .credits-narrow {
                    border-right: none;
                    border-bottom: solid 4px #e9e9e9;
                    padding: 0;
                    width: 100%;
                }

                .other-article {
                    width: 40%;
                    margin-right: 5%;
                    margin-left: 5%;
                }

                .other-article-narrow {
                    width: 80%;
                    margin-right: 10%;
                    margin-left: 10%;
                }
            }

            @media (min-width: 992px) : {
                footer .top {
                    flex-direction: row;
                }

                .top-narrow {
                    flex-direction: row;
                }

                .credits {
                    border-right: solid 4px #e9e9e9;
                    padding: 0;
                    width: 50%;
                }

                .credits-narrow {
                    border-bottom: none;
                    border-right: solid 4px #e9e9e9;
                    padding: 0;
                    width: 50%;
                }

                .other-article {
                    width: 27.3%;
                    margin-right: 3%;
                    margin-left: 3%;
                }

                .other-article-narrow {
                    width: 40%;
                    margin-right: 5%;
                    margin-left: 5%;
                }
            }

            @media (min-width: 1200px) : {
                .other-article {
                    width: 27.3%;
                    margin-right: 3%;
                    margin-left: 3%;
                }

                .other-article-narrow {
                    width: 27.3%;
                    margin-right: 3%;
                    margin-left: 3%;
                }
            }
            .profile {
                width: 6rem;
                padding: 0;
                border: 0;
                border-radius: 50%;
                height: 6rem;
                margin-bottom: 1rem;
            }
            .credits p {
                padding-right: 2rem;
                letter-spacing: 2px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 1.1rem;
                text-transform: uppercase;
                color: #000000;
                line-height: 30px;
                margin: 0;
            }
            .underline: {
                border-bottom: solid 1px #222;
            }
            .blue-link: {
                color: #337ab7;
                text-decoration: none;
            }
            .social-links: {
                display: flex;
            }
            .social-icon: {
                margin: 0 10px;
                display: inline-block;
                color: #ccc;
                border-bottom: solid 1px #fafafa;
                text-decoration: none;
                background-color: transparent;
                font-size: 2.4rem;
            }
            .social-icon:hover {
                color: #aaa;
            }

            .footer-bottom {
                display: flex;
                flex-wrap: wrap;
                justify-content: end;
            }

            .overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 2;
                background-color: rgba(50, 50, 50, 0.5);
                top: 0;
                left: 0;
                pointer-events: none;
            }
            .other-article-title {
                color: #e9e9e9;
                cursor: pointer;
                border-bottom: solid 1px #fafafa;
                text-decoration: none;
                background-color: transparent;
                font-size: large;
                letter-spacing: 2px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                text-transform: uppercase;
                line-height: 30px;
                margin: 0;
                align-self: center;
                z-index: 5;
            }
            .other-article-title:hover {
                color: #fff;
            }
        </style>
        <footer>
            <div class="top ${menuVisible ? 'top-narrow' : ''}">
                <a
                    href="${prefixUriIfNeeded('/about')}"
                    title="About"
                    class="profile-link"
                    onClick=${avoidReload}
                >
                    <img
                        src=${prefixUriIfNeeded('/assets/profile-1.jpg')}
                        class="profile"
                        alt="user-image"
                    />
                </a>

                <div class="credits ${menuVisible ? 'credits-narrow' : ''}">
                    <p>
                        Published on the${' '}
                        <span class="underline"> ${article.date} </span>
                        ${' '}by${' '}
                        <a
                            href="${prefixUriIfNeeded('/about')}"
                            title="About"
                            class="blue-link"
                            onClick=${avoidReload}
                        >
                            ${conf.author}
                        </a>
                        ${' '}in${' '}
                        <a
                            href=${prefixUriIfNeeded(category.uri)}
                            title=${category.title}
                            class="blue-link"
                            onClick=${avoidReload}
                        >
                            ${category.title}
                        </a>
                    </p>
                </div>

                <div class="social">
                    <p>Share this article</p>
                    <div class="social-links">
                        <a
                            class="social-icon"
                            href="#"
                            data-platform="twitter"
                            data-message="Message about this post"
                        >
                            <i class="icon-twitter" />
                        </a>

                        <a
                            class="social-icon"
                            href="#"
                            data-platform="facebook"
                            data-message="Message about this post"
                        >
                            <i class="icon-facebook-official" />
                        </a>

                        <a
                            class="social-icon"
                            data-platform="mail"
                            href="${prefixUriIfNeeded('/contact')}"
                            onClick=${avoidReload}
                        >
                            <i class="icon-mail-alt" />
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                ${Object.values(articles).map(
                    (article) => html`
                        <div
                            class="other-article ${menuVisible
                                ? 'other-article-narrow'
                                : ''}"
                            style=${{
                                backgroundImage: `url(${article.image})`,
                            }}
                        >
                            <div class="overlay" />
                            <a
                                href="${prefixUriIfNeeded(article.uri)}"
                                title=${article.title}
                                class="other-article-title"
                                onClick=${avoidReload}
                            >
                                ${article.title}
                            </a>
                        </div>
                    `
                )}
            </div>
        </footer>
    `
}
