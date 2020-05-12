import { html, Component } from '../../deps/react.js'
import { StyleSheet, css } from '../../deps/aphrodite.js'
import { Link } from '../../deps/react-router-dom.js'
import { connect } from '../../deps/react-redux.js'

import { bindActionCreators } from '../../deps/redux.js'
import { getLocation } from '../modules/route/selectors.js'
import BaseInput from '../components/form/baseInput.js'
import Page from '../components/layout/page.js'
import input from '../styles/input.js'
import buttons from '../styles/buttons.js'
import Mail from '../lib/mail.js'
import resolveAsset from '../utils/resolveAsset.js'

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
        this.validateEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
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

    sendMessage(e) {
        e.preventDefault()
        e.stopPropagation()
        let { values } = this.state
        this.setState(
            {
                sent: true,
            },
            () => {
                let formatted = {}
                Object.keys(values).forEach((key) => {
                    formatted[key] = values[key]['value']
                })

                Mail.send(formatted)
            }
        )
    }

    render() {
        let { name, email, company, phone, message } = this.state.values
        let { valid, sent } = this.state

        return html`
            <${Page}
                title="Contact"
                subtitle="Get in touch with us"
                description=""
                sidebarImage=${resolveAsset('/assets/default-contact.jpg')}
            >
                <h3 className=${css(styles.title)}>Send me an email</h3>
                <form className=${css(styles.form)}>
                    <div>
                        <label
                            for="name"
                            className=${css(styles.label, styles.required)}
                        >
                            Your name
                        </label>
                        ${name.error &&
                        html`
                            <span className=${css(styles.error)}>
                                ${name.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${name.value}
                            name="name"
                            placeholder="Jack Smith"
                            onInput=${this.updateFormProperty}
                            className=${css(
                                input.base,
                                name.error && input.error
                            )}
                        />
                    </div>
                    <div>
                        <label
                            for="email"
                            className=${css(styles.label, styles.required)}
                        >
                            Your email
                        </label>
                        ${email.error &&
                        html`
                            <span className=${css(styles.error)}>
                                ${email.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${email.value}
                            name="email"
                            placeholder="example@mail.com"
                            type="email"
                            onInput=${this.updateFormProperty}
                            className=${css(
                                input.base,
                                email.error && input.error
                            )}
                        />
                    </div>
                    <div>
                        <label for="company" className=${css(styles.label)}>
                            Company
                        </label>
                        ${company.error &&
                        html`
                            <span className=${css(styles.error)}>
                                ${company.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${company.value}
                            name="company"
                            placeholder="Example Corporation"
                            onInput=${this.updateFormProperty}
                            className=${css(
                                input.base,
                                company.error && input.error
                            )}
                        />
                    </div>
                    <div>
                        <label for="phone" className=${css(styles.label)}>
                            Phone number
                        </label>
                        ${phone.error &&
                        html`
                            <span className=${css(styles.error)}>
                                ${phone.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${phone.value}
                            name="phone"
                            placeholder="+44778765439"
                            onInput=${this.updateFormProperty}
                            className=${css(
                                input.base,
                                phone.error && input.error
                            )}
                        />
                    </div>
                    <div>
                        <label
                            for="message"
                            className=${css(styles.label, styles.required)}
                        >
                            Your message
                        </label>
                        ${message.error &&
                        html`
                            <span className=${css(styles.error)}>
                                ${message.error}
                            </span>
                        `}
                        <${BaseInput}
                            value=${message.value}
                            name="message"
                            placeholder="Hello, let's chat!"
                            Component="textarea"
                            onInput=${this.updateFormProperty}
                            className=${css(
                                input.base,
                                message.error && input.error
                            )}
                        />
                    </div>

                    ${valid && !sent
                        ? html` <button
                              className=${css(buttons.base, styles.button)}
                              onClick=${this.sendMessage}
                          >
                              Send Message
                          </button>`
                        : html` <button
                              className=${css(
                                  buttons.base,
                                  buttons.disabled,
                                  styles.button
                              )}
                          >
                              ${sent ? 'Message sent !' : 'Form incomplete'}
                          </button>`}
                </form>
                <footer className=${css(styles.footer)}>
                    <${Link} to="/about" className=${css(styles.contact)}>
                        About
                    <//>
                </footer>
            <//>
        `
    }
}

function mapStateToProps(state) {
    return {
        location: getLocation(state),
    }
}

function mapDispatchToProps(dispatch) {
    return Object.assign(bindActionCreators({}, dispatch), { dispatch })
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact)

let styles = StyleSheet.create({
    title: {
        fontSize: '2.6rem',
        marginTop: '20px',
        fontFamily: 'inherit',
        fontWeight: 500,
        lineHeight: '1.1',
        color: 'inherit',
        marginBottom: '10px',
    },

    label: {
        fontSize: '2rem',
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        fontWeight: 700,
        margin: '15px 0 0',
    },
    button: {
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
    },
    error: {
        color: 'red',
    },
    required: {
        ':after': {
            color: 'red',
            content: '" *"',
        },
    },
    footer: {
        padding: '10px 0',
        fontSize: '1.4rem',
        letterSpacing: '1px',
        fontWeight: 700,
        fontFamily: '"Source Sans Pro",Helvetica,Arial,sans-serif',
        textTransform: 'uppercase',
    },
    contact: {
        textDecoration: 'none',
        backgroundColor: 'transparent',
        color: '#999',
        borderBottom: 'none',
        fontSize: '1.4rem',
        ':hover': {
            textDecoration: 'none',
            backgroundColor: 'transparent',
            color: '#333',
            outline: 0,
            transition: 'all .4s',
            borderBottom: 'none',
        },
    },
    form: {
        marginBottom: '5rem',
    },
})
