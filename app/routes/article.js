import { html, useState, useEffect } from '../../deps/react.js'
import { Menu } from '../components/layout/menu.js'
import {blocksStyles} from '../styles/blocks.js'
import { Footer } from '../components/layout/footer.js'
import DisqusThread from '../components/disqus/disqusThread.js'
import { getPathParts } from '../utils/path.js'
import {MenuBurger} from "../components/layout/menuBurger.js";

export const Article = ({ state, dispatch }) => {
    const articles = state.articles
    const categories = state.categories
    const texts = state.texts
    const activeArticleId = getPathParts()?.[1]
    const activeArticle = articles?.[activeArticleId]
    const activeText = texts?.[activeArticleId]
    const category = categories?.[activeArticle?.categoryId]

    const menuVisible = state?.menuVisible
    const toggleMenuVisible = () => dispatch({
        type: 'TOGGLE_MENU_VISIBLE'
    })

    useEffect(async () => {
        await fetchArticleIfNeeded(activeArticleId)
        document.getElementById('article-header').scrollIntoView()
    }, [activeArticleId])
    useEffect(async () => {
        await fetchCategoriesIfNeeded()
    }, [categories])
    return html` <style>
            ${blocksStyles}

            .hero {
                position: relative;
                display: block;
                height: 15rem;
                width: 100%;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                overflow-x: hidden;
                max-width: 100%;
            }

            .title {
                padding-top: 20pt;
                color: #000000;
                font-size: 20pt;
                padding-bottom: 6pt;
                font-family: Arial;
                line-height: 1.15;
                page-break-after: avoid;
                orphans: 2;
                widows: 2;
                text-align: left;
                letter-spacing: -1pt;
                font-weight: 700;
                margin: 0.67em 0 10px;
            }

            p {
                margin: 0;
                padding-top: 0;
                color: #666666;
                font-size: 15pt;
                padding-bottom: 16pt;
                font-family: Arial;
                line-height: 1.15;
                page-break-after: avoid;
                orphans: 2;
                widows: 2;
                text-align: left;
            }

            .page {
                display: flex;
                width: 100%;
                justify-content: flex-end;
                overflow-x: hidden;
                max-width: 100%;
            }

            main {
                opacity: 1;
                width: 100%;
                overflow-x: hidden;
                display: block;
                transition: width linear 750ms;
                margin: 0;
                padding: 0;
                animation-name: fadein;
                animation-duration: 1s, 1s;
                animation-iteration-count: 1;
                max-width: 100%;
            }

            .content: {
                display: block;
                width: 100%;
                padding: 3rem 8%;
                overflow-x: hidden;
                max-width: 100%;
            }

            .content-narrow: {
                display: block;
                width: 100%;
                padding: 3rem 8%;
            }

            @media (min-width: 768px) : {
                .hero {
                    height: 30rem;
                }

                .main-narrow {
                    width: 60%;
                }

                .content {
                    padding: 3rem 16%;
                }

                .content-narrow: {
                    padding: 3rem 8%;
                }
            }

            @media (min-width: 992px) : {
                .main-narrow {
                    width: 70%;
                }

                .content {
                    padding: 3rem 18%;
                }

                .content-narrow: {
                    padding: 3rem 12%;
                }
            }

            @media (min-width: 1200px) : {
                .main-narrow {
                    width: 75%;
                }

                .content {
                    padding: 3rem 24%;
                }

                .content-narrow: {
                    padding: 3rem 20%;
                }
            }
/*
            .menu-burger {
                position: fixed;
                top: 1.5rem;
                left: 1.5rem;
                z-index: 15;
                border-radius: 5px;
                height: 4rem;
                width: 4rem;
                background: #333;
                padding-top: 8px;
                cursor: pointer;
                border-bottom: 0 transparent;
                box-shadow: #948b8b 2px 2px 10px;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                outline: 0;
                border: 0;
            }

            .menu-burger:hover {
                color: #fff;
                outline: 0;
                background: #999;
            }

            .menu-burger:focus {
                outline: 0;
            }

            .bar {
                height: 0.5rem;
                width: 2.8rem;
                display: block;
                margin: 0 6px 5px;
                background: #fff;
                border-radius: 0.3rem;
            }*/
        </style>
        <div class="blocks-wrapper page">
            <${Helmet}
                title=${activeArticle.title}
                titleTemplate=${'%s - React Drive CMS'}
                meta=${[
                    { 'char-set': 'utf-8' },
                    { name: 'description', content: activeArticle.title },
                ]}
            />
            <${MenuBurger} toggleMenuVisible=${toggleMenuVisible} />
            <${Menu} menuVisible=${menuVisible} />
            <main
                class="blocks-wrapper main ${menuVisible ? 'main-narrow' : ''}"
            >
                <header
                    class="hero"
                    role="banner"
                    style=${{
                        backgroundImage: `url(${activeArticle.image})`,
                    }}
                    id="article-header"
                />
                <section class="content ${menuVisible ? 'content-narrow' : ''}">
                    <h1 id="article-title" class="title">
                        ${activeArticle.title}
                    </h1>
                    <p>${activeArticle.subtitle}</p>
                    <div
                        class="text"
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
        </div>`
}
