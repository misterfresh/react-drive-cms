import { useEffect } from '../lib/htm-preact.js'

export const usePageMeta = (title, subtitle) => {
    useEffect(() => {
        document.title = title
            ? `${title} - The Purple Club` /***********changed name******************/
            : 'The Purple Club'
    }, [title])

    useEffect(() => {
        document
            ?.querySelector('meta[name="description"]')
            ?.setAttribute('content', subtitle)
    }, [subtitle])
}
