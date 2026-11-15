export const blocksStyles = `
    @keyframes fadein {
        /* opacity only: a transform here would break position: fixed children */
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .outline {
        border: 1px solid transparent;
    }
    .image {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        box-shadow: var(--shadow-md);
    }
    .center {
        width: 30%;
        margin: auto;
    }
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
        width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        max-width: 100%;
    }
    .block {
        background: var(--c-surface);
        padding: 1rem;
        border-radius: var(--radius-sm);
        position: relative;
        cursor: default;
    }
    .blocks-fadein {
        animation: fadein 400ms var(--ease) both;
    }
`
