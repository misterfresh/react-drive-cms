import { html } from '../../lib/htm-preact.js'
import { avoidReload } from '../../utils/avoidReload.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'
import { Subscribe } from '../subscribe.js'
const conf = window.appConf

export const Footer = ({ article = {}, category = {}, articles = {} }) => {
    const pageUrl = encodeURIComponent(window.location.href)
    const shareText = encodeURIComponent(article.title ?? conf.author)
    const otherArticles = Object.values(articles).filter(
        (other) => other.id !== article.id
    )

    return html`
        <style>
            footer.article-footer {
                width: 100%;
                padding: clamp(3rem, 5vw, 5rem) clamp(2rem, 6vw, 6rem);
                background-color: var(--c-surface-2);
                border-top: 1px solid var(--c-border);
                font-family: var(--font-sans);
            }
            .article-footer .footer-top {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 2.4rem;
                max-width: 72rem;
                margin: 0 auto 4rem;
                padding-bottom: 3rem;
                border-bottom: 1px solid var(--c-border);
            }
            .article-footer .author {
                display: flex;
                align-items: center;
                gap: 1.6rem;
                min-width: 0;
            }
            .article-footer .avatar {
                flex: none;
                width: 6.4rem;
                height: 6.4rem;
                object-fit: cover;
                border-radius: 50%;
                border: 3px solid var(--c-surface);
                box-shadow: var(--shadow-sm);
            }
            .article-footer .byline {
                margin: 0;
                font-size: 1.4rem;
                line-height: 1.6;
                color: var(--c-text-muted);
            }
            .article-footer .byline a {
                font-weight: 600;
            }
            .article-footer .social {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .article-footer .social-label {
                margin-right: 0.4rem;
                font-size: 1.2rem;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--c-text-muted);
            }
            .article-footer .social-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 4rem;
                height: 4rem;
                border-radius: 50%;
                border: 1px solid var(--c-border);
                background: var(--c-surface);
                color: var(--c-text-muted);
                font-size: 1.6rem;
                transition: color var(--dur) var(--ease),
                    background-color var(--dur) var(--ease),
                    border-color var(--dur) var(--ease);
            }
            .article-footer .social-icon:hover {
                color: var(--c-on-brand);
                background: var(--c-brand);
                border-color: var(--c-brand);
            }
            .article-footer .more-title {
                max-width: 72rem;
                margin: 0 auto 2rem;
                font-size: 1.2rem;
                font-weight: 600;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: var(--c-text-muted);
            }
            .article-footer .more-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
                gap: 1.6rem;
                max-width: 120rem;
                margin: 0 auto;
            }
            .article-footer .other-article {
                position: relative;
                display: flex;
                align-items: flex-end;
                aspect-ratio: 16 / 10;
                overflow: hidden;
                border-radius: var(--radius);
                background-color: var(--c-menu-bg);
                background-position: center;
                background-size: cover;
                box-shadow: var(--shadow-sm);
                isolation: isolate;
                transition: transform var(--dur) var(--ease),
                    box-shadow var(--dur) var(--ease);
            }
            .article-footer .other-article::before {
                content: '';
                position: absolute;
                inset: 0;
                z-index: -1;
                background: var(--c-scrim);
            }
            .article-footer .other-article:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            .article-footer .other-article-title {
                padding: 1.6rem 1.8rem;
                color: #fff;
                font-family: var(--font-serif);
                font-size: 1.7rem;
                font-weight: 600;
                line-height: 1.3;
                text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
            }
        </style>
        <footer class="article-footer">
            <div class="footer-top">
                <div class="author">
                    <a
                        href="${prefixUriIfNeeded('/about')}"
                        title="About"
                        onClick=${avoidReload}
                    >
                        <img
                            src=${prefixUriIfNeeded('/assets/キョロちゃん.jpg')}
                            class="avatar"
                            alt=${conf.author}
                        />
                    </a>
                    <p class="byline">
                        ${article.date && html`Published ${article.date}${' '}`}
                        by${' '}
                        <a
                            href="${prefixUriIfNeeded('/about')}"
                            title="About"
                            onClick=${avoidReload}
                        >
                            ${conf.author}
                        </a>
                        ${category.title &&
                        html`${' '}in${' '}
                            <a
                                href=${prefixUriIfNeeded(category.uri)}
                                title=${category.title}
                                onClick=${avoidReload}
                            >
                                ${category.title}
                            </a>`}
                    </p>
                </div>

                <div class="social">
                    <span class="social-label">Share</span>
                    <a
                        class="social-icon"
                        href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}"
                        target="_blank"
                        rel="noopener"
                        aria-label="Share on X"
                    >
                        <i class="fa-brands fa-x-twitter" aria-hidden="true" />
                    </a>
                    <a
                        class="social-icon"
                        href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}"
                        target="_blank"
                        rel="noopener"
                        aria-label="Share on Facebook"
                    >
                        <i class="fa-brands fa-facebook-f" aria-hidden="true" />
                    </a>
                    <a
                        class="social-icon"
                        href="${prefixUriIfNeeded('/contact')}"
                        onClick=${avoidReload}
                        aria-label="Contact"
                    >
                        <i class="fa-solid fa-envelope" aria-hidden="true" />
                    </a>
                </div>
            </div>

            <${Subscribe} compact=${true} />

            ${otherArticles.length > 0 &&
            html`<h3 class="more-title">More from ${conf.author}</h3>
                <div class="more-grid">
                    ${otherArticles.map(
                        (other) => html`
                            <a
                                key=${other.id}
                                href="${prefixUriIfNeeded(other.uri)}"
                                title=${other.title}
                                class="other-article"
                                style=${{
                                    backgroundImage: `url(${other.image})`,
                                }}
                                onClick=${avoidReload}
                            >
                                <span class="other-article-title">
                                    ${other.title}
                                </span>
                            </a>
                        `
                    )}
                </div>`}
        </footer>
    `
}
