import { html } from '../../lib/htm-preact.js'

export const MenuBurger = ({ toggleMenuVisible }) => {
    return html`<style>
            .menu-burger {
                position: fixed;
                top: 1.5rem;
                left: 1.5rem;
                z-index: 15;
                border-radius: 5px;
                height: 4rem;
                width: 4rem;
                background: #333;
                padding-top: 8px;
                cursor: pointer;
                border-bottom: 0 transparent;
                box-shadow: #948b8b 2px 2px 10px;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                outline: 0;
                border: 0;
            }
            .menu-burger:hover {
                color: #fff;
                outline: 0;
                background: #999;
            }
            .menu-burger:focus {
                outline: 0;
            }
            .bar {
                height: 0.5rem;
                width: 2.8rem;
                display: block;
                margin: 0 6px 5px;
                background: #fff;
                border-radius: 0.3rem;
            }
        </style>
        <button class="menu-burger" onClick=${toggleMenuVisible}>
            <div class="bar" />
            <div class="bar" />
            <div class="bar" />
        </button> `
}
