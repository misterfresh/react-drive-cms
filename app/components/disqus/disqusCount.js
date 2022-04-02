import { html, useEffect, useState } from '../../lib/htm-preact.js'
import { to } from '../../utils/to.js'

const conf = window.appConf
const DISQUS_COUNT_URL = `https://${conf.shortname}.disqus.com/count.js`

export const DisqusCount = ({ categories }) => {
    const [disqusCountScript, setDisqusCountScript] = useState(null)

    const loadDisqusCountScript = async () => {
        const [loadError, loadedScript] = await to(
            new Promise(function (resolve, reject) {
                const head = document.getElementsByTagName('head')[0]
                const script = document.createElement('script')

                script.type = 'text/javascript'
                script.addEventListener('load', function (scriptData) {
                    resolve(scriptData)
                })
                script.defer = true
                script.className = 'disqus-count-script'
                script.src = DISQUS_COUNT_URL
                head.appendChild(script)
            })
        )
        if (loadError) {
            console.log('failed loading disqus count script', loadError)
        } else {
            setDisqusCountScript(loadedScript)
        }
    }
    const removeDisqusCountScript = () => {
        if (disqusCountScript && disqusCountScript.parentNode) {
            disqusCountScript.parentNode.removeChild(disqusCountScript)
            setDisqusCountScript(null)
        }
    }

    useEffect(async () => {
        window.disqus_shortname = conf.shortname
        if (typeof window.DISQUSWIDGETS !== 'undefined') {
            window.DISQUSWIDGETS = undefined
        }
        if (Object.values(categories).length) {
            await loadDisqusCountScript()
        }

        return removeDisqusCountScript
    }, [categories])

    return html`<span id="disqus-comments-count" />`
}
