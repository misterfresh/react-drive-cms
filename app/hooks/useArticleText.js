import { useEffect, useState } from '../lib/htm-preact.js'
import { Drive } from '../lib/drive.js'

export const useArticleText = (articleId) => {
    const [isFetching, setIsFetching] = useState({})
    const [texts, setTexts] = useState({})

    const article = texts?.[articleId] ?? ''
    const isFetchingArticle = isFetching?.[articleId]

    useEffect(async () => {
        if (!texts?.[articleId] && !isFetchingArticle) {
            setIsFetching({
                ...isFetching,
                [articleId]: true,
            })
            const [fetchArticleError, articleHtml] = await Drive.fetchArticle(
                articleId
            )
            if (fetchArticleError) {
                throw new Error(fetchArticleError)
            }
            setIsFetching({
                ...isFetching,
                [articleId]: false,
            })
            setTexts({
                ...texts,
                [articleId]: articleHtml,
            })

            document.getElementById('article-header')?.scrollIntoView()
        }
    }, [articleId, texts, isFetchingArticle])
    return article
}
