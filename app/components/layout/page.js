import { html } from '../../lib/htm-preact.js'
import { Menu } from './menu.js'
import { Sidebar } from './sidebar.js'
import { buttonsStyles } from '../../styles/buttons.js'
import { blocksStyles } from '../../styles/blocks.js'
import { MenuBurger } from './menuBurger.js'
import { useCategoriesAndArticles } from '../../hooks/useCategoriesAndArticles.js'
import { usePageMeta } from '../../hooks/usePageMeta.js'
import { useMenuVisible } from '../../hooks/useMenuVisible.js'

export const Page = ({
    title,
    subtitle,
    description,
    sidebarImage,
    showLinks,
    children,
}) => {
    const { categories, articles } = useCategoriesAndArticles()
    const { menuVisible, toggleMenuVisible } = useMenuVisible()

    usePageMeta(title, subtitle)

    return html` <style>
            ${buttonsStyles} ${blocksStyles} .page {
                display: flex;
                width: 100%;
                justify-content: flex-end;
                overflow-x: hidden;
                max-width: 100%;
            }
            main.page-main {
                opacity: 1;
                width: 100%;
                display: block;
                transition: width linear 750ms;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
                max-width: 100%;
            }
            main.page-main.main-narrow {
                margin: 0;
                width: 100%;
            }
            section.page-content {
                padding: 5rem;
                overflow-x: hidden;
                max-width: 100%;
                transition: width linear 750ms;
                width: 100%;
                margin-left: 0;
            }
            section.page-content.content-narrow {
                width: 100%;
                margin-left: 0;
            }
            @media (min-width: 768px) {
                main.page-main {
                    display: block;
                }
                main.page-main.main-narrow {
                    width: 60%;
                    display: block;
                }
                section.page-content {
                    width: 100%;
                }
                section.page-content.content-narrow {
                    width: 100%;
                }
            }
            @media (min-width: 992px) {
                main.page-main {
                    flex-direction: row;
                    display: flex;
                    justify-content: flex-end;
                }
                main.page-main.main-narrow {
                    width: 70%;
                    display: block;
                }
                section.page-content {
                    width: 60%;
                }
                section.page-content.content-narrow {
                    width: 100%;
                }
            }
            @media (min-width: 1200px) {
                main.page-main.main-narrow {
                    width: 75%;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                }
                section.page-content {
                    width: 60%;
                }
                section.page-content.content-narrow {
                    width: 52%;
                }
            }
        </style>
        <div class="wrapper page">
            <${MenuBurger} toggleMenuVisible=${toggleMenuVisible} />
            <${Menu}
                articles=${articles}
                categories=${categories}
                menuVisible=${menuVisible}
            />
            <main
                class="wrapper page-main ${menuVisible
                    ? 'main-narrow'
                    : ''} blocks-fadein"
            >
                <${Sidebar}
                    title=${title}
                    subtitle=${subtitle}
                    description=${description}
                    sidebarImage=${sidebarImage}
                    menuVisible=${menuVisible}
                    showLinks=${showLinks}
                />
                <section
                    class="wrapper page-content ${menuVisible
                        ? 'content-narrow'
                        : ''}"
                >
                    ${children}
                </section>
            </main>
        </div>`
}
