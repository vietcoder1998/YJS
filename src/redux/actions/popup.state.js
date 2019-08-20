import { OPEN_POPUP, CLOSE_POPUP } from "../const/popup";

export function openPopup(data) {
    return {
        type: OPEN_POPUP,
        data
    }
}

export function closePopup(data) {
    return {
        type: CLOSE_POPUP,
        data
    }
}