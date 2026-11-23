import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const Memoriam = () => html`
    <style>
        ${infoPageStyles}
        /* Photo, then the name, then the memorial text. Nothing floats beside the picture. */
        .about-content .tribute {
            float: none;
            display: block;
            clear: both;
            width: 22rem;
            max-width: 100%;
            margin: 0 0 2rem;
            container-type: inline-size;
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
        .about-content .tribute figcaption {
            display: block;
            width: 100%;
            margin: 0;
            padding: 0;
        }
        .about-content .tribute-name {
            display: block;
            width: 100%;
            margin: 0.8rem 0 0;
            padding: 0;
            font-family: var(--font-serif);
            font-size: 1.7rem;
            font-size: min(1.7rem, 8.5cqi);
            font-weight: 600;
            line-height: 1.3;
            letter-spacing: 0;
            text-align: left;
            white-space: nowrap;
            color: var(--c-text);
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
        showLinks=${true}
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
                <figcaption>
                    <h1 class="tribute-name">James Edward Parker</h1>
                </figcaption>
            </figure>
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
