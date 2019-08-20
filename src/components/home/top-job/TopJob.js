import React, { Component } from 'react';
import { Col, Row, Icon, Skeleton } from 'antd';
import './TopJob.scss'
import { connect } from 'react-redux';
import { GET_HOT_JOB_DATA } from '../../../redux-saga/actionCreator/HotJob';
import { limitString } from '../../../assets/js/limitString';
import { timeConverter } from '../../../assets/js/convertTime';
import { Link } from 'react-router-dom';
import DefaultImage from '../../../assets/image/carouselGroup/carousel2.jpg';


class TopJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list_job_top: [

            ],

            is_loading: true
        };
    }

    componentWillMount() {
        this.props.callHotJob(0);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ is_loading: false })
        }, 500);
    }

    render() {
        let { top_job_data } = this.props;
        let { is_loading } = this.state;

        return (
            <div className='tab-search' style={{ backgroundColor: 'whitesmoke' }}>
                <div className='top-job'>
                    <h4 style={{ textAlign: 'center' }}>VIỆC LÀM TUYỂN GẤP </h4>
                    <Row>
                        {top_job_data.items && top_job_data.items.map((item, index) => {

                            let logoUrl = item.employerLogoUrl;

                            if (!logoUrl) {
                                logoUrl = DefaultImage
                            }

                            return (<Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={index} >
                                {is_loading ? <Skeleton avatar paragraph={{ rows: 1 }} /> : (
                                    <div className='h-j-item'>
                                        <div className='img-job'>
                                            <img src={logoUrl} alt='logo' />
                                        </div>
                                        <div className='job-content'>
                                            <ul>
                                                <li className='l_c'><Link to={`/job-detail/${item.id}`} target='_blank' >{limitString(item.jobTitle, 30)}</Link> </li>
                                                <li className='l_c'>
                                                    <Icon type="environment" style={{ color: "purple" }} /><label className='l_ca'>{item.region.name + ' | '}</label> 
                                                    <i className="fa fa-briefcase" aria-hidden="true"></i> <label className='l_c'>{item.jobType + ' | '}</label>
                                                    <Icon type="calendar" style={{ color: "green" }} />{timeConverter(item.createdDate)}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>)}
                            </Col>)
                        })}
                    </Row>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        top_job_data: state.handleListHotJobResult.data
    };
};

const mapDispatchToProps = dispatch => {
    return {
        callHotJob: (pageIndex) => dispatch({ type: GET_HOT_JOB_DATA, pageIndex })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopJob);