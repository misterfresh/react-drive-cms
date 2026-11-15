// Shared styles for the simple text pages (About, 日本語, 繁體中文, Memoriam, Music)
export const infoPageStyles = `
    .about-content {
        display: flow-root;
        max-width: 68ch;
    }
    .about-content img.image {
        float: left;
        width: 15rem;
        height: auto;
        margin: 0.6rem 2.4rem 1.6rem 0;
        border-radius: var(--radius);
        box-shadow: var(--shadow-md);
        vertical-align: middle;
    }
    .info-title {
        margin: 1rem 0 2.4rem;
        font-family: var(--font-serif);
        font-size: clamp(3rem, 2.2rem + 2vw, 4.2rem);
        font-weight: 600;
        line-height: 1.2;
        letter-spacing: -0.01em;
        color: var(--c-text);
    }
    .info p {
        font-size: 1.8rem;
        line-height: 1.85;
        margin: 0 0 2.4rem;
        color: var(--c-text);
    }
    .info .signature {
        font-style: italic;
        color: var(--c-text-muted);
    }
    .info .info-year {
        font-size: 1.6rem;
        color: var(--c-text-muted);
        letter-spacing: 0.02em;
    }
    .page-links {
        display: flex;
        gap: 2.4rem;
        clear: both;
        margin-top: 2rem;
        padding: 2rem 0 0;
        border-top: 1px solid var(--c-border);
    }
    .page-links a {
        font-family: var(--font-sans);
        font-size: 1.3rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--c-text-muted);
    }
    .page-links a:hover {
        color: var(--c-brand);
    }
    @media (max-width: 560px) {
        .about-content img.image {
            float: none;
            display: block;
            margin: 0 0 2rem;
        }
    }
`
