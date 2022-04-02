import { getActiveItemId, getPageName } from './utils/path.js'

export const initialState = {
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

        default:
            return state
    }
}
