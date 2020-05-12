import { html, Component } from '../../../deps/react.js'
const conf = window.appConf

export default class DisqusCount extends Component {
    constructor(props) {
        super(props)
        this.addDisqusScript = this.addDisqusScript.bind(this)
        this.removeDisqusScript = this.removeDisqusScript.bind(this)
    }

    addDisqusScript() {
        this.disqusCount = document.createElement('script')
        let child = this.disqusCount
        let parent =
            document.getElementsByTagName('head')[0] ||
            document.getElementsByTagName('body')[0]
        child.async = true
        child.type = 'text/javascript'
        child.src = `https://${conf.shortname}.disqus.com/count.js`
        parent.appendChild(child)
    }

    removeDisqusScript() {
        if (this.disqusCount && this.disqusCount.parentNode) {
            this.disqusCount.parentNode.removeChild(this.disqusCount)
            this.disqusCount = null
        }
    }

    componentDidMount() {
        window.disqus_shortname = conf.shortname
        if (typeof window.DISQUSWIDGETS !== 'undefined') {
            window.DISQUSWIDGETS = undefined
        }
        this.addDisqusScript()
    }

    componentWillUnmount() {
        this.removeDisqusScript()
    }

    render() {
        return html`<span id="disqus-comments-count" />`
    }
}
