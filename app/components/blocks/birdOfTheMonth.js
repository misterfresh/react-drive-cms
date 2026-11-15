import { html } from '../../lib/htm-preact.js'
import { getBirdOfTheMonth } from '../../data/birds.js'
import { BirdCall } from '../birdCall.js'
import { useCategoriesAndArticles } from '../../hooks/useCategoriesAndArticles.js'
import prefixUriIfNeeded from '../../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../../utils/avoidReload.js'

export const BirdOfTheMonth = () => {
    const bird = getBirdOfTheMonth()
    const { articles } = useCategoriesAndArticles()
    const post = bird.postId ? articles?.[bird.postId] : null
    const photo = bird.photo ? prefixUriIfNeeded(bird.photo) : post?.image
    const month = new Date().toLocaleDateString('en-US', { month: 'long' })

    return html`<section
        class="botm ${photo ? 'has-photo' : ''}"
        aria-labelledby="botm-title"
    >
        <style>
            .botm {
                display: grid;
                grid-template-columns: 1fr;
                margin-bottom: 3.2rem;
                overflow: hidden;
                border: 1px solid var(--c-border);
                border-radius: var(--radius);
                background: var(--c-surface);
                box-shadow: var(--shadow-sm);
            }
            .botm .botm-photo {
                aspect-ratio: 16 / 9;
                background-color: var(--c-surface-2);
                background-position: center;
                background-size: cover;
            }
            .botm .botm-body {
                padding: 2.2rem 2.4rem 2.4rem;
            }
            .botm .label {
                margin: 0 0 0.8rem;
                font-family: var(--font-sans);
                font-size: 1.2rem;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--c-brand);
            }
            .botm h2 {
                margin: 0;
                font-size: 2.6rem;
                font-weight: 600;
            }
            .botm h2 .local {
                margin-left: 0.8rem;
                font-size: 1.8rem;
                font-weight: 400;
                color: var(--c-text-muted);
            }
            .botm .scientific {
                margin: 0.2rem 0 1.4rem;
                font-style: italic;
                color: var(--c-text-muted);
            }
            .botm .fact {
                margin: 0 0 1.8rem;
                font-size: 1.6rem;
                line-height: 1.7;
            }
            .botm .photo-credit {
                margin: 1.6rem 0 0;
                font-family: var(--font-sans);
                font-size: 1.2rem;
                color: var(--c-text-muted);
            }
            .botm .photo-credit a {
                color: inherit;
            }
            .botm .read-more {
                display: inline-block;
                margin-top: 1.4rem;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
            }
        </style>
        ${photo &&
        html`<div
            class="botm-photo"
            style=${{ backgroundImage: `url(${photo})` }}
            role="img"
            aria-label=${bird.name}
        />`}
        <div class="botm-body">
            <p class="label">Bird of the month · ${month}</p>
            <h2 id="botm-title">
                ${bird.name}
                ${bird.nameLocal &&
                html`<span class="local" lang=${bird.nameLang}
                    >${bird.nameLocal}</span
                >`}
            </h2>
            <p class="scientific">${bird.scientific}</p>
            <p class="fact">${bird.fact}</p>
            <${BirdCall} bird=${bird} />
            ${post &&
            html`<a
                class="read-more"
                href=${prefixUriIfNeeded(post.uri)}
                onClick=${avoidReload}
                >Read my post about the ${bird.name} →</a
            >`}
            ${bird.photo &&
            bird.photoCredit &&
            html`<p class="photo-credit">
                <a
                    href=${bird.photoCredit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${bird.photoCredit.text}</a
                >
            </p>`}
        </div>
    </section>`
}
