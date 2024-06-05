import { html, useEffect, useState } from '../../lib/htm-preact.js'
import { avoidReload } from '../../utils/avoidReload.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'

export const Menu = ({ categories, articles, menuVisible }) => {
    const [activeCategory, setActiveCategory] = useState(false)
    const toggleCategory = (event) => {
        const category = event.target.dataset.category
        setActiveCategory(category !== activeCategory ? category : false)
    }
    useEffect(() => {
        setActiveCategory(Object.values(categories)?.[0]?.id)
    }, [categories])
    return html` <style>
    @import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Joan&family=Noto+Sans+JP:wght@100;400&family=Noto+Serif+JP:wght@200;400;500&family=Playfair+Display&display=swap');
            .menu {
                background-color: #810541; /**************************orange menu#f06236*************************/
                overflow: hidden;
                z-index: 10;
                display: block;
                top: 0;
                left: 0;
                height: 100%;
                box-shadow: #000 2px 2px 10px;
                padding-top: 5rem;
                transition: opacity linear 1000ms, width linear 1000ms; /******************changed speed******************/
                width: 0;
                opacity: 0;
                padding-right: 0;
                position: fixed;
                overflow: auto;
            }
            .menu-open {
                opacity: 1;
                width: 100%;
            }
            @media (min-width: 768px) {
                .menu-open {
                    width: 40%;
                }
            }
            @media (min-width: 992px) {
                .menu-open {
                    width: 30%;
                }
            }
            @media (min-width: 1200px) {
                .menu-open {
                    width: 25%;
                }
            }

            .icon {
                padding: 0 20px;
                font-size: 1.6rem;
                color: #fff; /**********************changed bg color**************************/
                transition: all 1s ease-in-out; /*******************changed transition*******************/
            }
            
            .icon:hover {
                color: #6236f0; /**************changed icon color when hovered****************/
                transition: all 1s ease-in-out; /**************changed transition****************/
            }
            .menu ul.menu-list {
                padding: 10px 0;
                font-size: 1.6rem;
                margin-bottom: 20px;
                margin-top: 0px;
                list-style-type: none;
            }
            .item {
                margin: 0;
                list-style: none;
                padding: 10px 0;
                font-size: 1.6rem;
                transition: all 1s ease-in-out; /************added transition when hovered**************/
            }
            .item:hover {
                color: #0036fd; /************************changed icon color to navy when hovered*************/
                outline: 0; /***************added outline******************/
                transition: all 1s ease-in-out; /************added transition when hovered************/
            }
            .item:focus {
                outline: 0; /***********re-focus************/
            }
            .item-link {
                color: #fff; /************changed bg color**********************/
                font-weight: 500;
                font-size: large;
                border-bottom: 0 transparent;
                background-color: transparent;
                outline: 0;
                border: 0;
                cursor: pointer;
                font-family: Arial;
                transition: all 1s ease-in-out;  /*************added Fade in effect***************/
            }
            .item-link:hover {
                color: #0036fd; /***********************changed bg color to blue*************/
                outline: 0;
                transform: scale(1.2); /*************text would be larger when hovered*************/
            }
            .item-link:focus {
                outline: 0;
            }
            .separator {
                margin: 20px auto;
                display: block;
                border: 1px solid #fff; /*************changed color************/
                height: 0;
                width: 50%;  /*******************changed width***************/
            }
            .sub-list {
                margin-left: 15px;
                position: relative;
                padding: 10px 0;
                margin-bottom: 0;
                font-size: 1.6rem;
                margin-top: 0;
            }
            .sub-item {
                padding: 0;
                height: 0;
                overflow: hidden;
                opacity: 0.1;
                position: relative;
                font-size: small;
                margin: 0;
                list-style: none;
                transition: opacity ease 750ms, height linear 750ms;
            }
            .sub-item-expanded {
                opacity: 1;
                height: 4.5rem;
                transition: opacity ease 750ms, height linear 750ms;
            }
            .sub-item-link {
                font-size: medium;
                position: relative;
                color: #dadada;
                font-weight: 100; /***************************changed font weight***************/
                border-bottom: 0 transparent;
                text-decoration: none;
                background-color: transparent;
                font-style: normal;
                top: 10px;
                font-family: 'Noto Sans JP', sans-serif;/***************************changed font style***********************/
            }
            /***************************changed underline hover effect********************************/
            .sub-item-link::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 1px;
                border-radius: 1px;
                background-color: #00ccff;
                bottom: 0;
                left: 0;
                transform-origin: right;
                transform: scaleX(0);
                transition: transform .3s ease-in-out;
            }
            .sub-item-link:hover::before {
                transform-origin: left;
                transform: scaleX(1);
              }
            /************************************************************************************************/
            .sub-item-link:hover {
                border-bottom: none;
                color: #00ccff; /************************/
            }
        </style>
        <nav id="menu" class="menu ${menuVisible ? 'menu-open' : ''}">
            <ul class="menu-list">
                <li class="item">
                    <i class="fas fa-home icon" />
                    <a
                        href="${prefixUriIfNeeded('/')}"
                        title="Home"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                        Home
                    </a>
                </li>
                <li class="item">
                    <i class="fas fa-kiwi-bird icon" />
             
                    <a
                        href="${prefixUriIfNeeded('/about')}"
                        title="About"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                        About
                    </a>
                </li>
                <li class="item">
                    <i class="fas fa-robot icon" />
                    <a
                        href="${prefixUriIfNeeded('/japanese')}"
                        title="日本語"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                        日本語
                    </a>
                </li>
                 <li class="item">
                    <i class="fas fa-ship icon" />
                    <a
                        href="${prefixUriIfNeeded('/chinese')}"
                        title="繁體中文"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                    繁體中文
                    </a>
                </li>
                <!--
                <li class="item">
                    <i class="fas fa-music icon" />
                    <a
                        href="${prefixUriIfNeeded('/music')}"
                        title="Inspire"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                        Inspiration
                    </a>
                </li>
                -->
                <li class="item">
                    <i class="fas fa-feather-alt icon" />
                    <a
                        href="${prefixUriIfNeeded('/contact')}"
                        title="Contact"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                        Contact
                    </a>
                </li>
                 <li class="item">
                    <i class="fas fa-monument icon" />
                    <a
                        href="${prefixUriIfNeeded('/memoriam')}"
                        title="Memoriam"
                        class="item-link"
                        onClick=${avoidReload}
                    >
                        In Memoriam
                    </a>
                </li>
            
            </ul>
            <hr class="separator" />
            <ul class="menu-list">
                ${Object.values(categories).map(
                    (category, index) => html`
                        <li key=${category.id}>
                            <i class="fas fa-angle-right icon" />
                            <button
                                title=${category.title}
                                onClick=${toggleCategory}
                                class="item-link"
                                data-category=${category.id}
                            >
                                ${category.title}
                            </button>

                            <ul class="sub-list">
                                ${Object.values(articles)
                                    .filter(
                                        (article) =>
                                            article.categoryId === category.id
                                    )
                                    .map(
                                        (article) => html`
                                            <li
                                                key=${article.id}
                                                class="sub-item ${category.id ===
                                                activeCategory
                                                    ? 'sub-item-expanded'
                                                    : ''}"
                                            >
                                                <a
                                                    key=${article.id}
                                                    title=${article.title}
                                                    href="${prefixUriIfNeeded(
                                                        article.uri
                                                    )}"
                                                    class="sub-item-link"
                                                    onClick=${avoidReload}
                                                >
                                                    ${article.title}
                                                </a>
                                            </li>
                                        `
                                    )}
                            </ul>
                        </li>
                    `
                )}
            </ul>
        </nav>`
}
