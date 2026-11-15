import { html, useEffect, useMemo, useState } from '../lib/htm-preact.js'
import { Menu } from '../components/layout/menu.js'
import { blocksStyles } from '../styles/blocks.js'
import { Footer } from '../components/layout/footer.js'
import { DisqusThread } from '../components/disqus/disqusThread.js'
import { getActiveItemId } from '../utils/path.js'
import { MenuBurger } from '../components/layout/menuBurger.js'
import { useCategoriesAndArticles } from '../hooks/useCategoriesAndArticles.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { useArticleText } from '../hooks/useArticleText.js'
import { useMenuVisible } from '../hooks/useMenuVisible.js'
import { Spinner } from '../styles/Spinner.js'
import { BirdCall } from '../components/birdCall.js'
import { Lightbox } from '../components/lightbox.js'
import { getBirdForPost } from '../data/birds.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

export const Article = ({ state, dispatch }) => {
    const { articles, categories } = useCategoriesAndArticles()
    const activeArticleId = state?.activeItemId ?? getActiveItemId()
    const activeArticle = articles?.[activeArticleId] ?? {}
    const activeText = useArticleText(activeArticleId)
    const category = categories?.[activeArticle?.categoryId]
    const bird = getBirdForPost(activeArticleId)

    const title = activeArticle?.title
    const subtitle = activeArticle?.subtitle

    const { menuVisible, toggleMenuVisible } = useMenuVisible()
    usePageMeta(title, subtitle)

    const readingMinutes = useMemo(() => getReadingMinutes(activeText), [activeText])

    // Tap a photo in the article to see it full-screen, then browse the others
    const [lightbox, setLightbox] = useState(null)
    const openLightbox = (event) => {
        if (event.target.tagName !== 'IMG') return
        const images = [...event.currentTarget.querySelectorAll('img')]
        setLightbox({
            items: images.map((image) => ({ src: image.src })),
            index: images.indexOf(event.target),
        })
    }

    return html` <style>
            ${blocksStyles} .page {
                display: flex;
                width: 100%;
                justify-content: flex-end;
                overflow-x: hidden;
                max-width: 100%;
            }

            main.article {
                width: 100%;
                max-width: 100%;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
                display: block;
                transition: width 320ms var(--ease);
                animation: fadein 400ms var(--ease) both;
            }

            .hero {
                position: relative;
                display: flex;
                align-items: flex-end;
                width: 100%;
                min-height: clamp(32rem, 55vh, 60rem);
                background-color: var(--c-menu-bg);
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            }
            .hero::before {
                content: '';
                position: absolute;
                inset: 0;
                background: var(--c-scrim);
            }
            .hero-text {
                position: relative;
                width: 100%;
                max-width: 76rem;
                margin: 0 auto;
                padding: 10rem clamp(2rem, 6vw, 4rem) clamp(3rem, 5vw, 5rem);
            }
            .hero .category-pill {
                display: inline-block;
                margin-bottom: 1.6rem;
                padding: 0.4rem 1.2rem;
                border-radius: 999px;
                border: 1px solid rgba(255, 255, 255, 0.35);
                background: rgba(255, 255, 255, 0.14);
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);
                color: #fff;
                font-family: var(--font-sans);
                font-size: 1.25rem;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
            }
            .hero .category-pill:hover {
                background: rgba(255, 255, 255, 0.26);
                color: #fff;
            }
            .hero .title {
                margin: 0 0 1.2rem;
                padding: 0;
                color: #fff;
                font-family: var(--font-serif);
                font-size: clamp(3.2rem, 2.4rem + 2.6vw, 5.4rem);
                font-weight: 700;
                line-height: 1.12;
                letter-spacing: -0.015em;
                text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);
                text-wrap: balance;
            }
            .hero .subtitle {
                margin: 0;
                max-width: 60ch;
                color: rgba(255, 255, 255, 0.88);
                font-family: var(--font-serif);
                font-size: clamp(1.7rem, 1.5rem + 0.5vw, 2.1rem);
                line-height: 1.55;
                text-shadow: 0 1px 8px rgba(0, 0, 0, 0.35);
            }
            .hero .subtitle:empty {
                display: none;
            }

            section.article-content {
                width: 100%;
                max-width: 76rem;
                margin: 0 auto;
                padding: clamp(3.2rem, 6vw, 6rem) clamp(2rem, 6vw, 4rem);
                background: transparent;
            }

            /* ---- Readable typography for the Google Docs HTML ---- */
            .article-body .gdoc,
            .article-body .gdoc p,
            .article-body .gdoc li {
                font-family: var(--font-serif) !important;
                font-size: 1.9rem !important;
                line-height: 1.85 !important;
                color: var(--c-text) !important;
            }
            .article-body .gdoc p {
                margin: 0 0 1.4em !important;
                padding: 0 !important;
                text-align: left;
            }
            .article-body .gdoc span {
                font-family: inherit !important;
                font-size: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
            }
            .article-body .gdoc h1,
            .article-body .gdoc h2,
            .article-body .gdoc h3,
            .article-body .gdoc h4 {
                margin: 1.8em 0 0.6em !important;
                padding: 0 !important;
                font-family: var(--font-serif) !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
                color: var(--c-text) !important;
            }
            .article-body .gdoc h1 {
                font-size: 3rem !important;
            }
            .article-body .gdoc h2 {
                font-size: 2.5rem !important;
            }
            .article-body .gdoc h3,
            .article-body .gdoc h4 {
                font-size: 2.1rem !important;
            }
            .article-body .gdoc a,
            .article-body .gdoc a span {
                color: var(--c-brand) !important;
                text-decoration: underline !important;
                text-decoration-thickness: 1px !important;
                text-underline-offset: 3px;
            }
            .article-body .gdoc ul,
            .article-body .gdoc ol {
                margin: 0 0 1.4em !important;
                padding-left: 1.6em !important;
            }
            .article-body .gdoc li {
                margin: 0 0 0.4em !important;
                padding: 0 !important;
            }
            .article-body .gdoc span:has(> img) {
                display: block !important;
                width: auto !important;
                height: auto !important;
                max-width: 100% !important;
                margin: 2.4rem auto !important;
            }
            .article-body .gdoc img {
                display: block;
                max-width: 100% !important;
                height: auto !important;
                margin: 0 auto !important;
                border-radius: var(--radius-sm);
                box-shadow: var(--shadow-md);
            }
            .article-body .gdoc hr {
                margin: 3.2rem auto;
                width: 30%;
                border: 0;
                border-top: 1px solid var(--c-border);
            }

            .hero .post-meta {
                margin: 1.6rem 0 0;
                color: rgba(255, 255, 255, 0.8);
                font-family: var(--font-sans);
                font-size: 1.4rem;
                letter-spacing: 0.02em;
            }
            .hero .hero-call {
                margin-top: 1.8rem;
            }
            .hero .post-meta > * + *::before {
                content: '·';
                margin: 0 0.8rem;
            }

            .article-body .gdoc img {
                cursor: zoom-in;
            }
            .loading {
                display: flex;
                justify-content: center;
                padding: 6rem 0;
            }

            #disqus_thread {
                margin-top: 5rem;
                padding-top: 3rem;
                border-top: 1px solid var(--c-border);
            }

            @media (min-width: 768px) {
                main.article.main-narrow {
                    width: 60%;
                }
            }
            @media (min-width: 992px) {
                main.article.main-narrow {
                    width: 70%;
                }
            }
            @media (min-width: 1200px) {
                main.article.main-narrow {
                    width: 75%;
                }
            }
        </style>
        <div class="wrapper page">
            <${MenuBurger}
                toggleMenuVisible=${toggleMenuVisible}
                menuVisible=${menuVisible}
            />
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
                >
                    <div class="hero-text">
                        ${category?.title &&
                        html`<a
                            class="category-pill"
                            href=${prefixUriIfNeeded(category.uri)}
                            onClick=${avoidReload}
                        >
                            ${category.title}
                        </a>`}
                        <h1 id="article-title" class="title">
                            ${activeArticle?.title}
                        </h1>
                        <p class="subtitle">${activeArticle?.subtitle}</p>
                        ${activeArticle?.date || readingMinutes > 0
                            ? html`<p class="post-meta">
                            ${activeArticle?.date &&
                            html`<time datetime=${activeArticle.lastUpdated}
                                >${activeArticle.date}</time
                            >`}
                            ${readingMinutes > 0 &&
                            html`<span>${readingMinutes} min read</span>`}
                        </p>`
                            : null}
                        ${bird?.call &&
                        html`<div class="hero-call">
                            <${BirdCall} bird=${bird} variant="light" />
                        </div>`}
                    </div>
                </header>
                <section class="article-content">
                    ${activeText
                        ? html`<div
                              class="article-body"
                              onClick=${openLightbox}
                              dangerouslySetInnerHTML=${{ __html: activeText }}
                          />`
                        : html`<div class="loading">
                              <${Spinner}
                                  stroke="var(--c-brand)"
                                  width=${40}
                                  height=${40}
                              />
                          </div>`}
                    <${DisqusThread}
                        articleId=${activeArticle.id}
                        articleTitle=${activeArticle.title}
                    />
                </section>
                <${Footer}
                    article=${activeArticle}
                    articles=${articles}
                    category=${category}
                />
            </main>
            ${lightbox &&
            html`<${Lightbox}
                items=${lightbox.items}
                index=${lightbox.index}
                onChange=${(index) => setLightbox({ ...lightbox, index })}
                onClose=${() => setLightbox(null)}
            />`}
        </div>`
}

// ~220 English words or ~500 Chinese/Japanese characters per minute
const getReadingMinutes = (articleHtml) => {
    if (!articleHtml) return 0
    const text = articleHtml
        .replace(/<style[\s\S]*?<\/style>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z#0-9]+;/gi, ' ')
    const words = text.match(/[A-Za-z0-9\u00C0-\u024F'’]+/g)?.length ?? 0
    const cjkChars =
        text.match(/[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0
    return Math.max(1, Math.round(words / 220 + cjkChars / 500))
}
