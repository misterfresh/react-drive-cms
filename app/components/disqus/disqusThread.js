import { html, Component } from '../../../deps/react.js'
const conf = window.appConf

export default class DisqusThread extends Component {
    constructor() {
        super()
        this.addDisqusScript = this.addDisqusScript.bind(this)
        this.removeDisqusScript = this.removeDisqusScript.bind(this)
    }

    addDisqusScript() {
        let child = (this.disqus = document.createElement('script'))
        let parent =
            document.getElementsByTagName('head')[0] ||
            document.getElementsByTagName('body')[0]
        child.async = true
        child.type = 'text/javascript'
        child.src = '//' + conf.shortname + '.disqus.com/embed.js'
        parent.appendChild(child)
    }

    removeDisqusScript() {
        if (this.disqus && this.disqus.parentNode) {
            this.disqus.parentNode.removeChild(this.disqus)
            this.disqus = null
        }
    }

    componentDidMount() {
        let { id, title } = this.props
        window.disqus_shortname = conf.shortname
        window.disqus_identifier = id
        window.disqus_title = title
        window.disqus_url = window.location.href

        if (typeof window.DISQUS !== 'undefined') {
            window.DISQUS.reset({ reload: true })
        } else {
            this.addDisqusScript()
        }
    }

    componentWillUnmount() {
        this.removeDisqusScript()
    }

    render() {
        return html`<div id="disqus_thread" />`
    }
}
