import { html, useState } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import { infoPageStyles } from '../styles/infoPage.js'

// A friendly page about the RSS feed. The feed itself (/feed.xml) is built
// by scripts/build_static.py; this page just explains how to use it.
const FEED_URL = 'https://thepurpleclub.github.io/home/feed.xml'

const readers = [
    {
        name: 'Feedly',
        url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(FEED_URL)}`,
    },
    {
        name: 'Inoreader',
        url: `https://www.inoreader.com/?add_feed=${encodeURIComponent(FEED_URL)}`,
    },
]

export const Subscribe = () => {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(FEED_URL)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch (error) {
            // Clipboard blocked: select the text so it can be copied by hand.
            const field = document.getElementById('feed-url')
            field?.select()
        }
    }

    return html`<style>
            ${infoPageStyles}
            .rss-page {
                max-width: 62ch;
            }
            .rss-page h1 {
                margin: 1rem 0 1.2rem;
                font-size: clamp(2.8rem, 2.2rem + 1.4vw, 3.6rem);
                font-weight: 600;
            }
            .rss-page h2 {
                margin: 3.2rem 0 1rem;
                font-size: 2rem;
                font-weight: 600;
            }
            .rss-page p,
            .rss-page li {
                font-size: 1.7rem;
                line-height: 1.7;
            }
            .rss-page ol {
                padding-left: 2.2rem;
            }
            .feed-box {
                display: flex;
                gap: 0.8rem;
                margin: 1.6rem 0 0.8rem;
            }
            .feed-box input {
                flex: 1;
                min-width: 0;
                padding: 1rem 1.2rem;
                border: 1px solid var(--c-border);
                border-radius: var(--radius-sm);
                background: var(--c-surface);
                color: var(--c-text);
                font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
                font-size: 1.4rem;
            }
            .feed-box button,
            .reader-links a {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                padding: 1rem 1.6rem;
                border: 0;
                border-radius: 999px;
                background: var(--c-brand);
                color: var(--c-on-brand);
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
                text-decoration: none;
                white-space: nowrap;
                cursor: pointer;
            }
            .feed-box button:hover,
            .reader-links a:hover {
                background: var(--c-brand-strong);
            }
            .reader-links {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin: 1.2rem 0;
            }
            .reader-links a {
                background: var(--c-brand-soft);
                color: var(--c-brand);
            }
            .reader-links a:hover {
                background: var(--c-brand-soft);
                color: var(--c-brand-strong);
            }
            .rss-page .small {
                font-family: var(--font-sans);
                font-size: 1.4rem;
                color: var(--c-text-muted);
            }
        </style>
        <${Page}
            title="Follow along"
            description="Get new posts from The Purple Club in your favourite reader app."
            sidebarImage=${prefixUriIfNeeded(
                '/assets/my-photos/muscovy-ducks-and-grackle.jpg'
            )}
        >
            <div class="rss-page">
                <h1>Follow along with RSS</h1>
                <p>
                    RSS lets you follow The Purple Club without an account or an
                    email list. Add the link below to a free reader app, and
                    every new post shows up there automatically.
                </p>

                <div class="feed-box">
                    <input
                        id="feed-url"
                        type="text"
                        value=${FEED_URL}
                        readonly
                        aria-label="Feed link"
                        onFocus=${(event) => event.target.select()}
                    />
                    <button type="button" onClick=${copy}>
                        <i
                            class="fa-solid ${copied ? 'fa-check' : 'fa-copy'}"
                            aria-hidden="true"
                        />
                        ${copied ? 'Copied!' : 'Copy link'}
                    </button>
                </div>
                <p class="small" aria-live="polite">
                    ${copied ? 'The feed link is copied. Paste it into your reader app.' : ''}
                </p>

                <h2>Add it in one tap</h2>
                <div class="reader-links">
                    ${readers.map(
                        (reader) => html`<a
                            key=${reader.name}
                            href=${reader.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            >Open in ${reader.name}
                            <i
                                class="fa-solid fa-arrow-up-right-from-square"
                                aria-hidden="true"
                        /></a>`
                    )}
                </div>

                <h2>Or use any other reader</h2>
                <ol>
                    <li>Copy the link above.</li>
                    <li>
                        Open your reader app (for example NetNewsWire,
                        Feedly, Inoreader or Reeder) and choose “Add feed” or
                        “Subscribe”.
                    </li>
                    <li>Paste the link. That's it!</li>
                </ol>

                <p class="small">
                    Prefer to look at the raw feed?${' '}
                    <a href=${prefixUriIfNeeded('/feed.xml')}>View feed.xml</a>.
                    Or just check the${' '}
                    <a href=${prefixUriIfNeeded('/')} onClick=${avoidReload}
                        >home page</a
                    >${' '}now and then.
                </p>
            </div>
        <//>`
}
