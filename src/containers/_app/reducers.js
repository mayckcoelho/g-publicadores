import { combineReducers } from 'redux'

import topbarReducer from '../_layout/Topbar/topReducers'

const rootReducer = combineReducers({
    topbar: topbarReducer,
})

export default rootReducer