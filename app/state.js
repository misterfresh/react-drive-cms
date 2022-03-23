export const initialState = {
    isFetching: {
        categories: false,
    },
    categories: {},
    articles: {},
    texts: {},
    menuVisible: !(typeof window !== 'undefined' && window.innerWidth < 769),
    activePanel: 'posts'
}

export const reducer = (state, action) => {
    switch (action.type) {
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
                    [action.article.id]: false,
                },
                texts: {
                    ...state.texts,
                    [action.article.id]: action.article,
                },
            }

        case 'TOGGLE_MENU_VISIBLE':
            return {
                ...state,
                menuVisible: !state.menuVisible
            }

        case 'SET_ACTIVE_PANEL':
            return {
                ...state,
                activePanel: action.selectedPanel
            }

        default:
            return state
    }
}
