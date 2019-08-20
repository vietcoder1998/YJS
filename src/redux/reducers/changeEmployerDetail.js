import { GET_EMPLOYER_DETAIL } from './../const/employerDetail';

let initEmployerDetail = null

export const handleGetEmployerDetail = (state = initEmployerDetail, action) => {
    switch (action.type) {
        case GET_EMPLOYER_DETAIL:
            return { ...action.data}
    
        default:
            return {...state}
    }
}