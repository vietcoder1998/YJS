import { GET_HOT_JOB } from "../const/hobJob";

let initListHotJob = {
    data: {
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
        items: [],
    },
};

export const handleListHotJobResult = (state = initListHotJob, action) => {
    switch (action.type) {
        case GET_HOT_JOB:
            return { ...state, data: action.data };
        default:
            return { ...state };
    }
}
