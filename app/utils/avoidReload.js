const conf = window.appConf

export const avoidReload = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const href = event?.target?.closest('a')?.href
    if (href) {
        let formattedHref = href
        if(!href.startsWith('http')){
            formattedHref = window.location.origin + (window.location.origin.includes('localhost') ? '' : `/${conf.root}`) + href
        }
        history.pushState({ url: formattedHref }, '', formattedHref)
        window.dispatchEvent(new PopStateEvent('popstate', {}))
    }
}
