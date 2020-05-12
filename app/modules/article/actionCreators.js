import { REQUEST_ARTICLE, RECEIVE_ARTICLE } from './actionTypes.js'
import { shouldFetchArticle } from './selectors.js'
import Drive from '../../lib/drive.js'

export function fetchArticleIfNeeded(articleId) {
    return (dispatch, getState) => {
        let state = getState()

        if (shouldFetchArticle(state, articleId)) {
            return fetchArticle(dispatch, articleId)
        }
    }
}

export function fetchArticle(dispatch, articleId) {
    dispatch(requestArticle(articleId))
    return Drive.getArticleHtml(articleId)
        .then((article) => {
            return dispatch(receiveArticle(articleId, article))
        })
        .catch(function (error) {
            console.log('code:', error.code, ' message:', error.message)
        })
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
