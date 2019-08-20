import { call, takeEvery } from 'redux-saga/effects';
import { GET } from '../../const/method';
import { GET_EMPLOYER_DETAIL_DATA } from '../actionCreator/EmployerDetail';
import { employer_detail } from '../../service/api/public.api';
import { _requestToServer } from '../../service/exec';
import { public_host } from '../../environment/development';
import { noInfoHeader } from '../../service/auth';
import { GET_EMPLOYER_DETAIL } from './../../redux/const/employerDetail';
import { store } from '../../redux/store/store';

function* getEmployerDetailData(action) {
    yield call(callEmployerData, action);
}

// Call EmployerData
function callEmployerData(action) {
    _requestToServer(GET, null, employer_detail + `/${action.employerID}`, public_host, noInfoHeader)
        .then((res) => {
            let data = res.data;
            store.dispatch({ type: GET_EMPLOYER_DETAIL, data })
        }).catch((err) => {
            console.log(err)
        });
}

export function* EmployerWatcher() {
    yield takeEvery(GET_EMPLOYER_DETAIL_DATA, getEmployerDetailData);
}