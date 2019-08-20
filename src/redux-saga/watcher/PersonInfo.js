import { takeEvery, put, call } from 'redux-saga/effects';
import { _get } from '../../service/base-api';
import { PERSON_INFO } from '../../redux/const/person-data';
import { fullProfile } from '../../service/api/private.api';
import { CALL_DATA } from '../actionCreator/PersonInfo';
import { candicates_host } from '../../environment/development';
import { authHeaders } from '../../service/auth';

function* getPersonInfo() {
    try {
        let res = yield call(callData);
        let data = res.data
        let personal_info = {
            firstName: '',
            lastName: '',
            status: '',
            birthday: 0,
            gender: '',
            address: '',
            email: '',
            phone: '',
            identityCard: '',
            avatarUrl: '',
            coverUrl: '',
            name: '',
            lat: '',
            lon: '',
            isLookingForJob: false
        };

        const d = new Date();
        const n = d.getTime();
        let param = n;
        // description
        let description = data.description;
        //personal_info
        personal_info.avatarUrl = data.avatarUrl + `?param=${param}`;
        personal_info.phone = data.phone;
        personal_info.email = data.email;
        personal_info.firstName = data.firstName;
        personal_info.lastName = data.lastName;
        personal_info.gender = data.gender;
        personal_info.address = data.address;
        personal_info.identityCard = data.identityCard;
        personal_info.birthday = data.birthday;
        personal_info.lat = data.lat;
        personal_info.lon = data.lon;
        personal_info.coverUrl = data.coverUrl;
        personal_info.isLookingForJob = data.isLookingForJob;
        // skills
        let skills = data.skills;
        // education
        let educations = data.educations;
        // experiences
        let experiences = data.experiences;
        // languageSkills
        let language_skills = [];
        language_skills = data.languageSkills;
        let rating = data.rating;

        yield put({
            type: PERSON_INFO,
            personal_info,
            skills,
            educations,
            description,
            experiences,
            language_skills,
            rating
        });

    } catch (err) {
        throw err;
    }
}

function callData() {
    let data = _get(null, fullProfile, candicates_host, authHeaders);

    return data;
}

// Watcher
export function* PersonInfoWatcher() {
    yield takeEvery(CALL_DATA, getPersonInfo);
}   