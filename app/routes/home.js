import { html, useEffect } from '../../deps/react.js'

import {Page} from '../components/layout/page.js'
import DisqusCount from '../components/disqus/disqusCount.js'
import {Article} from '../components/blocks/article.js'
import {Category} from '../components/blocks/category.js'
import resolveAsset from '../utils/resolveAsset.js'
import {Drive} from "../lib/drive.js";

export const Home = ({state, dispatch}) => {
    const articles = state.articles
    const categories = state.categories
    const activePanel = state.activePanel
    const isFetchingCategories = state?.isFetching?.categories

    const setActivePanel = (event) => {
        const selectedPanel = event.target.dataset.panel
        dispatch({
            type: 'SET_ACTIVE_PANEL',
            selectedPanel
        })
    }

    useEffect(async ()=> {
        if(!isFetchingCategories && !Object.values(categories).length) {
            await Drive.fetchCategories(dispatch)
        }
    }, [categories, dispatch, isFetchingCategories])

    return html`
        <style>
            .sub-nav {
                border-bottom: solid 1px #f5f5f5;
                line-height: 3rem;
            }
            button.toggle-panel {
                display: inline-block;
                font-weight: 700;
                margin-right: 10px;
                font-size: 1.2rem;
                font-family: "Source Sans Pro",Helvetica,Arial,sans-serif;
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
            button.toggle-panel:active {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            button.toggle-panel:hover {
                border-bottom: solid 2px #000;
                color: #333337;
            }
            button.toggle-panel:focus {
                outline: 0;
            }
            .button-active {
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
            .hide {
                position: absolute;
                top: -9999px;
                left: -9999px;
                display: none;
            }
        </style>
        <${Page}
                title="Cats"
                subtitle="React Drive CMS Demo"
                description="Publish articles directly from Google Drive to your website."
                sidebarImage=${resolveAsset('/assets/default-sidebar.jpg')}
                showLinks=${true}
                state=${state}
                dispatch=${dispatch}
            >
                <div class="sub-nav">
                    <button
                        class="toggle-panel ${activePanel === 'posts' ? 'button-active' : ''}"
                        onClick=${setActivePanel}
                        data-panel="posts"
                    >
                        Posts
                    </button>
                    <button
                        class="toggle-panel ${activePanel === 'categories' ? 'button-active' : ''}"
                        onClick=${setActivePanel}
                        data-panel="categories"
                    >
                        Categories
                    </button>
                </div>
                <div
                    class="list ${activePanel === 'posts' ? 'blocks-fadein' : 'hide'}"
                >
                    ${Object.values(articles).map(
        (article) => html`
                            <${Article}
                                key=${article.id}
                                article=${article}
                                category=${categories[article.categoryId]}
                            />
                        `
    )}
                </div>
                <div
                        class="list ${activePanel === 'categories' ? 'blocks-fadein' : 'hide'}"
                >
                    ${Object.values(categories).map(
        (category) => html`
                            <${Category}
                                key=${category.id}
                                category=${category}
                            />
                        `
    )}
                </div>
                <${DisqusCount} />
            <//>`
}

