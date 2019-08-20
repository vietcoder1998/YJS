import { GET_EMPLOYER_DETAIL } from "../const/employerDetail";

export const getEmployerDetail = (action) => {
    return {
        type: GET_EMPLOYER_DETAIL, 
        data: action.data
    }
}