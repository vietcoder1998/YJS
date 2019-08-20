import { SET_LANGUAGE_STATE } from './../const/language.state';

let initState = {language_skills_state : [{is_fix: false}]};

export const handleListLanguageState = (state = initState, action) => {
    switch (action.type) {
        case SET_LANGUAGE_STATE:
            return {...state, language_skills_state: action.language_skills_state};

        default:
            return {...state};
    }
}