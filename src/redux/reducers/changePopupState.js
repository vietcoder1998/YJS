import { OPEN_POPUP, CLOSE_POPUP } from "../const/popup";

let initState = {
    data: {
        msg: '',
        type: ''
    },
    is_show: false
}

export const handlePopupState = (state = initState, action) => {
    switch (action.type) {
        case OPEN_POPUP:
            return { ...state, is_show: true, data: action.data };
        case CLOSE_POPUP:
            return { ...state, is_show: false};
        default:
            return state;
    }
}