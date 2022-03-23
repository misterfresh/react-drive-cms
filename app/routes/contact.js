import { html, useState } from '../../deps/react.js'

import {BaseInput} from '../components/form/baseInput.js'
import {Page} from '../components/layout/page.js'
import input from '../styles/input.js'
import buttons from '../styles/buttons.js'
import { Mail } from '../lib/mail.js'
import resolveAsset from '../utils/resolveAsset.js'
import {avoidReload} from "../utils/avoidReload.js";

export const Contact = ({state, dispatch}) => {
    const [isValid, setIsValid] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')

    const [errorProperty, setErrorProperty] = useState('')
    const [error, setError] = useState('')

    const updateName = (event) => {

    }

    const sendMessage = (event) => {
        event.preventDefault()
        event.stopPropagation()



        Mail.send({
            name, email, company, phone, message
        })
    }

    return html`
        <style>
            .title {
                font-size: 2.6rem;
                margin-top: 20px;
                font-family: inherit;
                font-weight: 500;
                line-height: 1.1;
                color: inherit;
                margin-bottom: 10px;
            }

            label {
                font-size: 2rem;
                font-family: "Source Sans Pro",Helvetica,Arial,sans-serif;
                font-weight: 700;
                margin: 15px 0 0;
            }
            button {
                font-family: "Source Sans Pro",Helvetica,Arial,sans-serif;
            }
            .error {
                color: red;
            }
            .required:after {
                color: red;
                content: " *";
            }
            footer {
                padding: 10px 0;
                font-size: 1.4rem;
                letter-spacing: 1px;
                font-weight: 700;
                font-family: "Source Sans Pro",Helvetica,Arial,sans-serif;
                text-transform: uppercase;
            }
            .contact {
                text-decoration: none;
                background-color: transparent;
                color: #999;
                border-bottom: none;
                font-size: 1.4rem;
            }
            .contact:hover {
                text-decoration: none;
                background-color: transparent;
                color: #333;
                outline: 0;
                transition: all .4s;
                border-bottom: none;
            }
            form {
                margin-bottom: 5rem;
            }
        </style>
        <${Page}
                title="Contact"
                subtitle="Get in touch with us"
                description=""
                sidebarImage=${resolveAsset('/assets/default-contact.jpg')}
                state=${state}
                dispatch=${dispatch}
            >
                <h3 class="title">Send me an email</h3>
                <form class="form">
                    <div>
                        <label
                            for="name"
                            class="required"
                        >
                            Your name
                        </label>
                        ${name.error &&
    html`
                            <span class="error">
                                ${name.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${name.value}
                            name="name"
                            placeholder="Jack Smith"
                            onInput=${updateFormProperty}
                            class="input-base ${name.error ? 'input-error' : ''}"
                        />
                    </div>
                    <div>
                        <label
                            for="email"
                            class="required"
                        >
                            Your email
                        </label>
                        ${email.error &&
    html`
                            <span class="error">
                                ${email.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${email.value}
                            name="email"
                            placeholder="example@mail.com"
                            type="email"
                            onInput=${updateFormProperty}
                            class="input-base ${email.error ? 'input-error' : ''}"
                        />
                    </div>
                    <div>
                        <label for="company">
                            Company
                        </label>
                        ${company.error &&
    html`
                            <span class="error">
                                ${company.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${company.value}
                            name="company"
                            placeholder="Example Corporation"
                            onInput=${updateFormProperty}
                            class="input-base ${company.error ? 'input-error' : ''}"
                        />
                    </div>
                    <div>
                        <label for="phone">
                            Phone number
                        </label>
                        ${phone.error &&
    html`
                            <span class="error">
                                ${phone.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${phone.value}
                            name="phone"
                            placeholder="+44778765439"
                            onInput=${updateFormProperty}
                            class="input-base ${phone.error ? 'input-error' : ''}"
                        />
                    </div>
                    <div>
                        <label
                            for="message"
                            class="required"
                        >
                            Your message
                        </label>
                        ${message.error &&
    html`
                            <span class="error">
                                ${message.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${message.value}
                            name="message"
                            placeholder="Hello, let's chat!"
                            Component="textarea"
                            onInput=${updateFormProperty}
                            class="input-base ${message.error ? 'input-error' : ''}"
                        />
                    </div>

                    ${isValid && !isSent
        ? html` <button
                              class="buttons-base button"
                              onClick=${sendMessage}
                              type="submit"
                          >
                              Send Message
                          </button>`
        : html` <button
                              class="buttons-base buttons-disabled button"
                              disabled
                              type="submit"
                          >
                              ${isSent ? 'Message sent !' : 'Form incomplete'}
                          </button>`}
                </form>
                <footer>
                    <a href="/about" class="contact" onClick=${avoidReload}>
                        About
                    </a>
                </footer>
            <//>`
}

class Contact extends Component {
    constructor(props) {
        super(props)
        this.state = {
            values: {
                name: {
                    value: '',
                    error: false,
                    required: true,
                },
                email: {
                    value: '',
                    error: false,
                    required: true,
                },
                company: {
                    value: '',
                    error: false,
                    required: false,
                },
                phone: {
                    value: '',
                    error: false,
                    required: false,
                },
                message: {
                    value: '',
                    error: false,
                    required: true,
                },
            },
            valid: false,
            sent: false,
        }
        this.validateEmail =
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        this.updateFormProperty = this.updateFormProperty.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }

    updateFormProperty(property, value) {
        let { values } = this.state
        let element = values[property]
        let { error, required } = element
        if (required && value.length < 4) {
            error = '4 characters minimum.'
        } else if (property === 'email' && !this.validateEmail.test(value)) {
            error = 'Enter valid email.'
        } else {
            error = false
        }
        values = {
            ...values,
            [property]: {
                required,
                value,
                error,
            },
        }
        let valid = Object.values(values).every(
            (item) => !item.error && (!item.required || item.value.length > 3)
        )
        this.setState({
            values,
            valid,
        })
    }

}

