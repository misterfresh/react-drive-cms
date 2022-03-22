import { html } from '../../../deps/react.js'
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
    handleChange,
}) => {
    return html`<${Input}
        value=${value}
        onInput=${handleChange}
        style=${style}
        class=${className}
        name=${name}
        type=${type}
        placeholder=${placeholder ? placeholder : capitalize(name)}
        data-property=${property ? property : name}
        min=${min}
        step=${step}
    />`
}
