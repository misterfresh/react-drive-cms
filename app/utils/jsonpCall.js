export default function jsonpCall(url, callback) {
    const handleJsonpResults =
        'handleJsonpResults_' +
        Date.now() +
        '_' +
        parseInt(Math.random() * 10000)

    window[handleJsonpResults] = function (json) {
        callback(json)

        const script = document.getElementById(handleJsonpResults)
        document.getElementsByTagName('head')[0].removeChild(script)
        delete window[handleJsonpResults]
    }

    const serviceUrl = `${url}${
        url.indexOf('?') > -1 ? '&' : '?'
    }callback=${handleJsonpResults}`

    const jsonpScript = document.createElement('script')
    jsonpScript.setAttribute('src', serviceUrl)
    jsonpScript.id = handleJsonpResults
    document.getElementsByTagName('head')[0].appendChild(jsonpScript)
}
