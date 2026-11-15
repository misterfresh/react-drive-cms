import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const About = () => html`
    <style>
        ${infoPageStyles}
    </style>
    <${Page}
        title="Gyrfalcon"
        subtitle=""
        description="Gyrfalcon is a strong and festy predator in the High Arctic. They are also the world's fastest bird. They can fly with an average speed of 50-68 mph. ~Photo: 2023 Gilligallou Bird"
        sidebarImage=${prefixUriIfNeeded('/assets/default-about.jpg')}
        birdId="gyrfalcon"
        showLinks=${true}
    >
        <div class="about-content">
            <div class="info">
                <h1 class="info-title">The Purple Club</h1>
                <img
                    src=${prefixUriIfNeeded('/assets/キョロちゃん.jpg')}
                    class="image"
                    alt="The Purple Club logo"
                />
                <p>
                   Hello! Welcome to The Purple Club. This is my personal blog where I write about things, people and animals that are surrounding my life.
                   I hope that some of my stories would resonate with yours. Feel free to leave a comment in the posts. Thank you for your time and appreciation.
                </p>
                <p class="signature">~Po Tin Mak Monica</p>
                
            </div>
        </div>

        <nav class="page-links">
            <a
                href="${prefixUriIfNeeded('/contact')}"
                class="contact"
                onClick=${avoidReload}
            >
                Contact
            </a>
        </nav>
    <//>
`
