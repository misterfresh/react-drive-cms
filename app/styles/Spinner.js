import { html } from '../lib/htm-preact.js'

export const Spinner = ({ stroke = '#2f3d4c', width, height, rayon = 45 }) => {
    return html`<style>
            svg.spinner {
                animation: 2s linear infinite svg-animation;
                max-width: 100px;
            }

            @keyframes svg-animation {
                0% {
                    transform: rotateZ(0deg);
                }
                100% {
                    transform: rotateZ(360deg);
                }
            }

            svg.spinner circle {
                animation: 1.4s ease-in-out infinite both circle-animation;
                display: block;
                fill: transparent;
                stroke: ${stroke};
                stroke-linecap: round;
                stroke-dasharray: 283;
                stroke-dashoffset: 280;
                stroke-width: 10px;
                transform-origin: 50% 50%;
            }

            @keyframes circle-animation {
                0%,
                25% {
                    stroke-dashoffset: 280;
                    transform: rotate(0);
                }

                50%,
                75% {
                    stroke-dashoffset: 75;
                    transform: rotate(45deg);
                }

                100% {
                    stroke-dashoffset: 280;
                    transform: rotate(360deg);
                }
            }
        </style>
        <svg
            class="spinner"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            width=${width}
            height=${height}
        >
            <circle cx="50" cy="50" r="${rayon}" />
        </svg>`
}
