import { OPEN_SIDE_BAR, CLOSE_SIDE_BAR } from './../const/sidebar.state';

let initState = { show_sidebar: false }

export const handleSideBarState = (state = initState, action) => {
    switch (action.type) {
        case OPEN_SIDE_BAR:
            return { show_sidebar: true };
        case CLOSE_SIDE_BAR:
            return {show_sidebar: false }

        default:
            return state;
    }

}