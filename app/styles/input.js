export const inputStyles = `
    .input-base {
        display: block;
        width: 100%;
        padding: 1.1rem 1.4rem;
        font-family: var(--font-sans);
        font-size: 1.6rem;
        line-height: 1.4;
        color: var(--c-text);
        background-color: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-sm);
        box-shadow: inset 0 1px 2px rgba(40, 14, 52, 0.04);
        transition: border-color var(--dur) var(--ease),
            box-shadow var(--dur) var(--ease);
        margin: 0.6rem 0 1.8rem;
    }
    textarea.input-base {
        min-height: 14rem;
        resize: vertical;
    }
    .input-base::placeholder {
        color: var(--c-text-muted);
        opacity: 0.7;
    }
    .input-base:hover {
        border-color: var(--c-text-muted);
    }
    .input-base:focus {
        outline: none;
        border-color: var(--c-brand);
        box-shadow: 0 0 0 3px var(--c-brand-soft);
    }
    .input-error,
    .input-error:hover {
        border-color: var(--c-danger);
    }
    .input-error:focus {
        border-color: var(--c-danger);
        box-shadow: 0 0 0 3px rgba(179, 38, 30, 0.15);
    }
`
