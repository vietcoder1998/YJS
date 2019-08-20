import {PersonInfoWatcher} from './watcher/PersonInfo';
import {all} from 'redux-saga/effects';
import { JobResultWatcher } from './watcher/JobResultInfo';
import { JobDetailWatcher } from './watcher/JobDetailInfo';
import { EmployerWatcher } from './watcher/EmployerInfo';
import { EmployerMoreJobWatcher } from './watcher/EmployerMoreJobInfo';
import { JobSaveWatcher } from './watcher/JobSaveInfo';
import { notiInfoWatcher } from './watcher/NotificationInfo';
import { HotJobWatcher } from './watcher/HotJobInfo';
import { HighLightJobWatcher } from './watcher/HighLightJobInfo';

export default function* rootSaga(){
    yield all([
        PersonInfoWatcher(),
        JobResultWatcher(),
        JobDetailWatcher(),
        EmployerWatcher(),
        EmployerMoreJobWatcher(),
        JobSaveWatcher(),
        notiInfoWatcher(),
        HotJobWatcher(),
        HighLightJobWatcher()
    ])
} 