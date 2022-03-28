import {
    html,
    useEffect,
} from 'https://unpkg.com/htm@3.1.0/preact/standalone.module.js'
import { Menu } from '../components/layout/menu.js'
import { blocksStyles } from '../styles/blocks.js'
import { Footer } from '../components/layout/footer.js'
import { DisqusThread } from '../components/disqus/disqusThread.js'
import { getActiveItemId } from '../utils/path.js'
import { MenuBurger } from '../components/layout/menuBurger.js'
import { Drive } from '../lib/drive.js'

export const Article = ({ state, dispatch }) => {
    const articles = state.articles
    const categories = state.categories
    const texts = state.texts
    const activeArticleId = state?.activeItemId ?? getActiveItemId()
    const activeArticle = articles?.[activeArticleId] ?? {}
    const activeText = texts?.[activeArticleId]
    const category = categories?.[activeArticle?.categoryId]
    const isFetchingArticle = state?.isFetching?.[activeArticleId]

    const title = activeArticle?.title
    const subtitle = activeArticle?.subtitle
    const menuVisible = state?.menuVisible
    const toggleMenuVisible = () =>
        dispatch({
            type: 'TOGGLE_MENU_VISIBLE',
        })

    useEffect(() => {
        document.title = title
            ? `${title} - React Drive CMS`
            : 'React Drive CMS'
    }, [title])
    useEffect(() => {
        document
            ?.querySelector('meta[name="description"]')
            ?.setAttribute('content', subtitle)
    }, [subtitle])

    const isFetchingCategories = state?.isFetching?.categories
    useEffect(async () => {
        if (!isFetchingCategories && !Object.values(categories).length) {
            await Drive.fetchCategories(dispatch)
        }
    }, [categories, dispatch, isFetchingCategories])

    useEffect(async () => {
        if (!texts?.[activeArticleId] && !isFetchingArticle) {
            await Drive.fetchArticle(activeArticleId, dispatch)
            document.getElementById('article-header')?.scrollIntoView()
        }
    }, [texts, activeArticleId, isFetchingArticle, dispatch])
    return html` <style>
            ${blocksStyles} .hero {
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

            .article-content p {
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

            main.article {
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

            section.article-content: {
                display: block;
                width: 100%;
                padding: 3rem 8%;
                overflow-x: hidden;
                max-width: 100%;
            }

            section.article-content.content-narrow: {
                display: block;
                width: 100%;
                padding: 3rem 8%;
            }

            @media (min-width: 768px) {
                .hero {
                    height: 30rem;
                }
                main.article.main-narrow {
                    width: 60%;
                }
                section.article-content {
                    padding: 3rem 16%;
                }
                section.article-content.content-narrow: {
                    padding: 3rem 8%;
                }
            }

            @media (min-width: 992px) {
                main.article.main-narrow {
                    width: 70%;
                }
                section.article-content {
                    padding: 3rem 18%;
                }
                section.article-content.content-narrow: {
                    padding: 3rem 12%;
                }
            }

            @media (min-width: 1200px) {
                main.article.main-narrow {
                    width: 75%;
                }
                section.article-content {
                    padding: 3rem 24%;
                }
                section.article-content.content-narrow: {
                    padding: 3rem 20%;
                }
            }
        </style>
        <div class="wrapper page">
            <${MenuBurger} toggleMenuVisible=${toggleMenuVisible} />
            <${Menu}
                menuVisible=${menuVisible}
                articles=${articles}
                categories=${categories}
            />
            <main class="wrapper article ${menuVisible ? 'main-narrow' : ''}">
                <header
                    class="hero"
                    role="banner"
                    style=${{
                        backgroundImage: `url(${activeArticle?.image})`,
                    }}
                    id="article-header"
                />
                <section
                    class="block article-content ${menuVisible
                        ? 'content-narrow'
                        : ''}"
                >
                    <h1 id="article-title" class="title">
                        ${activeArticle?.title}
                    </h1>
                    <p>${activeArticle?.subtitle}</p>
                    <div
                        class="text"
                        dangerouslySetInnerHTML=${{ __html: activeText }}
                    />
                    <${DisqusThread}
                        articleId=${activeArticle.id}
                        articleTitle=${activeArticle.title}
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
