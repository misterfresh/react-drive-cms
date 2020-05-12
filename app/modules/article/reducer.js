import { REQUEST_ARTICLE, RECEIVE_ARTICLE } from './actionTypes.js'
import { RECEIVE_CATEGORIES } from '../../modules/category/actionTypes.js'

export default function article(state = initialState, action) {
    switch (action.type) {
        case REQUEST_ARTICLE:
            return {
                ...state,
                isFetching: {
                    ...state.isFetching,
                    [action.articleId]: true,
                },
            }

        case RECEIVE_ARTICLE:
            return {
                ...state,
                isFetching: {
                    ...state.isFetching,
                    [action.articleId]: false,
                },
                fetched: {
                    ...state.fetched,
                    [action.articleId]: true,
                },
                texts: {
                    ...state.texts,
                    [action.articleId]: action.article,
                },
            }

        case RECEIVE_CATEGORIES:
            return {
                ...state,
                articles: {
                    ...state.articles,
                    ...action.categories.articles,
                },
            }

        default:
            return state
    }
}

const initialState = {
    isFetching: {},
    fetched: {},
    articles: {},
    texts: {},
}
