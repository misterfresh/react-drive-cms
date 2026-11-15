import { html } from '../../lib/htm-preact.js'

export const Sidebar = ({
    title,
    subtitle,
    description,
    sidebarImage,
    menuVisible,
    showLinks,
}) => {
    return html` <style>
            aside.sidebar {
                position: relative;
                display: flex;
                align-items: flex-end;
                justify-content: flex-start;
                width: 100%;
                max-width: 100%;
                min-height: 38rem;
                padding: 0;
                overflow: hidden;
                background-color: var(--c-menu-bg);
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                transition: width 320ms var(--ease), left 320ms var(--ease);
            }

            @media (min-width: 768px) {
                aside.sidebar,
                aside.sidebar.sidebar-narrow {
                    height: 48rem;
                    position: relative;
                    width: 100%;
                }
            }

            @media (min-width: 992px) {
                aside.sidebar {
                    position: fixed;
                    left: 0;
                    width: 40%;
                    height: 100vh;
                }
                aside.sidebar.sidebar-narrow {
                    position: relative;
                    left: auto;
                    width: 100%;
                    height: 48rem;
                }
            }

            @media (min-width: 1200px) {
                aside.sidebar.sidebar-narrow {
                    position: fixed;
                    left: 25%;
                    width: 35%;
                    height: 100vh;
                }
            }

            aside.sidebar .info {
                width: 100%;
                padding: 12rem clamp(2.4rem, 5%, 5rem) clamp(2.4rem, 5%, 4.8rem);
                background: var(--c-scrim);
                color: #fff;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }

            aside.sidebar .primary h1 {
                margin: 0 0 1.2rem;
                color: #fff;
                font-family: var(--font-serif);
                font-size: clamp(3rem, 2.4rem + 1.8vw, 4.6rem);
                font-weight: 600;
                line-height: 1.15;
                letter-spacing: -0.01em;
                text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
                text-wrap: balance;
            }

            aside.sidebar .primary p {
                margin: 0 0 1rem;
                max-width: 52ch;
                color: rgba(255, 255, 255, 0.88);
                font-size: 1.5rem;
                line-height: 1.65;
                text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
            }
            aside.sidebar .primary p:empty {
                display: none;
            }

            aside.sidebar .links {
                display: none;
            }

            aside.sidebar .links.show-links {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 1.6rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }

            aside.sidebar .links a.button {
                display: inline-flex;
                align-items: center;
                gap: 0.8rem;
                padding: 0.8rem 1.6rem;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 999px;
                background-color: rgba(255, 255, 255, 0.12);
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);
                color: #fff;
                font-family: var(--font-sans);
                font-size: 1.35rem;
                font-weight: 500;
                white-space: nowrap;
                transition: background-color var(--dur) var(--ease),
                    border-color var(--dur) var(--ease);
            }

            aside.sidebar .links a.button:hover,
            aside.sidebar .links a.button:focus-visible {
                color: #fff;
                background-color: rgba(255, 255, 255, 0.24);
                border-color: rgba(255, 255, 255, 0.5);
            }
        </style>
        <aside
            class="sidebar ${menuVisible ? 'sidebar-narrow' : ''}"
            style=${{ backgroundImage: `url(${sidebarImage})` }}
        >
            <div class="info">
                <div class="primary">
                    <h1>${title}</h1>
                    <p>${subtitle}</p>
                    <p>${description}</p>
                </div>
                <div class="links ${showLinks ? 'show-links' : ''}">
                    <a
                        class="button"
                        href="https://drive.google.com/drive/folders/0B0A_zASTMp9WU0NMYW9wXzVQWjg?resourcekey=0-k6M28TIgKjp_9hvDeT623Q&usp=sharing"
                        target="_blank"
                        rel="noopener"
                    >
                        <i class="fa-brands fa-google-drive" aria-hidden="true" />
                        Original posts on Drive
                    </a>
                    <a
                        class="button"
                        href="https://github.com/potinmak/birds"
                        target="_blank"
                        rel="noopener"
                    >
                        <i class="fa-brands fa-github" aria-hidden="true" />
                        Source on GitHub
                    </a>
                </div>
            </div>
        </aside>`
}
