import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

export const About = () => html`
    <style>
        .about-content {
            display: block;
        }

        .about-content img.image {
            border-radius: 50%;
            width: 150px;
            border: 0;
            max-width: 100%;
            vertical-align: middle;
            float: left;
            margin-right: 2rem;
        }

        .info-title {
            margin: 30px 0 20px;
            font-size: 3.8rem;
            font-weight: 700;
            line-height: 1.1;
            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
        }

        .info p {
            font-size: 2rem;
            margin: 0 0 30px;
        }

        footer {
            padding: 10px 0;
            font-size: 1.4rem;
            letter-spacing: 1px;
            font-weight: 700;
            font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
            text-transform: uppercase;
        }

        footer a.contact {
            text-decoration: none;
            background-color: transparent;
            color: #999;
            border-bottom: none;
            font-size: 1.4rem;
        }

        footer a.contact:hover {
            text-decoration: none;
            background-color: transparent;
            color: #333;
            outline: 0;
            transition: all 0.4s;
            border-bottom: none;
        }
    </style>
    <${Page}
        title="About"
        subtitle="React Drive CMS Demo"
        description="An easy way to publish articles directly from Google Drive"
        sidebarImage=${prefixUriIfNeeded('/assets/default-about.jpg')}
        showLinks=${true}
    >
        <div class="about-content">
            <img
                src=${prefixUriIfNeeded('/assets/react_logo.png')}
                class="image"
            />
            <div class="info">
                <h1 class="info-title">React Drive CMS Demo</h1>
                <p>
                    A demo site to showcase the use of Google Drive as a Content
                    Management System. Write articles in Google Docs and publish
                    them directly from there.
                </p>
                <p>
                    Google Drive is the backend, only a few static files are
                    hosted on GitHub Pages, and the content is displayed with
                    React JS.
                </p>
            </div>
        </div>

        <footer>
            <a
                href="${prefixUriIfNeeded('/contact')}"
                class="contact"
                onClick=${avoidReload}
            >
                Contact
            </a>
        </footer>
    <//>
`
