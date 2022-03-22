import { html } from '../../../deps/react.js'

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
                justify-content: flex-start;
                align-items: flex-end;
                transition: width linear 750ms, height linear 750ms,
                    left linear 750ms;
                padding: 0;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                display: flex;
                position: relative;
                width: 100%;
                overflow-x: hidden;
                max-width: 100%;
            }

            .sidebarNarrow {
                padding: 0;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                display: flex;
                width: 100%;
            }

            @media (min-width: 768px) {
                aside.sidebar {
                    height: 45rem;
                    position: relative;
                    width: 100%;
                }

                .sidebar-narrow {
                    height: 45rem;
                    position: relative;
                    width: 100%;
                }
            }

            @media (min-width: 992px) {
                aside.sidebar {
                    height: 100vh;
                    background-color: #f5f5f5;
                    position: fixed;
                    width: 40%;
                    left: 0;
                }

                .sidebar-narrow {
                    height: 45rem;
                    position: relative;
                    width: 100%;
                }
            }

            @media (min-width: 1200px) {
                aside.sidebar {
                    height: 100vh;
                    background-color: #f5f5f5;
                    position: fixed;
                    width: 40%;
                    left: 0;
                }

                .sidebar-narrow {
                    height: 100vh;
                    background-color: #f5f5f5;
                    position: fixed;
                    width: 35%;
                    left: 25%;
                }
            }

            .info {
                padding: 5%;
                background: rgba(50, 50, 50, 0.5);
                color: #fafafa;
                height: 28rem;
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: end;
                flex-direction: column;
            }

            .primary {
                border-bottom: solid 1px rgba(255, 255, 255, 0.3);
                margin-bottom: 1.6rem;
            }

            h1 {
                letter-spacing: 0;
                margin-bottom: 0;
                font-size: 3.4rem;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                font-weight: 700;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
            }

            p: {
                margin-bottom: 1rem;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                line-height: 2.4rem;
                font-size: 1.8rem;
            }

            .links: {
                display: none;
            }

            .show-links: {
                display: flex;
            }

            .button {
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                display: inline-block;
                color: #fff;
                margin-right: 20px;
                margin-bottom: 0;
                background-color: #337ab7;
                font-weight: 400;
                text-align: center;
                touch-action: manipulation;
                cursor: pointer;
                border: 1px solid transparent;
                white-space: nowrap;
                padding: 6px 12px;
                font-size: 14px;
                line-height: 1.42857;
                border-radius: 4px;
                user-select: none;
            }

            .button:hover {
                color: #fff;
                background-color: #286090;
                border-color: #204d74;
                text-decoration: none;
            }

            .button:focus {
                color: #fff;
                background-color: #286090;
                border-color: #122b40;
                text-decoration: none;
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
                        href="https://docs.google.com/folderview?id=0B0A_zASTMp9WU0NMYW9wXzVQWjg&usp=drivesdk"
                        target="_blank"
                    >
                        Original posts on Drive
                    </a>
                    <a
                        class="button"
                        href="https://github.com/misterfresh/react-drive-cms/tree/master"
                        target="_blank"
                    >
                        Source on GitHub
                    </a>
                </div>
            </div>
        </aside>`
}
