export const SET_DETAILS = 'SET_DETAILS';
export const SET_DETAIL_ID = 'SET_DETAIL_ID';

export const setDetails = details => dispatch => {
    dispatch({
        type: SET_DETAILS,
        payload: details,
    });
};

export const setDetailID = detailID => dispatch => {
    dispatch({
        type: SET_DETAIL_ID,
        payload: detailID,
    });
};