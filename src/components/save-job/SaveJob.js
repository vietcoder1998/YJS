import React, { Component } from 'react';
import Layout from './../layout/Layout';
import { Row, Col, Icon, Pagination, Tooltip, notification, Button  } from 'antd';
// import TestImage from '../../assets/image/carouselGroup/carousel1.jpg';
import './SaveJob.scss'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { GET_JOB_SAVE_DATA } from '../../redux-saga/actionCreator/JobSaveDetail';
import moment from 'moment'
import { DELETE } from '../../const/method';
import { saveJobController } from '../../service/api/private.api';
import { authHeaders } from '../../service/auth';
import { _requestToServer } from '../../service/exec';
import { candicates_host } from '../../environment/development';
import { moveScroll } from '../../assets/js/moveScroll';
import { limitString } from '../../assets/js/limitString';

const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
        <Button type="primary" size="small" onClick={() => notification.close(key)}>
            Confirm
      </Button>
    );

    const description = (<p stype={{color: 'rgb(59, 163, 251)'}}>Bạn đã xóa một công việc</p>)

    notification.open({
        message: 'WorkVn Thông báo',
        description,
        btn,
        key,
    });
};


class SaveJob extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentWillMount() {
        this._getSaveJobDateAndState()
    }

    _getJobSave = (event) => {
        this.props.callJobSaveData(event - 1)
    }

    _getSaveJobDateAndState() {
        moveScroll(0, 0, "smooth");
        this.props.callJobSaveData(0);
    }

    async _removejob(id) {
        let { isAuthen } = this.props;
        if (isAuthen) {
            let res = await _requestToServer(DELETE, null, saveJobController + `/${id}`, candicates_host, authHeaders);
            if (res.code === 200) {
                openNotification();
                this.props.callJobSaveData(0)
            }
        }
    }


    render() {
        let { list_job_save } = this.props;
        let totalItems = list_job_save && list_job_save.totalItems;
        let totalPagination = totalItems
        console.log(totalPagination)

        return (
            <React.Fragment>

                <Layout>
                    <div className='content'>
                        <Row>
                            <Col></Col>
                            <Col>
                                <div className='history-content ' >
                                    <h5>Lịch sử ứng tuyển</h5>
                                    <div className='history-job'>
                                        <Row>
                                            {list_job_save.items && list_job_save.items.map((item, index) => {
                                                let typeSpan = { type: '', color: '', state: '' };
                                                switch (item.id) {
                                                    case 'waiting':
                                                        typeSpan.type = 'pause-circle';
                                                        typeSpan.color = 'orange';
                                                        typeSpan.state = 'Đang chờ';

                                                        break;
                                                    case 'cancel':
                                                        typeSpan.type = 'close-circle';
                                                        typeSpan.color = 'red';
                                                        typeSpan.state = 'Đã từ chối';
                                                        break;
                                                    case 'success':
                                                        typeSpan.type = 'check-circle';
                                                        typeSpan.color = 'green';
                                                        typeSpan.state = 'Thành công';
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                return (<Col key={index} xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                                                    <div className='job-detail test'>
                                                        <div className='image-job'>
                                                            <img className='logo-company' src={item.jobPreview.employerLogoUrl} alt='history job' />
                                                            <Tooltip title='Bạn có muốn xóa công việc' placement="bottom" >
                                                                <li onClick={() => { this._removejob(item.id) }}>
                                                                    <Button type='danger' size='small'> <Icon type="delete"/>Xóa</Button>
                                                                </li>
                                                            </Tooltip>

                                                        </div>
                                                        <div className='content-job'>
                                                            <p><Link to={`/job-detail/${item.jobPreview.id}`}>{item.jobPreview.jobTitle}</Link></p>
                                                            <div className='info-company'>
                                                                <li>
                                                                    <Icon type="home" />{item.jobPreview.employerName}
                                                                </li>
                                                                <li>
                                                                    <Icon type='environment' />{limitString(item.jobPreview.address)}
                                                                </li>
                                                            </div>
                                                            <li style={{ textAlign: 'right', fontSize: '0.7rem', float: 'right' }}>
                                                                {moment(item.saveTime).format('DD/MM/YY')}
                                                            </li>
                                                        </div>
                                                    </div>
                                                </Col>)
                                            })}
                                        </Row>
                                        <div className='pagination-result'>
                                            <Pagination showSizeChanger defaultCurrent={1} size="small" total={totalPagination} onChange={this._getJobSave} />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col></Col>
                        </Row>
                    </div>
                </Layout>
            </React.Fragment>

        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        callJobSaveData: (pageIndex) => dispatch({ type: GET_JOB_SAVE_DATA, pageIndex })
    }
}

const mapStateToProps = (state) => {
    return {
        list_job_save: state.handleGetJobSave,
        isAuthen: state.handleAuthState.isAuthen
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveJob);
