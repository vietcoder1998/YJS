
import { GET_EMPLOYER_MORE_JOB } from './../const/employerMoreJob';

export const getEmployerMoreJob = (data) => {
    return {
        type: GET_EMPLOYER_MORE_JOB,
        data
    }
}