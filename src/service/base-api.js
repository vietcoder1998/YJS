import axios from 'axios';
import { candicates_host } from '../environment/development';
import { store } from '../redux/store/store';
import { openPopup } from '../redux/actions/popup.state';
import { authHeaders } from './auth';
// import { store } from 'react-redux';


// POST
export const _post = async (data, api, another_host, headers) => {
    try {

        let host = candicates_host;
        
        if (another_host) {
            host = another_host
        }

        let requestURL = host + api;

        if (headers === null  || headers === undefined) {
            headers = authHeaders;
        }

        let response = await axios.post(requestURL, data, { headers });
        if (response.data.code === 200) {
            return response.data
        }

        if (response.data.code === 404) {
            return
        }

        return response.data
    } catch (err) {
        throw err;
    }
};

//GET
export const _get = async (params, api, another_host, headers) => {
    try {
        let host = candicates_host;

        if (another_host) {
            host = another_host
        }

        if (headers === null || headers === undefined) {
            headers = authHeaders
        }

        let requestURL = host + api;
        let response = await axios.get(requestURL, { params: params, headers });

        if (response.data.code === 200) {
            return response.data
        } else {
            return store.dispatch(openPopup('Phiên đăng nhập hết hạn'));
        }
    } catch (err) {
        throw err;
    }
};

// DELETE
export const _delete = async (data, api, another_host, headers) => {
    try {

        let host = candicates_host;
        if (another_host) {
            host = another_host;
        }

        if (headers === null  || headers === undefined){
            headers = authHeaders
        }

        let requestURL = host + api;
        let response = await axios.delete(requestURL, { data: JSON.stringify(data), headers });
        if (response.data.code === 200) {
            return response.data;
        }

        if (response.data.code === 404) {
            return
        }
    } catch (err) {
        throw err;
    }
};


// PUT
export const _put = async (data, api, another_host, headers) => {
    try {
        let host = candicates_host;
        if (another_host) {
            host = another_host
        }

        if (headers === null || headers === undefined){
            headers = authHeaders
        }

        let requestURL = host + api;
        let response = await axios.put(requestURL, data, { headers });
        if (response.data.code === 200) {
            return response.data;
        }
        if (response.data.code === 404) {
            return
        }
    } catch (err) {
        throw err;
    }
};
