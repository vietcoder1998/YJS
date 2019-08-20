import { GET_HIGH_LIGHT_JOB } from "../const/highLight";

let initListHotJob = {
    data: {
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
        items: [],
    },
};

export const handleListHighLightResult = (state = initListHotJob, action) => {
    switch (action.type) {
        case GET_HIGH_LIGHT_JOB:
            return { ...state, data: action.data };
        default:
            return { ...state };
    }
}
