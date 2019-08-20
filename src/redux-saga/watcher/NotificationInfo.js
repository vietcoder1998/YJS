import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../service/exec';
import {GET } from '../../const/method';
import { candicates_host } from '../../environment/development';
import {  authHeaders } from '../../service/auth';
import { notiController } from '../../service/api/private.api';
import { GET_NOTI_INFO_DATA } from '../actionCreator/Noti';
import {GET_NOTI} from './../../redux/const/noti';


function* getListNotiData(action) {
    let res = yield call(callNotiData, action);
    if (res.code === 200) {
        console.log(res.data)
        let data = res.data;
        yield put({ type: GET_NOTI, data });
    }
}

function callNotiData(action) {
    try {
        let res = _requestToServer(GET, {pageIndex: action.pageIndex, pageSize: 10} , notiController , candicates_host, authHeaders )
        return res
    } catch (err) {
        throw err
    }

}

export function* notiInfoWatcher() {
    yield takeEvery(GET_NOTI_INFO_DATA, getListNotiData)
}