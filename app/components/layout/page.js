import { html, useState, useEffect } from '../../../deps/react.js'
import { Menu } from './menu.js'
import { Sidebar } from './sidebar.js'
import blocks from '../../styles/blocks.js'
import { fetchCategoriesIfNeeded } from '../../modules/category/actionCreators.js'

export const Page = ({
    title,
    subtitle,
    description,
    sidebarImage,
    showLinks,
    children,
}) => {
    const [menuVisible, setMenuVisible] = useState(
        !(typeof window !== 'undefined' && window.innerWidth < 769)
    )

    const toggleMenuVisible = () => {
        setMenuVisible(!menuVisible)
    }

    useEffect(async () => {
        await fetchCategoriesIfNeeded()
    }, [])
    useEffect(() => {
        document.title = title
            ? `${title} - React Drive CMS`
            : 'React Drive CMS'
    }, [title])
    useEffect(() => {
        document
            .querySelector('meta[name="description"]')
            .setAttribute('content', subtitle)
    }, [subtitle])
    return html` <style>
            .page {
                display: flex;
                width: 100%;
                justify-content: flex-end;
                overflow-x: hidden;
                max-width: 100%;
            }
            .main {
                opacity: 1;
                width: 100%;
                display: block;
                transition: width linear 750ms;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
                max-width: 100%;
            }
            .main-narrow {
                margin: 0;
                width: 100%;
            }
            .content {
                padding: 5rem;
                overflow-x: hidden;
                max-width: 100%;
                transition: width linear 750ms;
                width: 100%;
                margin-left: 0;
            }
            .content-narrow {
                width: 100%;
                margin-left: 0;
            }
            @media (min-width: 768px) : {
                .main {
                    display: block;
                }
                .main-narrow {
                    width: 60%;
                    display: block;
                }
                .content {
                    width: 100%;
                }
                .content-narrow {
                    width: 100%;
                }
            }
            @media (min-width: 992px) : {
                .main {
                    flex-direction: row;
                    display: flex;
                    justify-content: flex-end;
                }
                .main-narrow {
                    width: 70%;
                    display: block;
                }
                .content {
                    width: 60%;
                }
                .content-narrow {
                    width: 100%;
                }
            }
            @media (min-width: 1200px) : {
                .main-narrow {
                    width: 75%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
                .content {
                    width: 60%;
                }
                .content-narrow {
                    width: 52%;
                }
            }
            .menu-burger {
                position: fixed;
                top: 1.5rem;
                left: 1.5rem;
                z-index: 15;
                border-radius: 5;
                height: 4rem;
                width: 4rem;
                background: #333;
                padding-top: 8;
                cursor: pointer;
                border-bottom: 0 transparent;
                box-shadow: #948b8b 2px 2px 10px;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                outline: 0;
                border: 0;
            }
            .menu-burger:hover {
                color: #fff;
                outline: 0;
                background: #999;
            }
            .menu-burger:focus {
                outline: 0;
            }
            .bar {
                height: 0.5rem;
                width: 2.8rem;
                display: block;
                margin: 0 6px 5px;
                background: #fff;
                border-radius: 0.3rem;
            }
        </style>
        <div class="blocks-wrapper page">
            <button class="menu-burger" onClick=${toggleMenuVisible}>
                <div class="bar" />
                <div class="bar" />
                <div class="bar" />
            </button>
            <${Menu} menuVisible=${menuVisible} />
            <main
                class="main ${menuVisible ? 'main-narrow' : ''}"
                style="{{"
                ...blocks.wrapper,
                ...blocks.fadein,
                }}
            >
                <${Sidebar}
                    title=${title}
                    subtitle=${subtitle}
                    description=${description}
                    sidebarImage=${sidebarImage}
                    menuVisible=${menuVisible}
                    showLinks=${showLinks}
                />
                <section class="content ${menuVisible ? 'content-narrow' : ''}">
                    ${children}
                </section>
            </main>
        </div>`
}
