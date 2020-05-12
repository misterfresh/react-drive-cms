import { CALL_HISTORY_METHOD } from './actionTypes.js'

import { getLocation, getQuery } from './selectors.js'

/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */

function updateLocation(method) {
    return (...args) => ({
        type: CALL_HISTORY_METHOD,
        location: { method, args },
    })
}

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = updateLocation('push')
export const replace = updateLocation('replace')
export const go = updateLocation('go')
export const goBack = updateLocation('goBack')
export const goForward = updateLocation('goForward')

export const routerActions = { push, replace, go, goBack, goForward }

export function updateQuery(property, value) {
    return (dispatch, getState) => {
        let state = getState()
        let query = getQuery(state)
        let location = getLocation(state)
        let entityType = getActiveEntityType(state)
        let queryValue = query[property]
        let label = ''

        if (!!value && typeof value === 'object') {
            label = value.label
            console.log('label is', label)
            value = value.value
        }
        if (!!value && (!queryValue || queryValue !== value)) {
            query = { ...query, [property]: value }
        } else {
            query = { ...query }
            delete query[property]
        }

        let requestQuery = serializeQuery(query)
        console.log({ reqqqqq: requestQuery, enttttt: entityType })
        return Promise.resolve(true)
            .then((chained) =>
                dispatch(
                    push({
                        pathname: location.pathname,
                        query,
                        search: requestQuery,
                        state: { ...location.state, label },
                    })
                )
            )
            .then((updated) =>
                dispatch(
                    fetchEntityQueryIfNeeded(requestQuery, entityType, true)
                )
            )
    }
}
