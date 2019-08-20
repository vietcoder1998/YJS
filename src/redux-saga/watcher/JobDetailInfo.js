import { takeEvery, call } from 'redux-saga/effects';
import { GET } from './../../const/method';
import { job_detail } from '../../service/api/public.api';
import { GET_JOB_DETAIL_DATA } from '../actionCreator/JobDetail';
import { GET_JOB_DETAIL } from './../../redux/const/jobDetail';
import { _requestToServer } from '../../service/exec';
import { public_host, candicates_host } from './../../environment/development';
import { noInfoHeader, authHeaders } from '../../service/auth';
import { store } from '../../redux/store/store';
import { jobController } from '../../service/api/private.api';
import { GET_EMPLOYER_DETAIL_DATA } from '../actionCreator/EmployerDetail';
import { GET_EMPLOYER_MORE_JOB_DATA } from '../actionCreator/EmployerMoreJob';


function* getJobDetailData(action) {
    yield call(callJobDetailtData, action);

}

// Call JobDetailData
function callJobDetailtData(action) {
    let isAuthen = store.getState().handleAuthState.isAuthen;
    var data = {}

    _requestToServer(
        GET,
        null,
        (isAuthen ? jobController : job_detail) + `/${action.jobID}`,
        isAuthen ? candicates_host : public_host, isAuthen ? authHeaders : noInfoHeader)
        .then((res) => {
            data = res.data;
            store.dispatch({type: GET_JOB_DETAIL, data});
            console.log(data.employerID)
            store.dispatch({type: GET_EMPLOYER_DETAIL_DATA, employerID: data.employerID});
            store.dispatch({type: GET_EMPLOYER_MORE_JOB_DATA, })
        }).catch((err) => {
            throw err
        });
    return data
}

export function* JobDetailWatcher() {
    yield takeEvery(GET_JOB_DETAIL_DATA, getJobDetailData);
}