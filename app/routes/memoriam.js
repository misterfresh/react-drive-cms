import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const Memoriam = () => html`
    <style>
        ${infoPageStyles}
        /* Photo, then the name (same size as other page headlines), then the text. */
        .about-content .tribute {
            float: none;
            display: block;
            clear: both;
            width: 22rem;
            max-width: 100%;
            margin: 0 0 2rem;
        }
        .about-content .tribute-link {
            display: block;
            float: none;
            margin: 0;
        }
        .about-content .tribute-link img.image {
            float: none;
            display: block;
            width: 100%;
            max-width: 100%;
            height: auto;
            margin: 0;
        }
        .about-content .tribute-name {
            margin: 0 0 1.6rem;
        }
        .about-content .info {
            display: block;
            clear: both;
            float: none;
        }
    </style>
    <${Page}
        title="Bald Eagle"
        subtitle="Bald Eagle is the national symbol of the United States of America."
        description="The fierce beauty and proud
        independence of this great bird aptly symbolizes the strength and freedom
        of America. -John F. Kennedy"
        sidebarImage=${prefixUriIfNeeded('/assets/bald_eagle.jpg')}
        birdId="bald-eagle"
    >
        <div class="about-content">
            <figure class="tribute">
                <a
                    class="tribute-link"
                    href="https://willwerscheid.com/tribute/details/267398/James-Parker/obituary.html#tribute-start"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        src=${prefixUriIfNeeded('/assets/JamesParker.jpg')}
                        class="image"
                        alt="James Edward Parker"
                    />
                </a>
            </figure>
            <h1 class="info-title tribute-name">James Edward Parker</h1>
            <div class="info">
                <p>
                    This site is built in memory of my mentor and friend, James Edward Parker.
                </p>

                <p class="info-year">November 7th 1984 – January 20th 2022</p>
            </div>
        </div>

        <nav class="page-links">
            <a
                href="${prefixUriIfNeeded('/')}"
                class="memoriam"
                onClick=${avoidReload}
            >
                Home
            </a>
        </nav>
    <//>
`
