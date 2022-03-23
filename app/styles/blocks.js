export const blocksStyles = `<style>
    @keyframes fadein {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
    .outline {
        border: 0.1rem solid transparent;
    }
    .image {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .center {
        width: 30%;
        margin: auto;
    },
    .container {
        padding: 0.5rem;
    }
    .col {
        flex-grow: 1;
    }
    .row {
        display: flex;
    }
    .wrapper {
        position: relative;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        max-width: 100%;
    }
    .block {
        background: #fff;
        padding: 1rem;
        border-radius: 4px;
        position: relative;
        cursor: default;
    }
    .blocks-fadein {
        animation-name: fadein;
        animation-duration: 1s, 1s;
        animation-iteration-count: 1;
    }
</style>`
    .replace('<style>', '')
    .replace('</style>', '')
