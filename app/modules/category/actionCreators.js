import { REQUEST_CATEGORIES, RECEIVE_CATEGORIES } from './actionTypes.js'
import { shouldFetchCategories } from './selectors.js'
import { Drive } from '../../lib/drive.js'

export async function fetchCategoriesIfNeeded() {
    return (dispatch, getState) => {
        let state = getState()

        if (shouldFetchCategories(state)) {
            return fetchCategories(dispatch)
        }
    }
}

export async function fetchCategories(dispatch) {
    dispatch(requestCategories())
    const [fetchCategoriesError, categories] = await Drive.getCategories()
    if (fetchCategoriesError) {
        console.log(
            'code:',
            fetchCategoriesError.code,
            ' message:',
            fetchCategoriesError.message
        )
        return
    }
    dispatch(receiveCategories(categories))
}

export function requestCategories() {
    return {
        type: REQUEST_CATEGORIES,
    }
}

export function receiveCategories(categories) {
    return {
        type: RECEIVE_CATEGORIES,
        categories,
    }
}
