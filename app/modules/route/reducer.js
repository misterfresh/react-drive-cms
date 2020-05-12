import { LOCATION_CHANGE } from './actionTypes.js'

const initialState = {
    location: {
        pathname: '/',
        query: {},
        search: '',
    },
}

export default function route(state = initialState, action) {
    //console.log('route reducer')
    switch (action.type) {
        case LOCATION_CHANGE:
            let location = { ...action.location }
            if (
                !!location &&
                !!location.search &&
                (!location.query || !Object.keys(location.query).length)
            ) {
                let search = location.search.slice(1)
                location.query = JSON.parse(
                    '{"' +
                        decodeURI(search.replace('+', ' '))
                            .replace(/"/g, '\\"')
                            .replace(/&/g, '","')
                            .replace(/=/g, '":"') +
                        '"}'
                )
            }
            return {
                ...state,
                location,
            }

        default:
            return state
    }
}
