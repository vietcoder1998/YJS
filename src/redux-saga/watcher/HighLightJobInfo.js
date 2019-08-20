import { takeEvery, put, call } from 'redux-saga/effects';
import { _requestToServer } from '../../service/exec';
import { POST } from '../../const/method';
import { find_job } from '../../service/api/public.api';
import { public_host, candicates_host } from '../../environment/development';
import { noInfoHeader, authHeaders } from '../../service/auth';
import { store } from '../../redux/store/store';
import { jobController } from '../../service/api/private.api';
import { GET_HIGH_LIGHT_DATA } from '../actionCreator/HighLightJob';
import { GET_HIGH_LIGHT_JOB } from '../../redux/const/highLight';


function* getListHighLightJobData(action) {
    let res = yield call(callHighLightJobData, action);
    if (res.code === 200) {
        let data = res.data;
        yield put({ type: GET_HIGH_LIGHT_JOB, data });
    }
}

function callHighLightJobData(action) {
    try {
        let data = {
            employerID: null,
            excludedJobIDs: null,
            priority: 'HIGHLIGHT',
            excludePriority: null,
            shuffle: true,
            jobNameID: null,
            jobGroupID: null,
            jobType: null,
            jobShiftFilter: null,
            jobLocationFilter: null
          };
        let isAuthen = store.getState().handleAuthState.isAuthen;
        let pageIndex = action.pageIndex;

        if (pageIndex === null) {
            pageIndex = 0 
        }

        let res = _requestToServer(POST, data, (isAuthen ? jobController + '/active' : find_job) + `?pageIndex=${action.pageIndex}&pageSize=${7}`,isAuthen ? candicates_host : public_host , isAuthen ? authHeaders : noInfoHeader);
        return res
    } catch (err) {
        throw err
    }

}

export function* HighLightJobWatcher() {
    yield takeEvery(GET_HIGH_LIGHT_DATA, getListHighLightJobData)
}