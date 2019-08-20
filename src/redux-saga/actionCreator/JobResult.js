export const GET_JOB_RESULT_DATA = 'GET_JOB_RESULT_DATA';
export function jobResult(paging) {
    return {
        type: GET_JOB_RESULT_DATA,
        paging
    }
}