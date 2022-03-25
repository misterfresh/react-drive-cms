export const inputStyles = `<style>
    .input-base {
        display: block;
        width: 100%;
        padding: .5rem .75rem;
        font-size: 1.6rem;
        line-height: 1.25;
        color: #464a4c;
        background-color: #fff;
        background-image: none;
        background-clip: padding-box;
        border: .1rem solid rgba(0,0,0,.15);
        border-radius: .25rem;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
        margin-bottom: 1rem;
    }
    .input-base::placeholder {
        max-width: 92%;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }
    .input-error {
        border: .1rem solid red; 
    }
    .input-error::placeholder {
        max-width: 92%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        color: red;
    }
</style>`
    .replace('<style>', '')
    .replace('</style>', '')
