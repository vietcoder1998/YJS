import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../service/exec';
import {GET } from '../../const/method';
import { candicates_host } from '../../environment/development';
import {  authHeaders } from '../../service/auth';
import { saveJobController } from '../../service/api/private.api';
import { GET_JOB_SAVE } from '../../redux/const/jobSave';
import { GET_JOB_SAVE_DATA } from '../actionCreator/JobSaveDetail';


function* getListJobSaveData(action) {
    let res = yield call(callJobSaveData, action);
    if (res.code === 200) {
        console.log(res.data)
        let data = res.data;
        yield put({ type: GET_JOB_SAVE, data });
    }
}

function callJobSaveData(action) {
    try {
        let res = _requestToServer(GET, {pageIndex: action.pageIndex, pageSize: 10} , saveJobController , candicates_host, authHeaders )
        return res
    } catch (err) {
        throw err
    }

}

export function* JobSaveWatcher() {
    yield takeEvery(GET_JOB_SAVE_DATA, getListJobSaveData)
}