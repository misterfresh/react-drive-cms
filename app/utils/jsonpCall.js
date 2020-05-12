export default function jsonpCall(url, callback) {
    let handleJsonpResults =
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

    let serviceUrl = `${url}${
        url.indexOf('?') > -1 ? '&' : '?'
    }callback=${handleJsonpResults}`
    //console.log('service', serviceUrl)
    const jsonpScript = document.createElement('script')
    jsonpScript.setAttribute('src', serviceUrl)
    jsonpScript.id = handleJsonpResults
    document.getElementsByTagName('head')[0].appendChild(jsonpScript)
}
