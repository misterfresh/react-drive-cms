import { combineReducers } from 'redux'

import route from 'route/reducer'
import article from 'article/reducer'
import category from 'category/reducer'

const rootReducer = combineReducers({
    article,
    category,
    route
})

export default rootReducer
