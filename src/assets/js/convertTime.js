import * as moment from 'moment';

export const timeConverter = (value) => {
    let time = moment.unix(value/1000).format("DD/MM/YYYY");
    return time;
}