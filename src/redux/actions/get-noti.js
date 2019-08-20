import { GET_NOTI } from "../const/noti";

export const getNoti = (data) => {
    return {
        type: GET_NOTI,
        data
    }
}