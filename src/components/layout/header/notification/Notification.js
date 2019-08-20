import React, { Component } from 'react'
import './Notification.scss';
import { Link } from 'react-router-dom';
import { GET_NOTI_INFO_DATA } from '../../../../redux-saga/actionCreator/Noti';
import { connect } from 'react-redux';
import { limitString } from '../../../../assets/js/limitString';
import { Icon, Modal } from 'antd';
import moment from 'moment';
import { _requestToServer } from '../../../../service/exec';
import { notiController } from '../../../../service/api/private.api';
import { authHeaders } from '../../../../service/auth';
import { PUT } from '../../../../const/method';
import { candicates_host } from '../../../../environment/development';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            visible: false,
            data: '',
            createdDate: '',
            id: ''
        }
    }

    _allSee = () => {
        let { notifications } = this.state;
        let list_id = notifications.map((item) => {
            return item.id
        })

        this._createRequest(list_id)
    }


    async _createRequest(id) {
        let { isAuthen } = this.props
        if (isAuthen) {
            let res = await _requestToServer(PUT, null, notiController + `/${id}/seen/${true}`, candicates_host, authHeaders);
            if (res.code === 200) {
                this.props.callNotiData(0);
                console.log(res)
            }
        }
    }

    componentWillMount() {
        this.props.callNotiData(0);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ is_loading: false })
        }, 250);
    }

    _openPopup = (item, id) => {
        console.log(item)
        let createdDate = moment(item.createdDate).format('DD/MM/YYYY');
        this.setState({ data: item.data, visible: true, createdDate, id });
    }

    _handleOk = (id) => {
        this.setState({ visible: false })
        this._createRequest(id);
    }

    render() {
        let { noti } = this.props;
        let { is_loading, visible, data, createdDate, id } = this.state;

        return (
            <React.Fragment>
                <Modal visible={visible} title="Thông báo " onOk={() => { this._handleOk(id) }} onCancel={() => { this.setState({ visible: false }) }}>
                    <div className='popup-noti '>
                        <h5>Đơn ứng tuyển: {data.jobTitle}</h5>
                        <div className='noti-image'>
                            <img src={data.logoUrl} alt='logo-company' />
                        </div>
                        <p>Công ti {data.employerName} đã {data.state === 'ACCEPTED' ? ' chấp nhận' : ' từ chối'} lời mời ứng tuyển của bạn </p>
                        <p style={{ textAlign: "right" }}>
                            Thời gian: {createdDate}
                        </p>
                    </div>
                </Modal>
                <div className='notification test'>
                    {/* <div className='arrow-up'></div>
                    <div className='arrow-up-content'></div> */}
                    <div className='noti-content'>
                        <div className='noti-header b_b'>
                            <h6 >Thông báo</h6>
                        </div>
                        <div className='noti-info b_b'>
                            {is_loading ? <div className='loading'><Icon type="loading-3-quarters" spin /></div> : (<ul>
                                {noti.items && noti.items.map((item, index) => {
                                    let noti_state = false;
                                    let seen = item.seen;
                                    if (item.data.state === 'ACCEPTED') {
                                        noti_state = true;
                                    }
                                    return (<li key={index} className='li-info '
                                        style={{ backgroundColor: item.seen === true ? 'white' : 'azure' }}>
                                        <div><img src={item.data.logoUrl} alt='type noti' /></div>
                                        <div className='data-noti'>
                                            <span>{limitString(item.data.jobTitle, 10)}</span>
                                            <ul>
                                                <li>Loại:{item.type === 'REPLY_JOB' ? ' Ứng tuyển' : ''}</li>
                                                <li>{noti_state ? 'Đã chấp nhận' : 'Đã từ chối'}
                                                    <Icon type={noti_state ? 'check' : 'close'}
                                                        style={{ color: noti_state ? 'green' : 'red', margin: '0px 5px' }} />
                                                </li>
                                            </ul>
                                        </div>
                                        <div className='view-noti'>
                                            <label>
                                                <Icon type={seen ? 'eye' : 'eye-invisible'}
                                                    style={{ color: seen ? 'green' : 'red', margin: '0px 5px' }} />
                                            </label>
                                            <label className='v-l' onClick={() => this._openPopup(item, item.id)}> Xem chi tiết</label>
                                        </div>
                                    </li>)
                                })}
                            </ul>)}

                        </div>
                        <div className='noti-footer'>
                            <p>
                                <Link to='/notifications'>Xem tất cả</Link>
                                <span className='all-state' style={{ float: 'right' }}> Đánh dấu đã đọc hết</span>
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        callNotiData: (pageIndex) => dispatch({ type: GET_NOTI_INFO_DATA, pageIndex })
    }
}

const mapStateToProps = (state) => {
    return {
        noti: state.handleNoti,
        isAuthen: state.handleAuthState.isAuthen
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
