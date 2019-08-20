// export function moveScrollBar(location, time) {
//     location = 1000;
//     let x = 0;
//     for (let i = 0; i < location; i++) {
//         x += location / 1000;
//         setTimeout(() => { window.scroll(0, x) }, 2);
//     }

// }

export function moveScroll(top, left , type) {
    let state = ({top, left, behavior: 'smooth'})
    if (type == null || type === undefined){
        state = ({top, left})
    }
    window.scroll(state);
};
