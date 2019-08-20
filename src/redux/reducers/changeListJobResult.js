import { GET_JOB_RESULT } from "../const/jobResult";

let data = {
    result: {
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
        items: [],
    },
};

export const handleListJobResult = (state = data, action) => {
    switch (action.type) {
        case GET_JOB_RESULT:
            return { ...state, result: action.data };
        default:
            return { ...state };
    }
}
