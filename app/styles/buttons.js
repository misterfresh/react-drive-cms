export const buttonsStyles = `<style>
    button.base {
        display: inline-block;
        font-weight: 400;
        line-height: 1.25rem;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 0.1rem solid transparent;
        padding: 1rem 1rem;
        font-size: 1.6rem;
        border-radius: .5rem;
        transition: all .2s ease-in-out;
        cursor: pointer;
        text-decoration: none;
        color: #fff;
        background-color: #0275d8;
        border-color: #0275d8;    
    }
    button.base:hover {
        text-decoration: none;
        background-color: #025aa5;
        border-color: #01549b;
        color: #fff;
    }
    button.large {
        padding: 1.5rem;
        font-size: 2rem;
        border-radius: .5rem;
    }
    button.block {
        display: block;
        width: 100%;
    }
    button:disabled {
        pointer-events: none;
        background-color: #85c6f2;
        border-color: #85c6f2;     
    }
    button:disabled:hover {
        background-color: #85c6f2;
        border-color: #85c6f2;
        cursor: not-allowed;
    }
</style>`
    .replace('<style>', '')
    .replace('</style>', '')
