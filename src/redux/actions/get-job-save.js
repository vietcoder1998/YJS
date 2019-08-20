import { GET_JOB_SAVE } from "../const/jobSave";

export const getJobSave = (data) => {
    return {
        type: GET_JOB_SAVE,
        data
    }
}