import React, { Component } from 'react';
import { Col, Row, Tooltip, Icon, Pagination } from 'antd';
import './AllNoti.scss';
import Layout from './../../layout/Main/Layout';
import { connect } from 'react-redux';
import { GET_NOTI_INFO_DATA } from '../../../redux-saga/actionCreator/Noti';
import { _requestToServer } from '../../../service/exec';
import { notiController } from '../../../service/api/private.api';
import { PUT } from '../../../const/method';
import { candicates_host } from '../../../environment/development';
import { authHeaders } from '../../../service/auth';
import { timeConverter } from '../../../assets/js/convertTime';

class AllNoti extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1
        };
    }

    componentWillMount() {
        this.props.callNotiData(0)
    }

    async _createRequest(id, state) {
        let { isAuthen } = this.props;
        let { pageIndex } = this.state;
        if (isAuthen) {
            let res = await _requestToServer(PUT, null, notiController + `/${id}/seen/${state}`, candicates_host, authHeaders);
            if (res.code === 200) {
                this.props.callNotiData(pageIndex - 1)
            }
        }
    }

    render() {
        let { noti } = this.props;
        let pageLimit = noti.totalItems;
        console.log(this.props)

        return (
            <Layout>
                <div className='content'>
                    <Row>
                        <Col></Col>
                        <Col>
                            <div className='all-noti-content '>
                                <div className='noti-header b_b'>
                                    <h4 >Thông báo của bạn</h4>
                                </div>
                                <div className='list-content b_b'>
                                    <ul>
                                        {noti.items && noti.items.map((item, index) => {
                                            let state_noti = item.seen === true ? 'not-seen' : 'seen';
                                            let li_c_n = "b_b li-noti " + state_noti;

                                            return (<li key={index}
                                                className={`${li_c_n}`}>
                                                <div>
                                                    <img src={item.data.logoUrl} alt='t' />
                                                </div>
                                                <div className='data-noti'>
                                                    <ul>
                                                        <li>{'Công việc: ' + item.data.jobTitle}</li>
                                                        <li>Trạng thái: {item.data.state === 'ACCEPT' ? 'Đồng ý' : 'Từ chối'}</li>
                                                        <li>{'Thời gian: ' + timeConverter(item.createdDate)}</li>
                                                    </ul>
                                                </div>
                                                <div className='set-noti' onClick={() => { this._createRequest(item.id, !item.seen) }}>
                                                    {item.seen ?
                                                        <Tooltip title='Đánh dấu là chưa đọc' >
                                                            <Icon type='eye' />
                                                        </Tooltip> :
                                                        <Tooltip title='Đánh dấu là đã đọc' >
                                                            <Icon type="eye-invisible" />
                                                        </Tooltip>}
                                                </div>
                                            </li>)
                                        })}
                                    </ul>
                                </div>

                            </div>
                            <div className='pagination-result a_c'>
                                <Pagination defaultCurrent={1} total={pageLimit} size="small"
                                    onChange={(event) => {
                                        this.props.callNotiData(event - 1);
                                        this.setState({ pageIndex: event })
                                    }} />
                            </div>
                        </Col>
                        <Col></Col>
                    </Row>
                </div>

            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        noti: state.handleNoti,
        isAuthen: state.handleAuthState.isAuthen
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        callNotiData: (pageIndex) => dispatch({ type: GET_NOTI_INFO_DATA, pageIndex })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllNoti)
