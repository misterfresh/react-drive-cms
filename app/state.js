export const initialState = {
    isFetching: {
        categories: false,
    },
    categories: {},
    articles: {},
    texts: {},
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
                    ...action.categories.categories,
                },
                articles: {
                    ...state.articles,
                    ...action.categories.articles,
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
                    [action.articleId]: action.article,
                },
            }

        default:
            return state
    }
}
