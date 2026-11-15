import { html } from '../lib/htm-preact.js'
const conf = window.appConf

// Email newsletter sign-up through Buttondown (buttondown.com).
// Turned on by setting buttondownUsername in conf.js. Buttondown asks that
// the form posts normally (not via fetch), so it opens their confirmation
// page in a new tab.
export const Subscribe = ({ compact = false }) => {
    const username = conf.buttondownUsername
    if (!username) return null

    return html`<section class="subscribe ${compact ? 'compact' : ''}">
        <style>
            .subscribe {
                margin: 4rem 0 0;
                padding: clamp(2.4rem, 4vw, 3.2rem);
                border-radius: var(--radius);
                background: linear-gradient(
                    135deg,
                    var(--c-brand-soft),
                    var(--c-surface-2)
                );
                border: 1px solid var(--c-border);
            }
            .subscribe.compact {
                margin: 0 auto 4rem;
                max-width: 72rem;
            }
            .subscribe h2 {
                margin: 0 0 0.6rem;
                font-size: 2.2rem;
                font-weight: 600;
            }
            .subscribe p {
                margin: 0 0 1.8rem;
                color: var(--c-text-muted);
                font-size: 1.6rem;
            }
            .subscribe form {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .subscribe input[type='email'] {
                flex: 1 1 24rem;
                min-width: 0;
                padding: 1.1rem 1.6rem;
                border: 1px solid var(--c-border);
                border-radius: 999px;
                background: var(--c-surface);
                color: var(--c-text);
                font-family: var(--font-sans);
                font-size: 1.6rem;
            }
            .subscribe input[type='email']:focus {
                outline: none;
                border-color: var(--c-brand);
                box-shadow: 0 0 0 3px var(--c-brand-soft);
            }
            .subscribe button {
                padding: 1.1rem 2.4rem;
                border: 0;
                border-radius: 999px;
                background: var(--c-brand);
                color: var(--c-on-brand);
                font-family: var(--font-sans);
                font-size: 1.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease);
            }
            .subscribe button:hover {
                background: var(--c-brand-strong);
            }
        </style>
        <h2>Get new posts by email</h2>
        <p>A short email when I publish something new. No spam, unsubscribe anytime.</p>
        <form
            action="https://buttondown.com/api/emails/embed-subscribe/${username}"
            method="post"
            target="_blank"
        >
            <label class="visually-hidden" for="subscribe-email">Email</label>
            <input
                id="subscribe-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
            />
            <input type="hidden" name="embed" value="1" />
            <button type="submit">Subscribe</button>
        </form>
    </section>`
}
