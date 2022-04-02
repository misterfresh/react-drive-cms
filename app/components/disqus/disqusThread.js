import { html, useEffect, useState } from '../../lib/htm-preact.js'
import { to } from '../../utils/to.js'

const conf = window.appConf
const DISQUS_THREAD_URL = `//${conf.shortname}.disqus.com/embed.js`

export const DisqusThread = ({ articleId, articleTitle }) => {
    const [disqusThreadScript, setDisqusThreadScript] = useState(null)

    const loadDisqusThreadScript = async () => {
        const [loadError, loadedScript] = await to(
            new Promise(function (resolve, reject) {
                const head = document.getElementsByTagName('head')[0]
                const script = document.createElement('script')

                script.type = 'text/javascript'
                script.addEventListener('load', function (scriptData) {
                    resolve(scriptData)
                })
                script.defer = true
                script.className = 'disqus-thread-script'
                script.src = DISQUS_THREAD_URL
                head.appendChild(script)
            })
        )
        if (loadError) {
            console.log('failed loading disqus thread script', loadError)
        } else {
            setDisqusThreadScript(loadedScript)
        }
    }
    const removeDisqusThreadScript = () => {
        if (disqusThreadScript && disqusThreadScript.parentNode) {
            disqusThreadScript.parentNode.removeChild(disqusThreadScript)
            setDisqusThreadScript(null)
        }
    }

    useEffect(async () => {
        window.disqus_shortname = conf.shortname
        window.disqus_identifier = articleId
        window.disqus_title = articleTitle
        window.disqus_url = window.location.href

        if (typeof window.DISQUS !== 'undefined') {
            window.DISQUS.reset({ reload: true })
        } else {
            await loadDisqusThreadScript()
        }
        return removeDisqusThreadScript
    }, [articleId, articleTitle])

    return html`<div id="disqus_thread" />`
}
