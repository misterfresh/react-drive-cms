import { html } from '../../lib/htm-preact.js'
import { avoidReload } from '../../utils/avoidReload.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'

export const Article = ({ article, category = {} }) => html`
    <style>
        article.post-card {
            position: relative;
            display: grid;
            grid-template-columns: 1fr;
            overflow: hidden;
            border: 1px solid var(--c-border);
            border-radius: var(--radius);
            background: var(--c-surface);
            box-shadow: var(--shadow-sm);
            transition: box-shadow var(--dur) var(--ease),
                transform var(--dur) var(--ease),
                border-color var(--dur) var(--ease);
        }
        article.post-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: color-mix(in srgb, var(--c-brand) 25%, var(--c-border));
        }
        article.post-card .thumb {
            aspect-ratio: 16 / 9;
            background-color: var(--c-surface-2);
            background-position: center;
            background-size: cover;
        }
        article.post-card .body {
            padding: 2rem 2.4rem 2.2rem;
        }
        article.post-card h2 {
            margin: 0 0 0.8rem;
            font-size: 2.2rem;
            font-weight: 600;
            line-height: 1.3;
        }
        article.post-card .title {
            color: var(--c-text);
        }
        /* whole card is clickable */
        article.post-card .title::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
        }
        article.post-card:hover .title {
            color: var(--c-brand);
        }
        article.post-card p {
            margin: 0;
        }
        article.post-card p.description {
            margin-bottom: 1.4rem;
            color: var(--c-text-muted);
            font-size: 1.6rem;
            line-height: 1.6;
        }
        article.post-card p.meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 1rem;
            font-family: var(--font-sans);
            font-size: 1.3rem;
            color: var(--c-text-muted);
        }
        article.post-card .category {
            position: relative;
            z-index: 2;
            padding: 0.3rem 1.1rem;
            border-radius: 999px;
            background: var(--c-brand-soft);
            color: var(--c-brand);
            font-weight: 500;
        }
        article.post-card .category:hover {
            background: var(--c-brand);
            color: var(--c-on-brand);
        }
        @media (min-width: 600px) {
            article.post-card.has-thumb {
                grid-template-columns: 20rem 1fr;
            }
            article.post-card .thumb {
                aspect-ratio: auto;
                min-height: 100%;
            }
        }
    </style>

    <article class="post-card ${article.image ? 'has-thumb' : ''}">
        ${article.image &&
        html`<div
            class="thumb"
            style=${{ backgroundImage: `url(${article.image})` }}
            aria-hidden="true"
        />`}
        <div class="body">
            <h2>
                <a
                    href=${prefixUriIfNeeded(article.uri)}
                    title=${article.title}
                    class="title"
                    onClick=${avoidReload}
                >
                    ${article.title}
                </a>
            </h2>
            <p class="description">${article.subtitle}</p>
            <p class="meta">
                <a
                    title=${category.title}
                    href=${prefixUriIfNeeded(category.uri)}
                    class="category"
                    onClick=${avoidReload}
                >
                    ${category.title}
                </a>
                <span
                    title=${'Comments for ' + article.title}
                    data-disqus-url=${window.location.protocol +
                    window.location.hostname +
                    article.uri}
                    data-disqus-identifier=${article.id}
                    class="disqus-comment-count"
                />
            </p>
        </div>
    </article>
`
