import React, { Component } from 'react';
import './Result.scss'
import Layout from './../layout/Layout';
import { Row, Col, Pagination, Icon, Tooltip, Input, Spin } from 'antd';
import { GET_JOB_RESULT_DATA } from '../../redux-saga/actionCreator/JobResult';
import { connect } from 'react-redux';
import { moveScroll } from '../../assets/js/moveScroll';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { GET_HIGH_LIGHT_DATA } from '../../redux-saga/actionCreator/HighLightJob';
import { limitString } from '../../assets/js/limitString';
import { timeConverter } from '../../assets/js/convertTime';
import TextImage from '../../assets/image/carouselGroup/carousel1.jpg';

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_search: true,
            is_loading: false
        }
    }

    _seeJob = (item) => {
        window.location.assign(`/job-detail/${item.id}`)
    }

    _handleIndex = (event) => {
        moveScroll(0, 0);
        localStorage.setItem('paging', JSON.stringify({ pageIndex: event - 1, pageSize: 10 }));
        this.props.callJobResultData(event - 1);
        this._callLoading()
    }

    async componentDidMount() {
        this.props.callJobResultData(0);
        this.props.callHighLightData(0);
        this._callLoading();
    }

    _callLoading = () => {
        this.setState({ is_loading: true })
        setTimeout(() => { this.setState({ is_loading: false }) }, 1000);
    }

    render() {
        const { is_search, is_loading } = this.state;
        const { results, highlightData, isAuthen } = this.props;
        const list_result = results.items;

        return (
            <Layout>
                <div className='content'>
                    <Row>
                        <Col xs={0} sm={0} md={0} lg={1} xl={3} xxl={2}></Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={20}>
                            <div className='search-result'>
                                {/* SearChTab */}
                                <div className='search-tab test'>
                                    <div className='filter-name-job' style={{ padding: is_search ? '10px 20% ' : '10px 2%' }}>
                                        <Input
                                            onClick={() => { this.setState({ is_search: !is_search }) }}
                                            size='large'
                                            prefix={<Icon type='search' />}
                                            placeholder='Nhập tên công việc thích hợp'
                                        />
                                    </div>
                                </div>
                                {/* Hot Job */}
                                <div className='result-filter test'>
                                    <div className='sub-filter'>
                                        <p>
                                            Đã tìm thấy <span style={{ color: 'red' }}>{results.totalItems}</span> công việc cho bạn
                                            <span>
                                                {' '}<Icon type={list_result.length === 0 ? 'frown' : 'smile'} theme="twoTone" />
                                            </span>
                                            <span style={{ float: 'right' }}>
                                                <Icon type="mail" theme="twoTone" /> Liên hệ
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {/* Search Result */}
                                <Row>
                                    <div className='hl-job test hidden-only-phone'>
                                        <h5>Công việc hàng đầu</h5>
                                        <div className='all-hl-job'>
                                            <Row>
                                                {highlightData.items && highlightData.items.map((item, index) => {
                                                    return (
                                                        <Col key={index} xs={24} sm={24} md={12} lg={12} xl={12} xxl={8}>
                                                            <div key={index} className='item-hl-job'>
                                                                <img alt='logo' src={item.employerLogoUrl} />
                                                                <div className='name-job'>
                                                                    <ul>
                                                                        <li >
                                                                            <Link to={`/job-detail/${item.id}`}
                                                                                target='_blank'
                                                                                style={{ color: 'red', fontSize: '1rem' }}
                                                                            >
                                                                                <label className='l_c' >{limitString(item.jobTitle, 25)}</label>
                                                                            </Link>
                                                                            <Tooltip title='Công việc hot'>
                                                                                <span> <Icon type='fire' twoToneColor="#eb2f96" style={{ color: 'red' }} /></span>
                                                                            </Tooltip>
                                                                        </li>
                                                                        <li style={{ fontSize: '0.8rem' }}>
                                                                            <Icon type="environment" style={{ color: "purple" }} />
                                                                            {item.region.name + ' '}  |
                                                                            <i className="fa fa-briefcase" aria-hidden="true"></i> <label className='l_c'>{item.jobType + ' '}</label> |
                                                                        <Icon type="calendar" style={{ color: "green" }} />{timeConverter(item.createdDate)}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </Col>)
                                                })}
                                            </Row>
                                        </div>
                                    </div>
                                </Row>
                                <Row>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                                        <div className='result' >
                                            {is_loading ? <div className='loading'><Spin /></div> : list_result.map((item, index) => {
                                                let color = "#fde8c7";
                                                switch (item.jobType) {
                                                    case 'PARTTIME':
                                                        color = 'rgb(239, 253, 239)';
                                                        break;

                                                    case 'FULLTIME':
                                                        color = 'rgb(229, 239, 255)';
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                return (<Row key={index} className='result-item' >
                                                    {/* Image */}
                                                    <Col xs={4} sm={4} md={4} lg={4} xl={3} >
                                                        <div className='image-content' style={{backgroundColor: color}}>
                                                            <img src={item.employerLogoUrl ? item.employerLogoUrl : TextImage} alt='logo ct' />
                                                        </div>
                                                    </Col>
                                                    {/* Content */}
                                                    <Col xs={18} sm={18} md={16} lg={16} xl={17} className='item-content'>
                                                        <div className='item-header'>
                                                            <h4 >
                                                                <Link
                                                                    style={{ color: item.priority === 'TOP' ? 'red' : 'black' }}
                                                                    to={`/job-detail/${item.id}`}
                                                                    target='_blank'

                                                                > <li className='l_c'>{item.jobTitle}</li></Link>
                                                                {item.priority === 'TOP' ? <Tooltip title='Công việc hot'>
                                                                    <span> <Icon type='fire' twoToneColor="#eb2f96" style={{ color: 'red' }} /></span>
                                                                </Tooltip> : null}
                                                            </h4>
                                                        </div>
                                                        {/* Info */}
                                                        <div className='item-info' >
                                                            <p>
                                                                Nơi tuyển dụng: {item.employerBranchName}
                                                            </p>
                                                            <p>{item.description}</p>
                                                            <div className='item-detail' >
                                                                <Row>
                                                                    <Col xs={8} sm={8} md={6} lg={6} xl={6} >
                                                                        <Icon type='environment' style={{ color: 'purple' }} /><span>{item.region.name}</span>
                                                                    </Col>
                                                                    <Col xs={16} sm={16} md={18} lg={18} xl={18} >
                                                                        <Icon type="profile" style={{ color: 'blue' }} /><span>{item.jobType === 'PARTTIME' ? 'Không cần kinh nghiệm' : 'Thỏa thuận'}</span>
                                                                    </Col>
                                                                </Row>
                                                                <Row className='show-only-phone'>
                                                                    <div className='item-time '>
                                                                        <Icon type="calendar" style={{ color: 'green' }} />Đã đăng: {moment(item.createdDate).format('DD/MM/YY')}
                                                                    </div>
                                                                </Row>
                                                            </div>
                                                            <p className='item-location'>Địa điểm: {item.address}</p>
                                                        </div>
                                                    </Col>
                                                    {/* Save */}
                                                    <Col xs={2} sm={2} md={4} lg={4} xl={4} className='item-option ' style={{ backgroundColor: color }}>
                                                        <div className='item-job-type hidden-only-phone'  >
                                                            <span style={{ backgroundColor: item.jobType === 'FULLTIME' ? 'cornflowerblue' : 'green' }}>
                                                                {item.jobType}
                                                            </span>
                                                        </div>
                                                        <div className='item-time hidden-only-phone'>
                                                            Đã đăng: {moment(item.createdDate).format('DD/MM/YY')}
                                                        </div>
                                                        <Tooltip title='Lưu lại'>
                                                            <div className='item-save' style={{ display: isAuthen ? 'block' : 'none' }}>
                                                                <Icon type="save" style={{ color }} />
                                                            </div>
                                                        </Tooltip>
                                                    </Col>
                                                </Row>)
                                            })}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Paginition */}
                                <div className='pagination-result'>
                                    <Pagination showSizeChanger size="small" defaultCurrent={1} total={results.totalItems} onChange={this._handleIndex} />
                                </div>
                                {/* {Job} */}
                            </div>
                        </Col>
                        <Col xs={0} sm={0} md={0} lg={1} xl={3} xxl={2}></Col>
                    </Row>
                </div>
            </Layout>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        results: state.handleListJobResult.result,
        highlightData: state.handleListHighLightResult.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        callJobResultData: (pageIndex) => {
            dispatch({ type: GET_JOB_RESULT_DATA, pageIndex })
        },

        callHighLightData: (pageIndex) => {
            dispatch({ type: GET_HIGH_LIGHT_DATA, pageIndex })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Result)
