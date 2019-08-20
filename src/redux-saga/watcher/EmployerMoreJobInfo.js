import { call, takeEvery } from 'redux-saga/effects';
import { _requestToServer } from '../../service/exec';
import { public_host } from '../../environment/development';
import { noInfoHeader } from '../../service/auth';
import { POST } from '../../const/method';
import { GET_EMPLOYER_MORE_JOB_DATA } from '../actionCreator/EmployerMoreJob';
import { find_job } from '../../service/api/public.api';
import { GET_EMPLOYER_MORE_JOB } from '../../redux/const/employerMoreJob';
import { store } from '../../redux/store/store';

function* getEmployerMoreJobData(action) {
    yield call(callEmployerMoreJobData, action);
}

// Call EmployerData
function callEmployerMoreJobData(action) {
    let employerID = store.getState().handleGetJobDetail.employerID;

    let dataSearch = {
        employerID,
        excludedJobIDs: null,
        priority: null,
        excludePriority: null,
        shuffle: false,
        jobNameID: null,
        jobGroupID: null,
        jobType: null,
        jobShiftFilter: null,
        jobLocationFilter: null
    }

    let pageIndex = 0;
    if (action.pageIndex) {
        pageIndex = action.pageIndex
    }

    _requestToServer(
        POST,
        dataSearch,
        find_job + `?pageIndex=${pageIndex}&pageSize=6`,
        public_host,
        noInfoHeader)
        .then((res) => {
            let data = res.data;
            console.log(res)
            store.dispatch({ type: GET_EMPLOYER_MORE_JOB, data })
        });
}

export function* EmployerMoreJobWatcher() {
    yield takeEvery(GET_EMPLOYER_MORE_JOB_DATA, getEmployerMoreJobData);
}