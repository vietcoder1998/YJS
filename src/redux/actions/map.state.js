import { SET_MAP_STATE } from "../const/map";

export const setMapState = (action) => {
    return {type: SET_MAP_STATE, marker: action.marker, action: action.location}
}