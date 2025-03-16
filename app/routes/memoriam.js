import { html } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

export const Memoriam = () => html`
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Joan&family=Noto+Sans+JP:wght@100;400&family=Noto+Serif+JP:wght@200;400;500&family=Playfair+Display&display=swap');
        .about-content {
            display: block;
        }

       .about-content img.image {
            text-align: center;
            display: block;
            border: 0;
            max-height: 130%;
            max-width: 130%;
            vertical-align: middle;
            float: left;
            
            margin-right: 5rem;
            margin-bottom: 2rem;
            
        }

        .info-year {
            margin: 30px 0 20px;
            font-size: 2rem;
            font-family: 'Noto Serif JP', serif; /**************adding font family attributes***********/
        }

        .info-title {
            margin: 30px 0 20px;
            font-size: 3.8rem;
            font-weight: 700;
            line-height: 1.1;
            font-family: 'Noto Serif JP', serif; /**************adding font family attributes***********/
        }

        .info p {
            font-size: 2rem;
            margin: 0 0 30px;
            font-family: 'Noto Serif JP', serif; /**************adding font family attributes***********/
            font-weight: 200; /**********************added font weight***********************************/
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
        title="Bald Eagle"
        subtitle="Bald Eagle is the national symbol of the United States of America."
        description="The fierce beauty and proud
        independence of this great bird aptly symbolizes the strength and freedom
        of America. -John F. Kennedy"
        sidebarImage=${prefixUriIfNeeded('/assets/bald_eagle.jpg')}
        showLinks=${true}
    >
        <div class="about-content">
            <a href="https://willwerscheid.com/tribute/details/267398/James-Parker/obituary.html#tribute-start" target="_blank">
                <img
                    src=${prefixUriIfNeeded('/assets/JamesParker.jpg')}
                    class="image"
                />
            </a>
            <div class="info">
                <h1 class="info-title">James Edward Parker</h1>
                
                <p> 
                    This site is built in memory of my mentor and friend, James Edward Parker.
                    
                </p>
         
                <p class="info-year"><i> November 7th 1984 - January 20th 2022 </i> </p>
            </div>
        </div>

        <footer>
            <a
                href="${prefixUriIfNeeded('/home')}"
                class="memoriam"
                onClick=${avoidReload}
            >
                Home
            </a>
        </footer>
    <//>
`
