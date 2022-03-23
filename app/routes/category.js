import { html, useState } from '../../deps/react.js'
import { Page } from '../components/layout/page.js'
import DisqusCount from '../components/disqus/disqusCount.js'
import { Article as ArticleBlock } from '../components/blocks/article.js'
import { Category as CategoryBlock } from '../components/blocks/category.js'
import resolveAsset from '../utils/resolveAsset.js'
import { getPathParts } from '../utils/path.js'

export const Category = ({ state, dispatch }) => {
    const articles = state.articles
    const categories = state.categories

    const activeCategoryId = getPathParts()?.[1]

    const activePanel = state.activePanel

    const setActivePanel = (event) => {
        const selectedPanel = event.target.dataset.panel
        dispatch({
            type: 'SET_ACTIVE_PANEL',
            selectedPanel,
        })
    }

    const activeCategory = categories?.[activeCategoryId]

    return html` <style>
            .sub-nav {
                border-bottom: solid 1px #f5f5f5;
                line-height: 3rem;
            }
            .button {
                border-bottom: solid 2px #000;
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
            }
            .button:active {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            .button:hover {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            .button:focus {
                outline: 0;
            }
            .button-active: {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            .list {
                animation: fadein 2s;
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                justify-content: space-between;
            }
        </style>
        <${Page}
            title=${activeCategory.title}
            categories=${categories}
            articles=${articles}
            sidebarImage=${activeCategory.image}
        >
            <div class="sub-nav">
                <button
                    class="button ${activePanel === 'posts'
                        ? 'button-active'
                        : ''}"
                    onClick=${setActivePanel}
                    data-panel="posts"
                >
                    Posts
                </button>
                <button
                    class="button ${activePanel === 'categories'
                        ? 'button-active'
                        : ''}"
                    onClick=${setActivePanel}
                    data-panel="categories"
                >
                    Categories
                </button>
            </div>
            <div class="list">
                ${activePanel === 'posts' &&
                Object.values(articles)
                    .filter(
                        (article) => article.categoryId === activeCategoryId
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
                ${activePanel === 'categories' &&
                Object.values(categories).map(
                    (category) => html`
                        <${CategoryBlock}
                            key=${category.id}
                            category=${category}
                        />
                    `
                )}
            </div>
            <${DisqusCount} />
        <//>`
}
