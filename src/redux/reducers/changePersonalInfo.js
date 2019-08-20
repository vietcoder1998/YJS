import { PERSON_INFO } from "../const/person-data";

let personal_data = {
    personal_info: {},
    skills: [],
    educations: [],
    description: "",
    language_skills: [],
    experiences: [],
    rating: {}
};

export const handlePersonalInfo = (state = personal_data, action) => {
    switch (action.type) {
        case PERSON_INFO:
            return {
                ...state,
                personal_info: action.personal_info,
                skills: action.skills,
                educations: action.educations,
                description: action.description,
                language_skills: action.language_skills,
                experiences: action.experiences,
                rating: action.rating,
            }

        default:
            return state;
    }
}