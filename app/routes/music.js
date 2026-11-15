import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

export const Music = () => html`
    <style>
        ${infoPageStyles}
        .about-content .playlist {
            margin-top: 3.2rem;
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: var(--shadow-md);
        }
        .about-content .playlist iframe {
            display: block;
        }
    </style>
    <${Page}
        title="Prince Rogers Nelson"
        subtitle="The most prolific singer-songwriter and multi-instrumentalist in the world"
        description="Born and raised in Minneapolis, US, The Purple One is a pioneer of Minneapolis sound, and always has an exceptional work ethnic and passion for music craftmanship."
        sidebarImage=${prefixUriIfNeeded('/assets/prince.jpeg')}
        showLinks=${true}
    >
        <div class="about-content">
            
            <div class="info">
                <h1 class="info-title"> My Musical Inspiration</h1>
                 <p>
                    Prince has been my greatest musical inspiration of all time since I was a little child. 
                    I remember I had a chance of attending his packed show at Harbor Fest beside Victoria Harbor, Hong Kong, back in October 2003. 
                    The performance was phenomenal. I loved it even though I did not quite understand the lyrics as a kid at that time.
                    Prince is the pioneer of Minneapolis sound. I love all of his music.
                    The Purple One has always been the greatest music icon on this planet. 
                    His music and legacy will live on forever.
                    This Spotify playlist also includes songs of other musicians as those are also my favorites. 
                    Enjoy!
                </p>
                <p><i> "Ego is one thing, money is one thing, but reverence for life and service to others is the key to getting off this planet." </i>~Prince Rogers Nelson</p> 
                
            <div class="playlist">
                <iframe src="https://open.spotify.com/embed/playlist/05wPNnG9hlNl5hRM6u2jEo?utm_source=generator" width="100%" height="500" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
            </div>
            
           </div>
        </div>
        <nav class="page-links">
            <a
                href="${prefixUriIfNeeded('/')}"
                class="home"
                onClick=${avoidReload}
            >
                Home
            </a>
        </nav>
    <//>
`
