import { EXACT_AUTH, FAIL_AUTH } from "../const/authen";

let initAuth = {
    isAuthen: false,
}

export const handleAuthState = (state = initAuth, action) => {
    switch (action.type) {
        case EXACT_AUTH:
            return { ...state, isAuthen: true}

        case FAIL_AUTH:
            return { ...state, isAuthen: false};

        default:
            return state;
    }
}