export const buttonsStyles = `
    button.base {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.8rem;
        font-family: var(--font-sans);
        font-weight: 500;
        font-size: 1.5rem;
        line-height: 1.2;
        white-space: nowrap;
        user-select: none;
        padding: 1.1rem 2.2rem;
        border: 1px solid transparent;
        border-radius: 999px;
        color: var(--c-on-brand);
        background-color: var(--c-brand);
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition: background-color var(--dur) var(--ease),
            box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
    }
    button.base:hover {
        background-color: var(--c-brand-strong);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
    }
    button.base:active {
        transform: translateY(0);
    }
    button.large {
        padding: 1.4rem 2.8rem;
        font-size: 1.7rem;
    }
    button.block {
        display: flex;
        width: 100%;
    }
    button.base:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        box-shadow: none;
        transform: none;
    }
`
