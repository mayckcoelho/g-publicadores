import { TOGGLE_COLLAPSED } from './topbarActions'

const INITIAL_STATE = { collapse: false }

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TOGGLE_COLLAPSED:
            return { ...state, collapse: !state.collapse }
        default:
            return state
    }
}