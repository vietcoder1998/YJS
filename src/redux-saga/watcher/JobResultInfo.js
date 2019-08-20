import { takeEvery, put, call } from 'redux-saga/effects';
import { GET_JOB_RESULT_DATA } from '../actionCreator/JobResult';
import { _requestToServer } from '../../service/exec';
import { POST } from '../../const/method';
import { find_job } from '../../service/api/public.api';
import { public_host, candicates_host } from '../../environment/development';
import { noInfoHeader, authHeaders } from '../../service/auth';
import { GET_JOB_RESULT } from '../../redux/const/jobResult';
import { store } from '../../redux/store/store';
import { jobController } from '../../service/api/private.api';


function* getListJobResultData(action) {
    let res = yield call(callJobResultData, action);
    if (res.code === 200) {
        let data = res.data;
        yield put({ type: GET_JOB_RESULT, data });
    }
}

function callJobResultData(action) {
    try {
        let data_dto = {
            employerID: null,
            excludedJobIDs: null,
            priority: 'NORMAL',
            excludePriority: null,
            shuffle: true,
            jobNameID: null,
            jobGroupID: null,
            jobType: null,
            jobShiftFilter: null,
            jobLocationFilter: null
        };

        let data_local = JSON.parse(localStorage.getItem('searchData'));
        let data = data_local  ? data_local : data_dto;

        let isAuthen = store.getState().handleAuthState.isAuthen;
        console.log(action.pageIndex)
        let res = _requestToServer(POST, data, (isAuthen ? jobController + '/active' : find_job) + `?pageIndex=${action.pageIndex}&pageSize=${10}`, isAuthen ? candicates_host : public_host, isAuthen ? authHeaders : noInfoHeader);
        return res
    } catch (err) {
        throw err
    }

}

export function* JobResultWatcher() {
    yield takeEvery(GET_JOB_RESULT_DATA, getListJobResultData)
}