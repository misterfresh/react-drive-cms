import { REQUEST_ARTICLE, RECEIVE_ARTICLE } from './actionTypes.js'
import { shouldFetchArticle } from './selectors.js'
import { Drive } from '../../lib/drive.js'

export async function fetchArticleIfNeeded(articleId) {
    return (dispatch, getState) => {
        let state = getState()

        if (shouldFetchArticle(state, articleId)) {
            return fetchArticle(dispatch, articleId)
        }
    }
}

export async function fetchArticle(dispatch, articleId) {
    dispatch(requestArticle(articleId))
    const [getArticleError, article] = await Drive.getArticleHtml(articleId)
    if (getArticleError) {
        console.log(
            'code:',
            getArticleError.code,
            ' message:',
            getArticleError.message
        )
        return
    }
    dispatch(receiveArticle(articleId, article))
}

export function requestArticle(articleId) {
    return {
        type: REQUEST_ARTICLE,
        articleId,
    }
}

export function receiveArticle(articleId, article) {
    return {
        type: RECEIVE_ARTICLE,
        articleId,
        article,
    }
}
