import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

export const About = () => html`
    <style>
    /*************************************adding font family imports***********************************/
    @import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Joan&family=Noto+Sans+JP&family=Noto+Serif+JP:wght@200;400;500&family=Playfair+Display&display=swap');
        .about-content {
            display: block;
        }

        .about-content img.image {
            border-radius: 0%;
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
            font-family: 'Noto Serif JP', serif;/**************adding font family attributes***********/
        }

        .info p {
            font-size: 2rem;
            margin: 0 0 30px;
            font-family: 'Noto Serif JP', serif; /**************adding font family attributes***********/
            font-weight: 100; /**************adding font weight********************/
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
        title="Gyrfalcon"
        subtitle=""
        description="Gyrfalcon is a strong and festy predator in the High Arctic. They are also the world's fastest bird. They can fly with an average speed of 50-68 mph. ~Photo: 2023 Gilligallou Bird"
        sidebarImage=${prefixUriIfNeeded('/assets/default-about.jpg')}
        showLinks=${true}
    >
        <div class="about-content">
            <div class="info">
                <h1 class="info-title">The Purple Club</h1>
                <img
                src=${prefixUriIfNeeded('/assets/キョロちゃん.jpg')}
                class="image"
            />
                <p>
                   Hello! Welcome to The Purple Club. This is my personal blog where I write about things, people and animals that are surrounding my life.
                   I hope that some of my stories would resonate with yours. Feel free to leave a comment in the posts. Thank you for your time and appreciation.
                </p>
                <p style="text-align: left;"> <i>~Po Tin Mak Elly</i></p>
                
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
