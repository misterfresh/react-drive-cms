import { html } from '../../lib/htm-preact.js'

export const MenuBurger = ({ toggleMenuVisible, menuVisible }) => {
    return html`<style>
            .menu-burger {
                position: fixed;
                top: 1.6rem;
                left: 1.6rem;
                z-index: 15;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                width: 4.6rem;
                height: 4.6rem;
                padding: 0;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 50%;
                background: var(--c-menu-bg);
                box-shadow: var(--shadow-md);
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    box-shadow var(--dur) var(--ease),
                    transform var(--dur) var(--ease);
            }
            .menu-burger:hover {
                background: var(--c-brand-strong);
                box-shadow: var(--shadow-lg);
                transform: scale(1.04);
            }
            .menu-burger .bar {
                display: block;
                width: 2rem;
                height: 2px;
                border-radius: 2px;
                background: #fff;
                transition: transform 250ms var(--ease),
                    opacity 250ms var(--ease);
            }
            .menu-burger.open .bar:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
            }
            .menu-burger.open .bar:nth-child(2) {
                opacity: 0;
            }
            .menu-burger.open .bar:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
            }
        </style>
        <button
            class="menu-burger ${menuVisible ? 'open' : ''}"
            onClick=${toggleMenuVisible}
            aria-label=${menuVisible ? 'Close menu' : 'Open menu'}
            aria-expanded=${Boolean(menuVisible)}
            aria-controls="menu"
        >
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
        </button> `
}
