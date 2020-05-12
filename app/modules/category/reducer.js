import { REQUEST_CATEGORIES, RECEIVE_CATEGORIES } from './actionTypes.js'

export default function category(state = initialState, action) {
    switch (action.type) {
        case REQUEST_CATEGORIES:
            return {
                ...state,
                isFetching: true,
            }

        case RECEIVE_CATEGORIES:
            return {
                ...state,
                isFetching: true,
                fetched: true,
                categories: {
                    ...action.categories.categories,
                },
            }

        default:
            return state
    }
}

const initialState = {
    isFetching: false,
    fetched: false,
    categories: {},
}
