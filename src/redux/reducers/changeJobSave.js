import { GET_JOB_SAVE } from "../const/jobSave";

let initJobSave = {}

export const handleGetJobSave = (state = initJobSave, action) => {
    switch (action.type) {
        case GET_JOB_SAVE:
            return {...action.data}
    
        default:
            return state;
    }
}