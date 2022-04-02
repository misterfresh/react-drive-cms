import { useEffect } from '../lib/htm-preact.js'

export const usePageMeta = (title, subtitle) => {
    useEffect(() => {
        document.title = title
            ? `${title} - React Drive CMS`
            : 'React Drive CMS'
    }, [title])

    useEffect(() => {
        document
            ?.querySelector('meta[name="description"]')
            ?.setAttribute('content', subtitle)
    }, [subtitle])
}
