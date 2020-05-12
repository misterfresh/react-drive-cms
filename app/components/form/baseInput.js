import { html, Component } from '../../../deps/react.js'
import debounce from '../../../deps/lodash.debounce.js'
import uuid from '../../utils/uuid.js'
import capitalize from '../../utils/capitalize.js'

class BaseInput extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.updateValue = debounce(this.updateValue.bind(this), 700)
        this.state = {
            value: props.value,
        }
        this.id = uuid()
    }

    handleChange(event) {
        let property = event.target.dataset.property
        let value =
            this.props.type === 'number'
                ? parseInt(event.target.value)
                : event.target.value
        this.setState(
            {
                value,
            },
            () => this.updateValue(property, value)
        )
    }

    componentWillReceiveProps(nextProps) {
        if (this.id !== document.activeElement.id) {
            this.setState({
                value: nextProps.value,
            })
        }
    }

    updateValue(property, value) {
        this.setState(
            {
                value,
            },
            () => this.props.onInput(property, value, this.props.id)
        )
    }

    render() {
        let {
            className = '',
            style = {},
            name = '',
            type = 'text',
            placeholder = '',
            Input = 'input',
            property = '',
            min = 0,
            step = 1,
        } = this.props
        let { value } = this.state
        name = !!name ? name : property
        return html`
            <${Input}
                value=${value}
                onInput=${this.handleChange}
                style=${style}
                className=${className}
                name=${name}
                type=${type}
                placeholder=${placeholder ? placeholder : capitalize(name)}
                data-property=${property ? property : name}
                min=${min}
                step=${step}
                id=${this.id}
            />
        `
    }
}

export default BaseInput
