import { html } from '../../../deps/react.js'
import { Link } from '../../../deps/react-router-dom.js'

let Article = ({ article, category }) => html`
    <style>
        article {
            padding: 30px 0;
            display: block;
            border-bottom: solid 1px #f5f5f5;
            width: 100%;
        }
        article .title {
            text-decoration: none;
            color: #333337;
            font-size: 2.4rem;
            margin-top: 0;
            font-family: "Source Sans Pro",Helvetica,Arial,sans-serif;
            font-weight: 700;
            margin-bottom: 10px;
            line-height: 1.1;
            cursor: pointer;
            background-color: transparent;
            border: none;
        }
        article .title:hover {
            color: #b6b6b6;
        }
        article p {
            margin: 0 0 10px;
            font-family: "Droid Serif",serif;
            font-size: 1.6rem;
        }
        article p.description {
             margin-bottom: 30px;
        }
        article p.meta {
             color: #b6b6b6;
        }
        article p.meta .disqus-comment-count {
            margin-right: 0.5rem;
        }
        article .category {
            text-decoration: none;
            cursor: pointer;
            background-color: transparent;
            outline: 0;
            transition: all .4s;
            color: #b6b6b6;
            border-bottom: 1px solid #b6b6b6;
        }
        article .category:hover {
            text-decoration: none;
            cursor: pointer;
            background-color: transparent;
            color: #333337;
            outline: 0;
            transition: all .4s;
            border-bottom: 1px solid #b6b6b6;
        }
        @media (min-width: 992px) {
            article .title { 
                font-size: 3.2rem;
            }
            article p { 
                font-size: 1.8rem,
            }
        }
    </style>
    
    <article>
        <h2>
            <${Link}
                to=${article.uri}
                title=${article.title}
                class="title"
            >
                ${article.title}
            <//>
        </h2>
        <p class="description">
            ${article.subtitle}
        </p>
        <p class="meta">
            <span
                title=${'Comments for ' + article.title}
                data-disqus-url=${window.location.protocol +
                window.location.hostname +
                article.uri}
                data-disqus-identifier=${article.id}
                class="disqus-comment-count"
            />
             - Published in :
            <${Link}
                title=${category.title}
                to=${category.uri}
                class="category"
            >
                ${category.title}
            <//>
        </p>
    </article>
`

export default Article

