import { html, useEffect, useState } from '../../lib/htm-preact.js'
import { avoidReload } from '../../utils/avoidReload.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'

const mainLinks = [
    { path: '/', title: 'Home', icon: 'fa-house' },
    { path: '/about', title: 'About', icon: 'fa-kiwi-bird' },
    { path: '/japanese', title: '日本語', icon: 'fa-robot', lang: 'ja' },
    { path: '/chinese', title: '繁體中文', icon: 'fa-ship', lang: 'zh-Hant' },
    // { path: '/music', title: 'Inspiration', icon: 'fa-music' },
    { path: '/contact', title: 'Contact', icon: 'fa-feather-pointed' },
    { path: '/memoriam', title: 'In Memoriam', icon: 'fa-monument' },
]

export const Menu = ({ categories, articles, menuVisible }) => {
    const [activeCategory, setActiveCategory] = useState(false)
    const toggleCategory = (event) => {
        const category = event.currentTarget.dataset.category
        setActiveCategory(category !== activeCategory ? category : false)
    }
    useEffect(() => {
        setActiveCategory(Object.values(categories)?.[0]?.id)
    }, [categories])
    return html` <style>
            .menu {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 10;
                height: 100%;
                width: 100%;
                overflow-y: auto;
                padding: 8rem 0 4rem;
                background: linear-gradient(
                    165deg,
                    var(--c-menu-bg) 0%,
                    color-mix(in srgb, var(--c-menu-bg) 85%, #6d2c7f) 100%
                );
                color: var(--c-menu-text);
                font-family: var(--font-sans);
                box-shadow: var(--shadow-lg);
                transform: translateX(-100%);
                visibility: hidden;
                transition: transform 320ms var(--ease),
                    visibility 0s linear 320ms;
            }
            .menu-open {
                transform: none;
                visibility: visible;
                transition: transform 320ms var(--ease), visibility 0s;
            }
            @media (min-width: 768px) {
                .menu {
                    width: 40%;
                }
            }
            @media (min-width: 992px) {
                .menu {
                    width: 30%;
                }
            }
            @media (min-width: 1200px) {
                .menu {
                    width: 25%;
                }
            }
            .menu ul.menu-list {
                list-style: none;
                margin: 0;
                padding: 0 1.6rem;
            }
            .menu .item {
                margin: 0.2rem 0;
            }
            .menu .item-link {
                display: flex;
                align-items: center;
                gap: 1.4rem;
                width: 100%;
                padding: 1rem 1.4rem;
                border: 0;
                border-radius: var(--radius-sm);
                background: transparent;
                color: var(--c-menu-text);
                font-family: inherit;
                font-size: 1.6rem;
                font-weight: 500;
                text-align: left;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    color var(--dur) var(--ease);
            }
            .menu .item-link:hover,
            .menu .item-link:focus-visible {
                background-color: rgba(255, 255, 255, 0.08);
                color: #fff;
            }
            .menu .item-link .icon {
                width: 2rem;
                text-align: center;
                font-size: 1.5rem;
                color: var(--c-menu-accent);
                opacity: 0.85;
            }
            .menu .item-link .chevron {
                margin-left: auto;
                font-size: 1.2rem;
                color: var(--c-menu-muted);
                transition: transform var(--dur) var(--ease);
            }
            .menu .item-link[aria-expanded='true'] .chevron {
                transform: rotate(90deg);
            }
            .menu .separator {
                margin: 2.4rem 3rem;
                border: 0;
                border-top: 1px solid rgba(255, 255, 255, 0.14);
            }
            .menu .section-label {
                margin: 0 3rem 1rem;
                font-size: 1.15rem;
                font-weight: 600;
                letter-spacing: 0.14em;
                text-transform: uppercase;
                color: var(--c-menu-muted);
            }
            .menu .sub-list {
                list-style: none;
                margin: 0 0 0.6rem 3.2rem;
                padding: 0 0 0 1.4rem;
                border-left: 1px solid rgba(255, 255, 255, 0.12);
            }
            .menu .sub-item {
                display: none;
            }
            .menu .sub-item-expanded {
                display: block;
                animation: fadein 250ms var(--ease) both;
            }
            .menu .sub-item-link {
                display: block;
                padding: 0.6rem 1rem;
                border-radius: 6px;
                font-size: 1.4rem;
                line-height: 1.45;
                color: var(--c-menu-muted);
                transition: color var(--dur) var(--ease),
                    background-color var(--dur) var(--ease);
            }
            .menu .sub-item-link:hover,
            .menu .sub-item-link:focus-visible {
                color: #fff;
                background-color: rgba(255, 255, 255, 0.06);
            }
            .menu :focus-visible {
                outline-color: var(--c-menu-accent);
            }
        </style>
        <nav
            id="menu"
            class="menu ${menuVisible ? 'menu-open' : ''}"
            aria-label="Main menu"
            aria-hidden=${!menuVisible}
        >
            <ul class="menu-list">
                ${mainLinks.map(
                    (link) => html`
                        <li class="item" key=${link.path}>
                            <a
                                href="${prefixUriIfNeeded(link.path)}"
                                title=${link.title}
                                class="item-link"
                                lang=${link.lang}
                                onClick=${avoidReload}
                            >
                                <i
                                    class="fa-solid ${link.icon} icon"
                                    aria-hidden="true"
                                />
                                ${link.title}
                            </a>
                        </li>
                    `
                )}
            </ul>
            <hr class="separator" />
            <p class="section-label">Categories</p>
            <ul class="menu-list">
                ${Object.values(categories).map(
                    (category) => html`
                        <li class="item" key=${category.id}>
                            <button
                                title=${category.title}
                                onClick=${toggleCategory}
                                class="item-link"
                                data-category=${category.id}
                                aria-expanded=${category.id === activeCategory}
                            >
                                <i
                                    class="fa-solid fa-feather icon"
                                    aria-hidden="true"
                                />
                                ${category.title}
                                <i
                                    class="fa-solid fa-angle-right chevron"
                                    aria-hidden="true"
                                />
                            </button>

                            <ul class="sub-list">
                                ${Object.values(articles)
                                    .filter(
                                        (article) =>
                                            article.categoryId === category.id
                                    )
                                    .map(
                                        (article) => html`
                                            <li
                                                key=${article.id}
                                                class="sub-item ${category.id ===
                                                activeCategory
                                                    ? 'sub-item-expanded'
                                                    : ''}"
                                            >
                                                <a
                                                    title=${article.title}
                                                    href="${prefixUriIfNeeded(
                                                        article.uri
                                                    )}"
                                                    class="sub-item-link"
                                                    onClick=${avoidReload}
                                                >
                                                    ${article.title}
                                                </a>
                                            </li>
                                        `
                                    )}
                            </ul>
                        </li>
                    `
                )}
            </ul>
        </nav>`
}
