import { GET_JOB_DETAIL } from './../const/jobDetail';

export const getJobDetail = (data) => {
    return {
        type: GET_JOB_DETAIL,
        data
    }
}
