import { html } from '../../lib/htm-preact.js'
import { DisqusCount } from '../disqus/disqusCount.js'
import { Article as ArticleBlock } from '../blocks/article.js'
import { Category as CategoryBlock } from '../blocks/category.js'
import { getActiveItemId } from '../../utils/path.js'
import { useCategoriesAndArticles } from '../../hooks/useCategoriesAndArticles.js'
import { useActivePanel } from '../../hooks/useActivePanel.js'

export const PostsAndCategories = ({ state, dispatch }) => {
    const { categories, articles } = useCategoriesAndArticles()
    const activeCategoryId = state?.activeItemId ?? getActiveItemId()

    const { activePanel, setActivePanel } = useActivePanel()
    const handleSelectPanel = (event) => {
        const selectedPanel = event.target.dataset.panel
        setActivePanel(selectedPanel)
    }

    return html`<style>
            .toggle-posts-category {
                display: inline-flex;
                gap: 0.4rem;
                padding: 0.4rem;
                margin-bottom: 2.4rem;
                border-radius: 999px;
                background: var(--c-surface-2);
                border: 1px solid var(--c-border);
            }
            .toggle-posts-category button.toggle-panel {
                padding: 0.7rem 1.8rem;
                border: 0;
                border-radius: 999px;
                background: transparent;
                color: var(--c-text-muted);
                font-family: var(--font-sans);
                font-size: 1.3rem;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
            }
            .toggle-posts-category button.toggle-panel:hover {
                color: var(--c-text);
            }
            .toggle-posts-category button.toggle-panel.button-active {
                background: var(--c-surface);
                color: var(--c-brand);
                box-shadow: var(--shadow-sm);
            }
            .list.posts-or-categories {
                display: grid;
                gap: 1.6rem;
                width: 100%;
            }
            .list.posts-or-categories.categories-grid {
                grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
            }
            .hide {
                display: none !important;
            }
        </style>
        <div class="toggle-posts-category" role="tablist">
            <button
                role="tab"
                aria-selected=${activePanel === 'posts'}
                class="toggle-panel ${activePanel === 'posts'
                    ? 'button-active'
                    : ''}"
                onClick=${handleSelectPanel}
                data-panel="posts"
            >
                Posts
            </button>
            <button
                role="tab"
                aria-selected=${activePanel === 'categories'}
                class="toggle-panel ${activePanel === 'categories'
                    ? 'button-active'
                    : ''}"
                onClick=${handleSelectPanel}
                data-panel="categories"
            >
                Categories
            </button>
        </div>
        <div
            class="list posts-or-categories ${activePanel === 'posts'
                ? 'blocks-fadein'
                : 'hide'}"
        >
            ${Object.values(articles)
                .filter(
                    (article) =>
                        !activeCategoryId ||
                        article.categoryId === activeCategoryId
                )
                .map(
                    (article) => html`
                        <${ArticleBlock}
                            key=${article.id}
                            article=${article}
                            category=${categories[article.categoryId]}
                        />
                    `
                )}
        </div>
        <div
            class="list posts-or-categories categories-grid ${activePanel === 'categories'
                ? 'blocks-fadein'
                : 'hide'}"
        >
            ${Object.values(categories).map(
                (category) => html`
                    <${CategoryBlock}
                        key=${category.id}
                        category=${category}
                        setActivePanel=${setActivePanel}
                    />
                `
            )}
        </div>
        <${DisqusCount} categories=${categories} /> `
}
