import { html, useEffect, useState } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import { BirdCall } from '../components/birdCall.js'
import { birds } from '../data/birds.js'
import { useCategoriesAndArticles } from '../hooks/useCategoriesAndArticles.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

// Bird quiz with three modes, built from app/data/birds.js:
//   calls  - play a call, guess the bird (birds with a call)
//   photos - look at a photo, guess the bird (birds with a photo, or a post
//            whose header photo can be used)
//   mix    - each question is a call or a photo, at random
// Every eligible bird becomes one question, in random order, with 4 choices.
// Add a bird to birds.js and it joins the quiz automatically.
const CHOICES = 4
const BEST_KEY = 'quiz-best'

const MODES = {
    calls: {
        label: 'Calls',
        icon: 'fa-headphones',
        heading: 'Guess the bird call',
        intro: (total) =>
            `Play each mystery call, then pick the bird you think is singing. There are ${total} birds from this blog to guess.`,
        share: 'bird call quiz',
    },
    photos: {
        label: 'Photos',
        icon: 'fa-camera',
        heading: 'Name that bird',
        intro: (total) =>
            `Look at each photo and pick the bird you think it is. There are ${total} birds from this blog to guess.`,
        share: 'bird photo quiz',
    },
    mix: {
        label: 'Mix',
        icon: 'fa-shuffle',
        heading: 'Calls and photos',
        intro: (total) =>
            `A bit of both: some questions are a call to listen to, others a photo to look at. There are ${total} birds from this blog to guess.`,
        share: 'bird quiz',
    },
}

const shuffle = (list) => {
    const copy = [...list]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

const pickOne = (list) => list[Math.floor(Math.random() * list.length)]

// kinds: which question types this bird can be asked as, in this mode
const kindsFor = (bird, mode, photoOf) => {
    const kinds = []
    if (mode !== 'photos' && bird.call) kinds.push('call')
    if (mode !== 'calls' && photoOf(bird)) kinds.push('photo')
    return kinds
}

const makeRounds = (mode, photoOf) => {
    const pool = birds.filter((bird) => kindsFor(bird, mode, photoOf).length)
    return shuffle(pool).map((bird) => ({
        bird,
        kind: pickOne(kindsFor(bird, mode, photoOf)),
        options: shuffle([
            bird,
            ...shuffle(pool.filter((other) => other.id !== bird.id)).slice(
                0,
                CHOICES - 1
            ),
        ]),
    }))
}

const verdict = (score, total, mode) => {
    const ratio = total ? score / total : 0
    if (ratio === 1)
        return mode === 'photos'
            ? 'Perfect score! You have the eyes of a hawk.'
            : 'Perfect score! You have the ears of an owl.'
    if (ratio >= 0.75) return 'Excellent! You really know your birds.'
    if (ratio >= 0.5) return 'Nicely done! A few more walks in the park and you’ll ace it.'
    if (mode === 'calls')
        return 'Bird calls are tricky! Have another listen and try again.'
    return mode === 'photos'
        ? 'Some birds look a lot alike! Have another look and try again.'
        : 'Birds are tricky! Have another go and try again.'
}

// Best scores live in this browser only: { calls: { score, total }, ... }
const readBest = () => {
    try {
        return JSON.parse(localStorage.getItem(BEST_KEY)) || {}
    } catch (e) {
        return {}
    }
}

const saveBest = (best) => {
    try {
        localStorage.setItem(BEST_KEY, JSON.stringify(best))
    } catch (e) {
        // Storage blocked (e.g. private mode): best scores last for this visit.
    }
}

export const Quiz = () => {
    const { articles } = useCategoriesAndArticles()

    const photoOf = (bird) => {
        if (bird.photo) return prefixUriIfNeeded(bird.photo)
        const post = bird.postId ? articles?.[bird.postId] : null
        return post?.image ?? ''
    }

    const [mode, setMode] = useState('calls')
    const [rounds, setRounds] = useState(() => makeRounds('calls', photoOf))
    const [index, setIndex] = useState(0)
    const [picked, setPicked] = useState(null)
    const [score, setScore] = useState(0)
    const [shareNote, setShareNote] = useState('')
    const [best, setBest] = useState(readBest)
    const [newBest, setNewBest] = useState(false)

    const total = rounds.length
    const done = total > 0 && index >= total
    const round = rounds[index]
    const answered = picked !== null
    const modeInfo = MODES[mode]
    const bestHere = best[mode]

    // Post photos arrive with the articles. If they land before the first
    // answer, rebuild the photo questions so those birds are included too.
    useEffect(() => {
        if (mode !== 'calls' && index === 0 && picked === null) {
            setRounds(makeRounds(mode, photoOf))
        }
    }, [articles])

    // Record a new best score when a round of the quiz is finished.
    useEffect(() => {
        if (!done) return
        const previous = best[mode]
        const beats =
            !previous ||
            score / total > previous.score / previous.total ||
            (score / total === previous.score / previous.total &&
                score > previous.score)
        if (beats) {
            const updated = { ...best, [mode]: { score, total } }
            setBest(updated)
            saveBest(updated)
        }
        setNewBest(beats && score > 0)
    }, [done])

    const pick = (bird) => {
        if (answered) return
        setPicked(bird.id)
        if (bird.id === round.bird.id) setScore((value) => value + 1)
    }

    const next = () => {
        setPicked(null)
        setIndex((value) => value + 1)
    }

    const start = (nextMode) => {
        setMode(nextMode)
        setRounds(makeRounds(nextMode, photoOf))
        setIndex(0)
        setPicked(null)
        setScore(0)
        setShareNote('')
        setNewBest(false)
    }

    const restart = () => start(mode)

    const share = async () => {
        const url = prefixUriIfNeeded('/quiz')
        const text = `I got ${score}/${total} on The Purple Club's ${modeInfo.share}. Can you beat me?`
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Bird quiz', text, url })
                return
            }
            await navigator.clipboard.writeText(`${text} ${url}`)
            setShareNote('Copied! Paste it to a friend.')
        } catch (error) {
            if (error?.name !== 'AbortError') {
                setShareNote('Could not share. Copy the address bar instead.')
            }
        }
    }

    const reveal = () => {
        const bird = round.bird
        const correct = picked === bird.id
        const post = bird.postId ? articles?.[bird.postId] : null
        // A photo question already showed the photo, so don't repeat it.
        const photo = round.kind === 'photo' ? '' : photoOf(bird)
        const credit = bird.photo && bird.photoCredit
        return html`<div class="quiz-reveal" key=${bird.id}>
            <p
                class="quiz-result ${correct ? 'is-right' : 'is-wrong'}"
                role="status"
            >
                <i
                    class="fa-solid ${correct ? 'fa-circle-check' : 'fa-circle-xmark'}"
                    aria-hidden="true"
                />
                ${correct ? 'Correct!' : `Not quite. It was the ${bird.name}.`}
            </p>
            <div class="quiz-bird">
                ${photo &&
                html`<img src=${photo} alt=${bird.name} class="quiz-photo" />`}
                ${credit &&
                html`<p class="quiz-credit">
                    Photo:
                    <a href=${credit.url} target="_blank" rel="noopener noreferrer"
                        >${credit.text}</a
                    >
                </p>`}
                <div class="quiz-bird-body">
                    <h2>
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
                        class="quiz-post"
                        href=${prefixUriIfNeeded(post.uri)}
                        onClick=${avoidReload}
                        >Read my post about the ${bird.name} →</a
                    >`}
                </div>
            </div>
            <button class="quiz-primary" type="button" onClick=${next}>
                ${index + 1 < total ? 'Next bird' : 'See my score'}
                <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
        </div>`
    }

    return html`<style>
            .quiz {
                max-width: 64ch;
            }
            .quiz h1 {
                margin: 1rem 0 0.8rem;
                font-size: clamp(2.8rem, 2.2rem + 1.4vw, 3.6rem);
                font-weight: 600;
            }
            .quiz-intro {
                margin: 0 0 2rem;
                color: var(--c-text-muted);
            }
            .quiz-modes {
                display: inline-flex;
                flex-wrap: wrap;
                gap: 0.4rem;
                margin: 0 0 2.4rem;
                padding: 0.4rem;
                border: 1px solid var(--c-border);
                border-radius: 999px;
                background: var(--c-surface);
            }
            .quiz-modes button {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.7rem 1.4rem;
                border: 0;
                border-radius: 999px;
                background: none;
                color: var(--c-text-muted);
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    color var(--dur) var(--ease);
            }
            .quiz-modes button:hover {
                color: var(--c-text);
            }
            .quiz-modes button[aria-pressed='true'] {
                background: var(--c-brand-soft);
                color: var(--c-brand);
            }
            .quiz-mystery {
                display: block;
                width: 100%;
                aspect-ratio: 4 / 3;
                margin: 0 0 2.4rem;
                object-fit: cover;
                border-radius: var(--radius-sm);
                box-shadow: var(--shadow-md);
                background: var(--c-surface-2);
            }
            .quiz-credit {
                margin: -1rem 0 1.8rem;
                font-family: var(--font-sans);
                font-size: 1.2rem;
                color: var(--c-text-muted);
            }
            .quiz-credit a {
                color: inherit;
            }
            .quiz-end .best {
                margin: -1.2rem 0 2.4rem;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--c-text-muted);
            }
            .quiz-end .best.is-new {
                color: var(--c-success);
            }
            .quiz-progress {
                display: flex;
                justify-content: space-between;
                margin: 0 0 0.8rem;
                font-family: var(--font-sans);
                font-size: 1.3rem;
                font-weight: 600;
                letter-spacing: 0.04em;
                color: var(--c-text-muted);
            }
            .quiz-bar {
                height: 6px;
                margin: 0 0 2.4rem;
                border-radius: 999px;
                background: var(--c-surface-2);
                overflow: hidden;
            }
            .quiz-bar span {
                display: block;
                height: 100%;
                border-radius: inherit;
                background: var(--c-brand);
                transition: width 400ms var(--ease);
            }
            .quiz-card {
                padding: 2.4rem;
                border: 1px solid var(--c-border);
                border-radius: var(--radius);
                background: var(--c-surface);
                box-shadow: var(--shadow-sm);
            }
            .quiz-question {
                margin: 0 0 1.6rem;
                font-size: 2rem;
                font-weight: 600;
            }
            .quiz-play {
                margin: 0 0 2.4rem;
            }
            .quiz-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
                gap: 1rem;
            }
            .quiz-option {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.2rem;
                padding: 1.4rem 1.6rem;
                border: 2px solid var(--c-border);
                border-radius: var(--radius-sm);
                background: var(--c-surface);
                color: var(--c-text);
                font-family: var(--font-sans);
                font-size: 1.6rem;
                font-weight: 600;
                text-align: left;
                cursor: pointer;
                transition: border-color var(--dur) var(--ease),
                    background-color var(--dur) var(--ease);
            }
            .quiz-option .local {
                font-size: 1.3rem;
                font-weight: 400;
                color: var(--c-text-muted);
            }
            .quiz-option:not(:disabled):hover {
                border-color: var(--c-brand);
                background: var(--c-brand-soft);
            }
            .quiz-option:disabled {
                cursor: default;
            }
            .quiz-option.is-answer {
                border-color: var(--c-success);
                background: color-mix(in srgb, var(--c-success) 12%, var(--c-surface));
            }
            .quiz-option.is-wrong {
                border-color: var(--c-danger);
                background: color-mix(in srgb, var(--c-danger) 10%, var(--c-surface));
            }
            .quiz-option.is-faded {
                opacity: 0.55;
            }
            .quiz-reveal {
                margin-top: 2.4rem;
                padding-top: 2.4rem;
                border-top: 1px solid var(--c-border);
                animation: fadein 300ms var(--ease) both;
            }
            .quiz-result {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                margin: 0 0 1.8rem;
                font-family: var(--font-sans);
                font-size: 1.7rem;
                font-weight: 700;
            }
            .quiz-result.is-right {
                color: var(--c-success);
            }
            .quiz-result.is-wrong {
                color: var(--c-danger);
            }
            .quiz-bird {
                margin: 0 0 2.4rem;
            }
            .quiz-photo {
                display: block;
                width: 100%;
                aspect-ratio: 16 / 9;
                margin: 0 0 1.8rem;
                object-fit: cover;
                border-radius: var(--radius-sm);
                box-shadow: var(--shadow-md);
                background: var(--c-surface-2);
            }
            .quiz-bird h2 {
                margin: 0;
                font-size: 2.4rem;
                font-weight: 600;
            }
            .quiz-bird h2 .local {
                margin-left: 0.8rem;
                font-size: 1.7rem;
                font-weight: 400;
                color: var(--c-text-muted);
            }
            .quiz-bird .scientific {
                margin: 0.2rem 0 1.2rem;
                font-style: italic;
                color: var(--c-text-muted);
            }
            .quiz-bird .fact {
                margin: 0 0 1.6rem;
                font-size: 1.6rem;
                line-height: 1.7;
            }
            .quiz-post {
                display: inline-block;
                margin-top: 1.4rem;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
            }
            .quiz-primary,
            .quiz-secondary {
                display: inline-flex;
                align-items: center;
                gap: 0.8rem;
                padding: 1.1rem 2rem;
                border: 0;
                border-radius: 999px;
                font-family: var(--font-sans);
                font-size: 1.5rem;
                font-weight: 600;
                cursor: pointer;
            }
            .quiz-primary {
                background: var(--c-brand);
                color: var(--c-on-brand);
            }
            .quiz-primary:hover {
                background: var(--c-brand-strong);
            }
            .quiz-secondary {
                background: var(--c-brand-soft);
                color: var(--c-brand);
            }
            .quiz-end {
                text-align: center;
            }
            .quiz-score {
                margin: 0.4rem 0;
                font-family: var(--font-serif);
                font-size: 6rem;
                font-weight: 600;
                line-height: 1.1;
                color: var(--c-brand);
            }
            .quiz-end .verdict {
                margin: 0 0 2.4rem;
                font-size: 1.8rem;
            }
            .quiz-end .actions {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1rem;
            }
            .quiz-end .note {
                min-height: 2rem;
                margin: 1.2rem 0 0;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                color: var(--c-text-muted);
            }
        </style>
        <${Page}
            title="Bird quiz"
            description="Guess the bird from its call or its photo."
            sidebarImage=${prefixUriIfNeeded('/assets/my-photos/greylag-geese.jpg')}
        >
            <div class="quiz">
                <h1>${modeInfo.heading}</h1>
                <p class="quiz-intro">${modeInfo.intro(total)}</p>
                <div class="quiz-modes" role="group" aria-label="Quiz type">
                    ${Object.entries(MODES).map(
                        ([value, info]) => html`<button
                            key=${value}
                            type="button"
                            aria-pressed=${mode === value ? 'true' : 'false'}
                            onClick=${() => start(value)}
                        >
                            <i class="fa-solid ${info.icon}" aria-hidden="true" />
                            ${info.label}
                        </button>`
                    )}
                </div>

                ${done
                    ? html`<div class="quiz-card quiz-end" role="status">
                          <p class="quiz-progress" style="justify-content:center">
                              Your score
                          </p>
                          <p class="quiz-score">${score}/${total}</p>
                          <p class="verdict">${verdict(score, total, mode)}</p>
                          ${bestHere &&
                          html`<p class="best ${newBest ? 'is-new' : ''}">
                              ${newBest
                                  ? 'New best score!'
                                  : `Your best: ${bestHere.score}/${bestHere.total}`}
                          </p>`}
                          <div class="actions">
                              <button
                                  class="quiz-primary"
                                  type="button"
                                  onClick=${share}
                              >
                                  <i
                                      class="fa-solid fa-share-nodes"
                                      aria-hidden="true"
                                  />
                                  Share my score
                              </button>
                              <button
                                  class="quiz-secondary"
                                  type="button"
                                  onClick=${restart}
                              >
                                  <i
                                      class="fa-solid fa-rotate-right"
                                      aria-hidden="true"
                                  />
                                  Play again
                              </button>
                          </div>
                          <p class="note" aria-live="polite">${shareNote}</p>
                      </div>`
                    : html`<p class="quiz-progress">
                              <span>Bird ${index + 1} of ${total}</span>
                              <span
                                  >Score: ${score}${bestHere
                                      ? ` · Best: ${bestHere.score}/${bestHere.total}`
                                      : ''}</span
                              >
                          </p>
                          <div class="quiz-bar" aria-hidden="true">
                              <span
                                  style=${{
                                      width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
                                  }}
                              />
                          </div>
                          <div class="quiz-card">
                              <p class="quiz-question">
                                  ${round.kind === 'photo'
                                      ? 'Which bird is this?'
                                      : 'Who’s singing?'}
                              </p>
                              ${round.kind === 'photo' &&
                              html`<img
                                  key=${round.bird.id}
                                  src=${photoOf(round.bird)}
                                  alt="Mystery bird"
                                  class="quiz-mystery"
                              />`}
                              ${round.kind === 'call' &&
                              !answered &&
                              html`<div class="quiz-play">
                                  <${BirdCall}
                                      key=${round.bird.id}
                                      bird=${round.bird}
                                      label="Play the mystery call"
                                      showCredit=${false}
                                  />
                              </div>`}
                              <div
                                  class="quiz-options"
                                  role="group"
                                  aria-label="Choose a bird"
                              >
                                  ${round.options.map((bird) => {
                                      const isAnswer = bird.id === round.bird.id
                                      const state = !answered
                                          ? ''
                                          : isAnswer
                                          ? 'is-answer'
                                          : bird.id === picked
                                          ? 'is-wrong'
                                          : 'is-faded'
                                      return html`<button
                                          key=${bird.id}
                                          type="button"
                                          class="quiz-option ${state}"
                                          disabled=${answered}
                                          onClick=${() => pick(bird)}
                                      >
                                          ${bird.name}
                                          ${bird.nameLocal &&
                                          html`<span
                                              class="local"
                                              lang=${bird.nameLang}
                                              >${bird.nameLocal}</span
                                          >`}
                                      </button>`
                                  })}
                              </div>
                              ${answered && reveal()}
                          </div>`}
            </div>
        <//>`
}
