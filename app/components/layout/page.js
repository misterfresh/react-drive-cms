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
    lang,
    birdId,
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
                font-family: var(--font-serif);
            }
            main.page-main {
                width: 100%;
                display: block;
                transition: width 320ms var(--ease);
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
                padding: clamp(3rem, 5vw, 6rem) clamp(2rem, 5vw, 6rem);
                overflow-x: hidden;
                max-width: 100%;
                width: 100%;
                margin-left: 0;
                transition: width 320ms var(--ease);
            }
            section.page-content.content-narrow {
                width: 100%;
                margin-left: 0;
            }
            @media (min-width: 768px) {
                main.page-main.main-narrow {
                    width: 60%;
                }
            }
            @media (min-width: 992px) {
                main.page-main {
                    display: flex;
                    flex-direction: row;
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
                section.page-content.content-narrow {
                    width: 52%;
                }
            }
        </style>
        <div class="wrapper page" lang=${lang}>
            <${MenuBurger}
                toggleMenuVisible=${toggleMenuVisible}
                menuVisible=${menuVisible}
            />
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
                    birdId=${birdId}
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
