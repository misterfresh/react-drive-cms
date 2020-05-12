import { combineReducers } from '../../../deps/redux.js'

import route from '../../modules/route/reducer.js'
import article from '../../modules/article/reducer.js'
import category from '../../modules/category/reducer.js'

const rootReducer = combineReducers({
    article,
    category,
    route,
})

export default rootReducer
