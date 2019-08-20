import {GET_NOTI} from '../const/noti';
let initNoti = {}

export const handleNoti = (state= initNoti, action) => {
    switch (action.type) {
        case GET_NOTI:
            return {...action.data }
    
        default:
            return state;
    }
}