import { GET_JOB_DETAIL } from './../const/jobDetail';

let initJobDetail = null;

export const handleGetJobDetail = (state = initJobDetail, action) => {
    switch (action.type) {
        case GET_JOB_DETAIL:
            return { ...action.data }
        default:
            return { ...state }
    }
}