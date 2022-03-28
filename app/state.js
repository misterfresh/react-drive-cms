import { getActiveItemId, getPageName } from './utils/path.js'

export const initialState = {
    isFetching: {
        categories: false,
    },
    categories: {},
    articles: {},
    texts: {},
    menuVisible: !(typeof window !== 'undefined' && window.innerWidth < 769),
    activePanel: 'posts',
    pageName: getPageName(),
    activeItemId: getActiveItemId(),
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'URI_CHANGE':
            return {
                ...state,
                pageName: action?.pageName,
                activeItemId: action?.activeItemId,
            }
        case 'REQUEST_CATEGORIES':
            return {
                ...state,
                isFetching: {
                    ...state.isFetching,
                    categories: true,
                },
            }

        case 'RECEIVE_CATEGORIES':
            return {
                ...state,
                isFetching: {
                    ...state.isFetching,
                    categories: false,
                },
                categories: {
                    ...action.categories,
                },
                articles: {
                    ...state.articles,
                    ...action.articles,
                },
            }

        case 'REQUEST_ARTICLE':
            return {
                ...state,
                isFetching: {
                    ...state.isFetching,
                    [action.articleId]: true,
                },
            }

        case 'RECEIVE_ARTICLE':
            return {
                ...state,
                isFetching: {
                    ...state.isFetching,
                    [action.articleId]: false,
                },
                texts: {
                    ...state.texts,
                    [action.articleId]: action.articleHtml,
                },
            }

        case 'TOGGLE_MENU_VISIBLE':
            return {
                ...state,
                menuVisible: !state.menuVisible,
            }

        case 'SET_ACTIVE_PANEL':
            return {
                ...state,
                activePanel: action.selectedPanel,
            }

        default:
            return state
    }
}
