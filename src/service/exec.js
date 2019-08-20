import { GET, POST, PUT, DELETE } from '../const/method';
import { _delete, _get, _post, _put } from './base-api';

export const _requestToServer = async (method, data, api, host, headers) => {
    let res;
    try {
        switch (method) {
            case GET:
                res = await _get(data, api, host, headers);
                break
            case POST:
                res = await _post(data, api, host, headers);
                break;
            case PUT:
                res = await _put(data, api, host, headers);
                return res;
            case DELETE:
                res = await _delete(data, api, host, headers);
                return res;
            default:
                break;
        }
        return res;
    } catch (err) {
        throw err;
    }
}