import { html, useState, useMemo, useCallback } from '../lib/htm-preact.js'

import { BaseInput } from '../components/form/baseInput.js'
import { Page } from '../components/layout/page.js'
import { inputStyles } from '../styles/input.js'
import { Mail } from '../lib/mail.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'
import debounce from '../utils/debounce.js'
import { Spinner } from '../styles/Spinner.js'

const validateEmailRegex =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
const requiredTexts = ['name', 'message']

export const Contact = ({ state, dispatch }) => {
    const [isSent, setIsSent] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [sentError, setSentError] = useState('')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')

    const setText = {
        name: setName,
        company: setCompany,
        phone: setPhone,
        message: setMessage,
    }
    const texts = { name, company, phone, message }

    const [errorProperty, setErrorProperty] = useState('')
    const [formError, setFormError] = useState('')

    const validateText = useCallback(
        (property, value, isRequired) => {
            if (isRequired && value.length < 4) {
                setFormError('4 characters minimum.')
                setErrorProperty(property)
                return false
            } else if (errorProperty === property) {
                setFormError('')
                setErrorProperty('')
            }
            return true
        },
        [errorProperty]
    )

    const updateText = useCallback(
        (event) => {
            event.preventDefault()
            event.stopPropagation()
            const property = event.target.dataset.property
            const text = event.target.value
            setText[property](text)
            const required = Boolean(event.target.required)
            validateText(property, text, required)
        },
        [validateText]
    )

    const debouncedUpdateText = useMemo(
        () => debounce(updateText, 500),
        [updateText]
    )

    const validateEmail = useCallback(
        (email) => {
            if (email.length < 4) {
                setFormError('4 characters minimum.')
                setErrorProperty('email')
                return false
            } else if (!validateEmailRegex.test(email)) {
                setFormError('Enter valid email')
                setErrorProperty('email')
                return false
            } else if (errorProperty === 'email') {
                setFormError('')
                setErrorProperty('')
            }
            return true
        },
        [errorProperty]
    )

    const updateEmail = useCallback(
        (event) => {
            event.preventDefault()
            event.stopPropagation()
            const email = event.target.value
            setEmail(email)
            validateEmail(email)
        },
        [validateEmail]
    )

    const debouncedUpdateEmail = useMemo(
        () => debounce(updateEmail, 500),
        [updateEmail]
    )

    const sendMessage = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        const emailIsValid = validateEmail(email)
        if (!emailIsValid) {
            return
        }
        const textsProperties = Object.keys(texts)

        for (let idx = 0; idx < textsProperties.length; idx++) {
            const property = textsProperties[idx]
            const isRequired = requiredTexts.includes(property)
            const textIsValid = validateText(
                property,
                texts[property],
                isRequired
            )
            if (!textIsValid) {
                return
            }
        }
        if (isSending) {
            return false
        }
        // Bots fill in the hidden "botcheck" field; real visitors never see it
        if (event.target.form?.botcheck?.checked) {
            return
        }
        setIsSending(true)
        const [sendError] = await Mail.send({
            name,
            email,
            company,
            phone,
            message,
        })
        setIsSending(false)
        if (sendError) {
            setSentError(sendError)
        } else {
            setIsSent(true)
        }
    }

    return html` <style>
            ${inputStyles} .contact-title {
                margin: 1rem 0 0.8rem;
                font-family: var(--font-serif);
                font-size: clamp(2.8rem, 2.2rem + 1.4vw, 3.6rem);
                font-weight: 600;
                line-height: 1.2;
                color: var(--c-text);
            }
            .contact-lead {
                margin: 0 0 3.2rem;
                color: var(--c-text-muted);
            }
            form.contact-form {
                max-width: 60rem;
                margin-bottom: 5rem;
                padding: clamp(2.4rem, 4vw, 3.6rem);
                border: 1px solid var(--c-border);
                border-radius: var(--radius);
                background: var(--c-surface);
                box-shadow: var(--shadow-sm);
            }
            form.contact-form label {
                display: inline-block;
                margin: 0;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--c-text);
            }
            form.contact-form .error {
                margin-left: 0.8rem;
                font-family: var(--font-sans);
                font-size: 1.3rem;
                color: var(--c-danger);
            }
            form.contact-form .required:after {
                color: var(--c-brand);
                content: ' *';
            }
            form.contact-form .botcheck {
                display: none;
            }
            form.contact-form .actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 1.2rem;
                margin-top: 0.8rem;
            }
            form.contact-form button.green,
            form.contact-form button.green:disabled {
                background-color: var(--c-success);
                color: #fff;
                opacity: 1;
            }
            form.contact-form button.red,
            form.contact-form button.red:disabled {
                background-color: var(--c-danger);
                color: #fff;
                opacity: 1;
            }
            .page-links {
                padding: 2rem 0 0;
                border-top: 1px solid var(--c-border);
                max-width: 60rem;
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
        </style>
        <${Page}
            title="Leukistic Bald Eagle"
            subtitle=""
            description="This eagle has a pale coloration on his feathers, the cause of this is unknown. But the colors of his feet and eyes are normal, and his health status is normal. ~Photo: 2020 The Journal of the San Juan Islands"
            sidebarImage=${prefixUriIfNeeded('/assets/white_bald_eagle.jpg')}
        >
            <h1 class="contact-title">Get in touch</h1>
            <p class="contact-lead">Contact us for further inquiries.</p>
            <form class="contact-form">
                <input
                    type="checkbox"
                    name="botcheck"
                    class="botcheck"
                    tabindex="-1"
                    autocomplete="off"
                    aria-hidden="true"
                />
                <div>
                    <label for="name" class="required"> Your name </label>
                    ${errorProperty === 'name' &&
                    html` <span class="error"> ${formError} </span> `}
                    <${BaseInput}
                        value=${name.value}
                        name="name"
                        placeholder="Jack Smith"
                        onInput=${debouncedUpdateText}
                        className="input-base ${errorProperty === 'name'
                            ? 'input-error'
                            : ''}"
                        required
                    />
                </div>
                <div>
                    <label for="email" class="required"> Your email </label>
                    ${errorProperty === 'email' &&
                    html` <span class="error"> ${formError} </span> `}
                    <${BaseInput}
                        value=${email.value}
                        name="email"
                        placeholder="example@mail.com"
                        type="email"
                        onInput=${debouncedUpdateEmail}
                        className="input-base ${errorProperty === 'email'
                            ? 'input-error'
                            : ''}"
                        required
                    />
                </div>
                <div>
                    <label for="company"> Company </label>
                    ${errorProperty === 'company' &&
                    html` <span class="error"> ${formError} </span> `}
                    <${BaseInput}
                        value=${company.value}
                        name="company"
                        placeholder="Example Corporation"
                        onInput=${debouncedUpdateText}
                        className="input-base ${errorProperty === 'company'
                            ? 'input-error'
                            : ''}"
                    />
                </div>
                <div>
                    <label for="phone"> Phone number </label>
                    ${errorProperty === 'phone' &&
                    html` <span class="error"> ${formError} </span> `}
                    <${BaseInput}
                        value=${phone.value}
                        name="phone"
                        placeholder="+44778765439"
                        onInput=${debouncedUpdateText}
                        className="input-base ${errorProperty === 'phone'
                            ? 'input-error'
                            : ''}"
                    />
                </div>
                <div>
                    <label for="message" class="required"> Your message </label>
                    ${errorProperty === 'message' &&
                    html` <span class="error"> ${formError} </span> `}
                    <${BaseInput}
                        value=${message.value}
                        name="message"
                        placeholder="Hello, let's chat!"
                        Input="textarea"
                        onInput=${debouncedUpdateText}
                        className="input-base ${errorProperty === 'message'
                            ? 'input-error'
                            : ''}"
                        required
                    />
                </div>
                <div class="actions">
                <${SubmitButton}
                    isSending=${isSending}
                    isSent=${isSent}
                    formError=${formError}
                    sentError=${sentError}
                    sendMessage=${sendMessage}
                />
                </div>
            </form>
            <nav class="page-links">
                <a
                    href="${prefixUriIfNeeded('/about')}"
                    class="contact"
                    onClick=${avoidReload}
                >
                    About
                </a>
            </nav>
        <//>`
}

const SubmitButton = ({
    isSending,
    isSent,
    formError,
    sentError,
    sendMessage,
}) => {
    const isDisabled = isSending || isSent || formError || sentError
    let message = 'Send message'
    let colorClass = ''
    if (formError) {
        message = 'Invalid form'
    } else if (isSending) {
        message = 'Sending...'
    } else if (sentError) {
        message = 'Failed to send message'
        colorClass = 'red'
    } else if (isSent) {
        message = 'Message sent!'
        colorClass = 'green'
    }
    return html`<button
            class="base button ${colorClass}"
            type="submit"
            onClick=${sendMessage}
            disabled=${isDisabled}
        >
            ${isSending &&
            html`<${Spinner}
                stroke="currentColor"
                height=${18}
                width=${18}
            />`}${message}</button
        >${sentError && html` <span class="error"> ${sentError} </span> `}`
}
