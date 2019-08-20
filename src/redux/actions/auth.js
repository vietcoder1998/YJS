import { EXACT_AUTH, FAIL_AUTH } from "../const/authen";

export const exactAuthenticate = () => {
    return {
        type: EXACT_AUTH,
    };
}

export const failAuthenticate = () => {
    return {
        type: FAIL_AUTH,
    }
}