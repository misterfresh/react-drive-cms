import { html } from '../../lib/htm-preact.js'
import { avoidReload } from '../../utils/avoidReload.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'

export const Category = ({ category, setActivePanel }) => html`
    <style>
        .category-block {
            position: relative;
            display: flex;
            align-items: flex-end;
            aspect-ratio: 4 / 3;
            overflow: hidden;
            border-radius: var(--radius);
            background-color: var(--c-surface-2);
            box-shadow: var(--shadow-sm);
            isolation: isolate;
            transition: box-shadow var(--dur) var(--ease),
                transform var(--dur) var(--ease);
        }
        .category-block .category-bg {
            position: absolute;
            inset: 0;
            z-index: -1;
            background-position: center;
            background-size: cover;
            transition: transform 600ms var(--ease);
        }
        .category-block::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: -1;
            background: var(--c-scrim);
        }
        .category-block:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        .category-block:hover .category-bg {
            transform: scale(1.06);
        }
        .category-block .title {
            margin: 0;
            padding: 2rem 2.2rem;
            color: #fff;
            font-family: var(--font-serif);
            font-size: 2.2rem;
            font-weight: 600;
            line-height: 1.2;
            text-shadow: 0 1px 8px rgba(0, 0, 0, 0.35);
        }
    </style>

    <a
        href=${prefixUriIfNeeded(category.uri)}
        class="category-block"
        onClick=${(event) => {
            avoidReload(event)
            setActivePanel('posts')
        }}
    >
        <div
            class="category-bg"
            style=${{ backgroundImage: `url(${category.image})` }}
            aria-hidden="true"
        />
        <h2 class="title" title=${category.title}>${category.title}</h2>
    </a>
`
