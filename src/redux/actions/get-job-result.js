import {GET_JOB_RESULT} from '../const/jobResult';

export const getJobResult = (data) => {
    return {
        type: GET_JOB_RESULT,
        data
    }
}