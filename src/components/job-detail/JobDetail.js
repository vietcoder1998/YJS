import React, { Component } from 'react';
import './JobDetail.scss';
import Layout from '../layout/Layout';
import { Tabs, Row, Col, Icon, Button, Modal, Checkbox, Pagination, Tooltip, Skeleton } from 'antd';
import CoverImage from '../../assets/image/carouselGroup/carousel1.jpg';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { GET_JOB_DETAIL_DATA } from '../../redux-saga/actionCreator/JobDetail';
import moment from 'moment';
import { GET_EMPLOYER_MORE_JOB_DATA } from '../../redux-saga/actionCreator/EmployerMoreJob';
import { _requestToServer } from './../../service/exec';
import { POST, GET } from '../../const/method';
import { candidateAppliedJobController, saveJobController } from './../../service/api/private.api';
import { candicates_host } from '../../environment/development';
import { authHeaders } from '../../service/auth';
import _ from 'lodash';
import { allMsg } from './../../const/msg';
import { OPEN_POPUP } from './../../redux/const/popup';
import { moveScroll } from '../../assets/js/moveScroll';
import { limitString } from '../../assets/js/limitString';
import { testImage } from '../../utils/CheckImage';

const { TabPane } = Tabs;
let weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

class JobDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            visible: false,
            confirmLoading: false,
            message: '',
            genderRequired: [],
            shiftIDs: [],
            list_shiftIDs: [],
            check_box_state: [],
            jobState: 'PENDING',
            is_loading_more: false,
            isSaved: true,
        }

        this.show_btn = false
        this.l_e = [];
        this.l_s = [];
    }

    componentWillMount() {
        this._loadData();
        this._loadState();
        moveScroll(0, 0);
    }

    _loadData = () => {
        let { job_detail } = this.props;
        this.props.callJobDetail(this.props.match.params.id);
        this.setState({ isSaved: job_detail.isSaved })
    }

    _getMoreJob = (event) => {
        this.setState({ is_loading_more: true }, () => {
            this.props.callEmployerMoreJob(event - 1)
        });

        setTimeout(() => {
            this.setState({ is_loading_more: false })
        }, 500)
    }

    async _loadState() {
        let { isAuthen } = this.props;

        if (isAuthen) {
            let id = this.props.match.params.id;
            let res = await _requestToServer(GET, null, candidateAppliedJobController + `/${id}/state`, candicates_host, authHeaders);
            console.log(res.data)
            this.setState({ jobState: res.data });
        }
    }

    _listRating(employer_detail) {
        this.l_e = [];
        this.l_s = [];
        let c_e = employer_detail && employer_detail.rating.workingEnvironmentRating;
        let c_s = employer_detail && employer_detail.rating.salaryLevelRating;

        for (let i = 0; i < c_e; i++) {
            this.l_e.push(<Icon key={i + 'c_e'} type='star' style={{ color: 'orange' }} theme="filled" />);
        }

        for (let i = 5; i > c_e; i--) {
            this.l_e.push(<Icon key={i + 'c_e'} type='star' style={{ color: 'darkgrey' }} theme="filled" />);
        }

        for (let i = 0; i < c_s; i++) {
            this.l_s.push(<Icon key={i + 'c_s'} type='star' style={{ color: 'orange' }} theme="filled" />);
        }

        for (let i = 5; i > c_s; i--) {
            this.l_s.push(<Icon key={i + 'c_s'} type='star' style={{ color: 'darkgrey' }} theme="filled" />);
        }
    }

    _handleOk = () => {
        this.setState({ visible: true })
    }

    _handleCancel = () => {
        this.setState({ visible: false })
    }

    _handleMessage = (event) => {
        this.setState({ message: event.target.value })
    }

    _handleCheckbox = (event, id) => {
        let { shiftIDs } = this.state;
        if (event.target.checked === true) {
            shiftIDs.push(id)
        } else {
            _.remove(shiftIDs, (item) => {
                return item === id;
            })
        }
    }

    _toLogin = () => {
        let { isAuthen } = this.props;
        localStorage.setItem('last_access', window.location.href);

        if (isAuthen !== true) {
            window.location.assign('/login');
        }
    }

    _checkGender = (data) => {

        if (data.gender) {
            switch (data.gender) {
                case "BOTH":
                    return (
                        <div>
                            <p>
                                <label><Icon type='man' style={{ color: 'green' }} /> Nam</label>
                                <label><Icon type='woman' style={{ color: 'red' }} /> Nữ</label>
                            </p>
                            <p>
                                <Icon type="form" />
                                <label>{data.applied + '/' + data.quantity}</label>
                            </p>
                        </div>);
                case "MALE":
                    return (
                        <div>
                            <p>
                                <label><Icon type='man' style={{ color: 'green' }} /> Nam</label>
                            </p>
                            <p>
                                <Icon type="form" />
                                <label>{data.applied + '/' + data.quantity}</label>
                            </p>
                        </div>);
                case "FEMALE":
                    return (
                        <div>
                            <p><label><Icon type='woman' style={{ color: 'red' }} /> Nữ</label></p>
                            <p>
                                <Icon type="form" />
                                <label>{data.applied + '/' + data.quantity}</label>
                            </p>
                        </div>);
                default:
                    return (
                        <div>
                            <p>
                                <label><Icon type='man' style={{ color: 'green' }} /> Nam</label>
                                <label><Icon type='woman' style={{ color: 'red' }} /> Nữ</label>
                            </p>
                            <p>
                                <Icon type="form" />
                                <label>{data.applied + '/' + data.quantity}</label>
                            </p>
                        </div>);
            }
        }

    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ is_loading: false })
        }, 200)

    }

    async _saveJob(id) {
        let { isAuthen } = this.props;

        if (isAuthen) {
            let msg = allMsg.success;
            let type = "unSuccess";
            let res = await _requestToServer(POST, null, saveJobController + `/${id}`, candicates_host, authHeaders);
            if (res && res.data === null) {
                this.props.openPopup({ msg: allMsg.success, type: "success" });
                this.setState({ isSaved: true });
            } else {
                this.props.openPopup({ msg, type })
            }
            this.props.callJobDetail(this.props.match.params.id);
        }
    }


    _createRequest = () => {
        let { message, shiftIDs } = this.state;
        this.requestToServer({ message, shiftIDs }, this.props.match.params.id);
        this.setState({ visible: false })
    }

    async requestToServer(data, id) {
        try {
            let res = await _requestToServer(POST, data, candidateAppliedJobController + `/${id}`, candicates_host, authHeaders);
            console.log(res)
            let msg = allMsg.unSuccess;
            if (res.data.isSuccess) {
                msg = allMsg.appliedJobSuccess;
                this.props.openPopup({ msg, type: "success" });
            } else {
                this.props.openPopup({ msg: "Ứng tuyển thất bại", type: "unSuccess" });
            }

            this.props.callJobDetail(this.props.match.params.id);
            this._loadState();
        } catch (err) {
            this.props.openPopup({ msg: allMsg.failRequirement, type: "unSuccess" })
        }
    }

    render() {
        let { job_detail, employer_detail, employer_more_job, isAuthen } = this.props;
        let { is_loading, visible, confirmLoading, massage, jobState, is_loading_more } = this.state;
        let isSaved = job_detail.isSaved;

        if (employer_detail.rating) {
            this._listRating(employer_detail);
        }

        let paging = employer_more_job.totalItems && Math.ceil(employer_more_job.totalItems / 6);

        if (is_loading) {
            return (<Layout>
                <div className='loading'>
                    <Icon type="loading-3-quarters" spin />
                </div>
            </Layout>)
        }

        let content = 'Ứng tuyển';
        let jobStateApplied = false;

        let color = "#fde8c7";
        switch (job_detail.jobType) {
            case 'PARTTIME':
                color = 'rgb(239, 253, 239)';
                break;

            case 'FULLTIME':
                color = 'rgb(229, 239, 255)';
                break;
            default:
                break;
        }

        if (isAuthen === false) {
            content = 'Đăng nhập để ứng tuyển';
        } else {
            if (jobState === "PENDING") {
                content = 'Đang chờ';
                jobStateApplied = true;
            } else if (jobState === 'ACCEPTED') {
                content = "Đã chấp nhận"
                jobStateApplied = true;
            }
        }

        let coverUrl = job_detail.employerCoverUrl;
        let logoUrl = job_detail.employerLogoUrl;

        return (
            <React.Fragment>
                {/* Info Requirement */}
                <Modal title="Thông tin ứng tuyển"
                    visible={visible}
                    onOk={this._handleOk}
                    footer={[
                        <Button key='cancel'
                            onClick={this._handleCancel}
                            type='danger'
                        >Cancel</Button>,
                        <Button key='ok'
                            type='primary'
                            onClick={isAuthen ? this._createRequest : this._toLogin}
                        >{content}</Button>
                    ]}
                    confirmLoading={confirmLoading}
                    onCancel={this._handleCancel}>
                    <div className='body-requirement'>
                        {isAuthen ? (<div> <textarea value={massage} placeholder='Viết tin nhắn đến nhà tuyển dụng trong đơn ứng tuyển(nếu muốn)' onChange={this._handleMessage} rows={2} ></textarea>
                            <div>
                                {job_detail.shifts && job_detail.shifts.map((item, index) => {
                                    return (<p key={index}>
                                        <Checkbox
                                            id={item.id}
                                            onChange={(event) => { this._handleCheckbox(event, event.target.id) }}
                                        >
                                            Ca số {index + 1}
                                        </Checkbox>
                                    </p>)
                                })}
                            </div>
                        </div>) : (<div><p>Bạn cần đăng nhập trước khi đăng tuyển</p></div>)}
                    </div>
                </Modal>

                <Layout>
                    <div className='content'>
                        <Row>
                            <Col xs={0} sm={0} md={0} lg={1} xl={4} ></Col>
                            <Col xs={24} sm={24} md={24} lg={22} xl={16}>
                                <div id='requirement-job' className='job-detail-content'>
                                    {/* Button recruitment */}
                                    <div className='btn-candidate show-mobile'>
                                        <Button onClick={() => { this.setState({ visible: true }) }} >
                                            <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                                        </Button>
                                    </div>

                                    {/* Cover Image */}
                                    <div className='cover-image-job '>
                                        <img src={testImage(coverUrl)}
                                            className='company-image'
                                            alt=''
                                        />
                                    </div>
                                    {/* Header */}
                                    <div className='job-header test' style={{ backgroundColor: color }} >
                                        <div className='company-header'>
                                            <div className='company-logo '>
                                                <li><img src={testImage(logoUrl, 'logo')} alt='logo-company' /></li>
                                                <li>
                                                    <Tooltip title='Đánh giá' placement='rightBottom' >
                                                        <label>
                                                            <Icon type="edit" style={{ fontSize: "15px" }} />
                                                        </label>
                                                    </Tooltip>
                                                </li>
                                            </div>
                                            <h4 className='a_c'>
                                                {job_detail && job_detail.jobTitle}
                                            </h4>
                                        </div>
                                    </div>
                                    {/* Detail Content */}
                                    <div className='job-business'>
                                        <Row>
                                            <Col xs={8} sm={8} md={8} lg={8} xl={8} className='a_c' >
                                                <div style={{ margin: '5px 10px' }}>
                                                    <Button icon='save'
                                                        size='large'
                                                        type={(isAuthen && !isSaved) ? 'default' : 'ghost'}
                                                        onClick={() => { this._saveJob(job_detail.id) }}
                                                        disabled={isSaved}
                                                        block
                                                    >
                                                        {isAuthen && job_detail && isSaved ? "Đã lưu" : "Lưu "}
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col xs={16} sm={16} md={16} lg={16} xl={16} className='a_c'>
                                                <div style={{ margin: '5px 10px' }}>
                                                    <Button icon='solution'
                                                        type={jobStateApplied ? 'ghost' : 'primary'}
                                                        size='large'
                                                        style={{ padding: '5px 0px' }}
                                                        onClick={() => { isAuthen ? this.setState({ visible: true }) : this._toLogin() }}
                                                        disabled={jobStateApplied}
                                                        block
                                                    >
                                                        {content}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    {/* Job Content */}
                                    <div className='job-content '>
                                        {/* Tab Detail */}
                                        <Tabs defaultActiveKey="1" className='' >
                                            <TabPane tab="Chi tiết công việc" key="1">
                                                {/* Detail */}
                                                <div className='job-detail'>
                                                    <Row >
                                                        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                                                            <div className='detail-job test'>
                                                                <h6>Mô tả chung</h6>
                                                                <ul>
                                                                    <li className='d_j_t'>
                                                                        <Icon type="solution" style={{ color: 'blue' }} /><label>Loại công việc: {job_detail && job_detail.jobType}</label>
                                                                    </li>
                                                                    <li className='d_j_t'>
                                                                        <Icon type="environment-o" style={{ color: 'purple' }} />Nơi đăng: <label>{job_detail && job_detail.address}</label>
                                                                    </li>
                                                                    <li className='d_j_t'>
                                                                        <Icon type="calendar" style={{ color: 'green' }} />Ngày đăng:<label> {job_detail && moment(job_detail.createdDate).format('DD/MM/YYYY')}</label>
                                                                    </li>
                                                                    <li className='d_j_t'>
                                                                        <Icon type="calendar" style={{ color: 'red' }} />Ngày hết hạn:<label> {job_detail && moment(job_detail.expirationDate).format('DD/MM/YYYY')}</label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </Col>
                                                        {/* Description job */}
                                                        <Col xs={24} sm={24} md={24} lg={15} xl={15}>
                                                            <div className='description-job '>
                                                                <h6>Mô tả công việc</h6>
                                                                <p>
                                                                    {job_detail.description}
                                                                </p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        {/* Time */}
                                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                            <div className='time-job b_t'>
                                                                <h6>Ca làm việc</h6>
                                                                <div>
                                                                    {job_detail.shifts && job_detail.shifts.map((item, index) => {
                                                                        let maxSalary = '' + item.maxSalary && item.maxSalary === 0 ? '' : ('-' + item.maxSalary);
                                                                        return (<div key={index} className='time-content b_b'>
                                                                            <p>
                                                                                <label> Ca số {index + 1} </label>
                                                                                {/* <Checkbox id={item.id} onChange={(event) => { this._handleCheckbox(event, item.id) }} ></Checkbox> */}
                                                                            </p>
                                                                            <p><Icon type="clock-circle" style={{ color: 'blue' }} />{' ' + item.startTime + '-' + item.endTime}</p>
                                                                            <p><Icon type="dollar" style={{ color: 'rgb(224, 224, 34)' }} /><span>{' ' + item.minSalary ? item.minSalary : ''}</span><span>{maxSalary} </span> {'/' + item.unit} </p>
                                                                            <div className='week-day'>
                                                                                {weekDays.map((itemWeek, index) => {
                                                                                    if (item[itemWeek] === true) {
                                                                                        let day = 'T' + (index + 2);
                                                                                        if (index === 6) {
                                                                                            day = 'CN'
                                                                                        }
                                                                                        return (<label key={index} className='time-span'>
                                                                                            {day}
                                                                                        </label>)
                                                                                    }
                                                                                    else {
                                                                                        return null
                                                                                    }
                                                                                })}
                                                                            </div>
                                                                            {item.genderRequireds[0] ? this._checkGender(item.genderRequireds[0]) : null}
                                                                        </div>)
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        {/* Skills job */}
                                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                            <div className='skills-job-detail '>
                                                                <h6>Kĩ năng công việc</h6>
                                                                <div>
                                                                    {job_detail.requiredSkills && job_detail.requiredSkills.map((item, index) => { return <label key={index} className='skills-detail'>{item.name}</label> })}
                                                                </div>
                                                            </div>
                                                        </Col >
                                                    </Row>

                                                </div>
                                                {/* address Area */}
                                            </TabPane>
                                            <TabPane tab="Công ti tuyển dụng" key="2">
                                                <div className='job-detail'>
                                                    <div className='company-header'>
                                                        <h6>Thông tin chung</h6>
                                                    </div>
                                                    <div className='all-rating '>
                                                        <Row>
                                                            <Col xs={12} className='b_r'>
                                                                <div className='rating b_b'>
                                                                    <p>Môi trường làm việc </p>
                                                                    <div className='star-rating'>
                                                                        {this.l_e}
                                                                    </div>
                                                                    <span><label><Icon type='user' /></label>{employer_detail.rating && employer_detail.rating.ratingCount}</span>
                                                                </div>
                                                            </Col>
                                                            <Col xs={12}>
                                                                <div className='rating b_b'>
                                                                    <p>Đãi ngộ nhân viên</p>
                                                                    <div className='star-rating'>
                                                                        {this.l_s}
                                                                    </div>
                                                                    <span><label><Icon type='user' /></label>{employer_detail.rating && employer_detail.rating.ratingCount}</span>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div className='company-info b_b' >
                                                        <h6>Thông tin nhà tuyển dụng</h6>
                                                        <p>
                                                            <Icon type="home" style={{ color: 'black' }} />Tên nhà tuyển dụng: {employer_detail && employer_detail.employerName}
                                                        </p>
                                                        <p>
                                                            <Icon type="dollar" style={{ color: '#e0e022' }} /> Mã số thuế: {employer_detail && employer_detail.taxCode}
                                                        </p>
                                                        <p>
                                                            <Icon type="environment" style={{ color: 'purple' }} />  Địa chỉ: {employer_detail && employer_detail.address}
                                                        </p>
                                                        <p>
                                                            <Icon type="mail" style={{ color: 'blue' }} />  Mail: {employer_detail && employer_detail.email}
                                                        </p>
                                                        <p style={{ textAlign: "right" }}>

                                                        </p>
                                                    </div>
                                                    <div className='company-description b_b'>
                                                        <h6>Mô tả sơ lược</h6>
                                                        <p>
                                                            {employer_detail.description}
                                                        </p>
                                                    </div>
                                                    <div className='company-more '>
                                                        <h6> Công việc đang tuyển</h6>
                                                        <Row>
                                                            <div className='company-job-more a_c'>
                                                                {
                                                                    employer_more_job.items && employer_more_job.items.map((item, index) => {
                                                                        return (<Col key={index} xs={24} sm={24} md={12} lg={12} xl={8}>
                                                                            {is_loading_more ? <Skeleton avatar paragraph={{ rows: 1 }} /> :
                                                                                (<div className='item-job ' >
                                                                                    <img alt='Job' src={CoverImage} className='item-job-logo' />
                                                                                    <p><Link to={`/job-detail/${item.id}`} target='_blank'>{limitString(item.jobTitle)}</Link></p>
                                                                                    <p><span><Icon type='environment' />{limitString(item.address)}</span></p>
                                                                                </div>)}
                                                                        </Col>)
                                                                    })
                                                                }

                                                            </div>
                                                        </Row>
                                                        <div className='pagination-job a_c'>
                                                            <Pagination defaultCurrent={1} total={paging} size="small" onChange={this._getMoreJob} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={0} sm={0} md={0} lg={1} xl={4}></Col>
                        </Row>
                    </div>
                </Layout>
            </React.Fragment >

        );
    }
}

const mapStateToProps = (state) => {
    return {
        job_detail: state.handleGetJobDetail,
        employer_detail: state.handleGetEmployerDetail,
        employer_more_job: state.handleEmployerMoreJobDetail,
        isAuthen: state.handleAuthState.isAuthen
    }
}

const mapDispatchToprops = (dispatch) => {
    return {
        callJobDetail: (jobID) => dispatch({ type: GET_JOB_DETAIL_DATA, jobID }),
        callEmployerMoreJob: (pageIndex) => dispatch({ type: GET_EMPLOYER_MORE_JOB_DATA, pageIndex }),
        openPopup: (data) => dispatch({ type: OPEN_POPUP, data })
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(JobDetail);
