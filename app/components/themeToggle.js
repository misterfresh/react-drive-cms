import { html, useState } from '../lib/htm-preact.js'

// Light / Auto / Dark switch. "Auto" follows the visitor's device setting.
// The choice is saved in this browser only; the inline script in index.html
// applies it before the page paints, so there's no flash of the wrong theme.
const options = [
    { value: 'light', label: 'Light', icon: 'fa-sun' },
    { value: 'auto', label: 'Auto', icon: 'fa-circle-half-stroke' },
    { value: 'dark', label: 'Dark', icon: 'fa-moon' },
]

const readTheme = () => {
    const current = document.documentElement.getAttribute('data-theme')
    return current === 'light' || current === 'dark' ? current : 'auto'
}

const applyTheme = (theme) => {
    if (theme === 'auto') {
        document.documentElement.removeAttribute('data-theme')
    } else {
        document.documentElement.setAttribute('data-theme', theme)
    }
    try {
        if (theme === 'auto') localStorage.removeItem('theme')
        else localStorage.setItem('theme', theme)
    } catch (e) {
        // Storage blocked (e.g. private mode): the choice lasts for this visit.
    }
}

export const ThemeToggle = () => {
    const [theme, setTheme] = useState(readTheme)

    const choose = (value) => {
        applyTheme(value)
        setTheme(value)
    }

    return html`<style>
            .theme-toggle {
                display: flex;
                gap: 0.4rem;
                margin: 1.6rem 3rem 0;
                padding: 0.4rem;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 999px;
                width: fit-content;
            }
            .theme-toggle button {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.6rem 1.2rem;
                border: 0;
                border-radius: 999px;
                background: none;
                color: var(--c-menu-muted);
                font-family: var(--font-sans);
                font-size: 1.2rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    color var(--dur) var(--ease);
            }
            .theme-toggle button:hover {
                color: #fff;
            }
            .theme-toggle button[aria-pressed='true'] {
                background: rgba(255, 255, 255, 0.14);
                color: #fff;
            }
        </style>
        <div class="theme-toggle" role="group" aria-label="Colour theme">
            ${options.map(
                (option) => html`<button
                    key=${option.value}
                    type="button"
                    aria-pressed=${theme === option.value ? 'true' : 'false'}
                    onClick=${() => choose(option.value)}
                >
                    <i class="fa-solid ${option.icon}" aria-hidden="true" />
                    ${option.label}
                </button>`
            )}
        </div>`
}
