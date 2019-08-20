import { SET_MAP_STATE } from "../const/map";

let initMapState = {
    marker: { lat: 21.033028, lng: 105.803357 },
    location: null
};

export const handleMapState = (state = initMapState, action) => {
    switch (action.key) {
        case SET_MAP_STATE:
            return { marker: action.marker, location: action.location }
        default:
            return {...state};
    }
}