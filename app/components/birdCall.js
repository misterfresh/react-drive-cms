import { html, useEffect, useState } from '../lib/htm-preact.js'

// One shared player, so starting a call stops any other one on the page.
let player = null
const listeners = new Set()
const notify = () => listeners.forEach((listener) => listener())

const getPlayer = () => {
    if (!player) {
        player = new Audio()
        player.preload = 'none'
        ;['play', 'pause', 'ended', 'waiting', 'playing', 'error'].forEach(
            (type) => player.addEventListener(type, notify)
        )
    }
    return player
}

const audioUrl = (call) => `https://xeno-canto.org/${call.xc}/download`

// variant: 'light' for use on top of photos, 'default' on page background
// label: button text instead of "Listen to the …" (the quiz uses this so the
//        name stays hidden); showCredit: false hides the recording credit.
export const BirdCall = ({
    bird,
    variant = 'default',
    label,
    showCredit = true,
}) => {
    const call = bird?.call
    const [, rerender] = useState(0)

    useEffect(() => {
        const listener = () => rerender((n) => n + 1)
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
            // stop playback when leaving the page
            if (player && player.src === audioUrl(call ?? {})) player.pause()
        }
    }, [call?.xc])

    if (!call) return null

    const src = audioUrl(call)
    const isCurrent = player?.src === src
    const isPlaying = isCurrent && !player.paused && !player.ended
    const isLoading = isPlaying && player.readyState < 3
    const hasError = isCurrent && Boolean(player.error)

    const toggle = (event) => {
        event.preventDefault()
        event.stopPropagation()
        const audio = getPlayer()
        if (isPlaying) {
            audio.pause()
            return
        }
        if (audio.src !== src) {
            audio.src = src
        }
        audio.play().catch(notify)
    }

    return html`<div class="bird-call bird-call-${variant}">
        <style>
            .bird-call {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 0.6rem 1.2rem;
                font-family: var(--font-sans);
            }
            .bird-call .listen {
                display: inline-flex;
                align-items: center;
                gap: 0.8rem;
                padding: 0.7rem 1.6rem 0.7rem 0.8rem;
                border-radius: 999px;
                font-family: inherit;
                font-size: 1.4rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    border-color var(--dur) var(--ease),
                    color var(--dur) var(--ease);
            }
            .bird-call .listen .icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 2.8rem;
                height: 2.8rem;
                border-radius: 50%;
                font-size: 1.1rem;
            }
            .bird-call-default .listen {
                border: 1px solid var(--c-border);
                background: var(--c-surface);
                color: var(--c-text);
            }
            .bird-call-default .listen .icon {
                background: var(--c-brand);
                color: var(--c-on-brand);
            }
            .bird-call-default .listen:hover {
                border-color: var(--c-brand);
                color: var(--c-brand);
            }
            .bird-call-light .listen {
                border: 1px solid rgba(255, 255, 255, 0.3);
                background: rgba(255, 255, 255, 0.12);
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);
                color: #fff;
            }
            .bird-call-light .listen .icon {
                background: #fff;
                color: var(--c-menu-bg);
            }
            .bird-call-light .listen:hover {
                background: rgba(255, 255, 255, 0.24);
            }
            .bird-call .bars {
                display: inline-flex;
                align-items: flex-end;
                gap: 2px;
                height: 1.2rem;
            }
            .bird-call .bars span {
                width: 3px;
                height: 100%;
                border-radius: 2px;
                background: currentColor;
                animation: bird-call-bar 900ms ease-in-out infinite;
            }
            .bird-call .bars span:nth-child(2) {
                animation-delay: -300ms;
            }
            .bird-call .bars span:nth-child(3) {
                animation-delay: -600ms;
            }
            @keyframes bird-call-bar {
                0%,
                100% {
                    transform: scaleY(0.3);
                }
                50% {
                    transform: scaleY(1);
                }
            }
            .bird-call .bars span {
                transform-origin: bottom;
            }
            .bird-call .credit {
                font-size: 1.15rem;
                opacity: 0.75;
            }
            .bird-call-light .credit,
            .bird-call-light .credit a {
                color: rgba(255, 255, 255, 0.85);
            }
            .bird-call .credit a {
                text-decoration: underline;
                text-underline-offset: 2px;
            }
        </style>
        <button
            class="listen"
            onClick=${toggle}
            aria-pressed=${isPlaying}
            aria-label=${label
                ? isPlaying
                    ? 'Pause the call'
                    : label
                : isPlaying
                ? `Pause the ${bird.name}'s call`
                : `Listen to the ${bird.name}'s call`}
        >
            <span class="icon" aria-hidden="true">
                <i
                    class="fa-solid ${isLoading
                        ? 'fa-spinner fa-spin'
                        : isPlaying
                        ? 'fa-pause'
                        : 'fa-play'}"
                />
            </span>
            ${hasError
                ? 'Recording unavailable'
                : isPlaying
                ? html`<span>Playing</span
                      ><span class="bars" aria-hidden="true"
                          ><span /><span /><span
                      /></span>`
                : label ?? `Listen to the ${bird.name}`}
        </button>
        ${showCredit &&
        html`<span class="credit">
            Recording${' '}
            <a
                href="https://xeno-canto.org/${call.xc}"
                target="_blank"
                rel="noopener"
                >XC${call.xc}</a
            >${' '}by ${call.recordist},${' '}
            <a href=${call.licenseUrl} target="_blank" rel="noopener"
                >${call.license}</a
            >
        </span>`}
    </div>`
}
