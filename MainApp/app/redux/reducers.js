import { SET_DETAILS, SET_DETAIL_ID } from './action';

const initialState = {
    details: [],
    detailID: 1,
}

function detailReducer(state = initialState, action) {
    switch (action.type) {
        case SET_DETAILS:
            return { ...state, details: action.payload };
        case SET_DETAIL_ID:
            return { ...state, detailID: action.payload };
        default:
            return state;
    }
}

export default detailReducer;