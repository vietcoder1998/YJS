import { OPEN_SIDE_BAR, CLOSE_SIDE_BAR } from './../const/sidebar.state';

export const openSideBar = () => {
    return{type: OPEN_SIDE_BAR}
}
export const closeSideBar = () => {
    return{type: CLOSE_SIDE_BAR}
}