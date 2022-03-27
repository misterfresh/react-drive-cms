export const avoidReload = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const href = event?.target?.closest('a')?.href
    if (href) {
        history.pushState({ url: href }, '', href)
        window.dispatchEvent(new PopStateEvent('popstate', {}))
    }
}
