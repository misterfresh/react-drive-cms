import { html } from '../../lib/htm-preact.js'
import capitalize from '../../utils/capitalize.js'

export const BaseInput = ({
    className = '',
    style = {},
    name = '',
    type = 'text',
    placeholder = '',
    Input = 'input',
    property = '',
    min = 0,
    step = 1,
    value,
    required = false,
    onInput,
}) => {
    return html`<${Input}
        value=${value}
        onInput=${onInput}
        style=${style}
        class=${className}
        name=${name}
        type=${type}
        placeholder=${placeholder ? placeholder : capitalize(name)}
        data-property=${property ? property : name}
        min=${min}
        step=${step}
        required=${Boolean(required)}
    />`
}
