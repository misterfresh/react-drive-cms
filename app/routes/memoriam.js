import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const Memoriam = () => html`
    <style>
        ${infoPageStyles}
        .about-content .tribute-link {
            float: left;
            margin: 0.6rem 3.2rem 2rem 0;
        }
        .about-content .tribute-link img.image {
            float: none;
            display: block;
            width: 22rem;
            margin: 0;
        }
        @media (max-width: 560px) {
            .about-content .tribute-link {
                float: none;
                display: block;
                margin: 0 0 2rem;
            }
        }
    </style>
    <${Page}
        title="Bald Eagle"
        subtitle="Bald Eagle is the national symbol of the United States of America."
        description="The fierce beauty and proud
        independence of this great bird aptly symbolizes the strength and freedom
        of America. -John F. Kennedy"
        sidebarImage=${prefixUriIfNeeded('/assets/bald_eagle.jpg')}
        showLinks=${true}
    >
        <div class="about-content">
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
            <div class="info">
                <h1 class="info-title">James Edward Parker</h1>
                
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
