import { PERSON_INFO } from "../const/person-data";

export const getPersonInfo = (personal_info, skills, educations, description, language_skills, experiences, rating) => {
    return {
        type: PERSON_INFO,
        personal_info,
        skills, 
        educations, 
        description,
        language_skills,
        experiences,
        rating
    }
}