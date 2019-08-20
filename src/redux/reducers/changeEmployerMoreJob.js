import { GET_EMPLOYER_MORE_JOB } from './../const/employerMoreJob';
let initMoreJob = {};

export const handleEmployerMoreJobDetail = (state = initMoreJob, action) => {
    switch (action.type) {
        case GET_EMPLOYER_MORE_JOB:
            return { ...action.data };

        default:
            return {...state};
    }
}