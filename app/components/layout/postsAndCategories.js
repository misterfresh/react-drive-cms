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
                border-bottom: solid 1px #f5f5f5;
                line-height: 3rem;
            }
            .toggle-posts-category button.toggle-panel {
                display: inline-block;
                font-weight: 700;
                margin-right: 10px;
                font-size: 1.2rem;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                text-transform: uppercase;
                cursor: pointer;
                background-color: transparent;
                outline: 0;
                line-height: 30px;
                letter-spacing: 2pt;
                text-decoration: none;
                color: #b6b6b6;
                border: none;
                border-bottom: solid 2px transparent;
            }
            .toggle-posts-category button.toggle-panel:active {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            .toggle-posts-category button.toggle-panel:hover {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            .toggle-posts-category button.toggle-panel:focus {
                outline: 0;
            }
            .toggle-posts-category button.toggle-panel.button-active {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            .list.posts-or-categories {
                animation: fadein 2s;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                justify-content: space-between;
            }
            .hide {
                position: absolute;
                top: -9999px;
                left: -9999px;
                display: none;
            }
        </style>
        <div class="toggle-posts-category">
            <button
                class="toggle-panel ${activePanel === 'posts'
                    ? 'button-active'
                    : ''}"
                onClick=${handleSelectPanel}
                data-panel="posts"
            >
                Posts
            </button>
            <button
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
            class="list posts-or-categories  ${activePanel === 'categories'
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
