import React, { Component } from 'react';
import './FixExperience.scss';
import { Col, Row, DatePicker, Input } from 'antd';
import { connect } from 'react-redux';
import { experienceController } from '../../../../service/api/private.api';
import { _requestToServer } from '../../../../service/exec';
import { allMsg } from '../../../../const/msg';
import { POST } from '../../../../const/method';
import { OPEN_POPUP } from './../../../../redux/const/popup';
import { CALL_DATA } from './../../../../redux-saga/actionCreator/PersonInfo';
import moment from 'moment';


class FixExperience extends Component {

    constructor(props) {
        super(props);
        this.state = {
            experience: {
                jobName: "",
                companyName: "",
                startedDate: 0,
                finishedDate: 0,
                description: ""
            }
        }
    }

    _handleInput = (event) => {
        let value = event.target.value;
        let id = event.target.id;
        let { experience } = this.state;
        experience[id] = value;
        this.setState({ experience });
    }

    _handleChangeStartedTime = (value) => {
        let { experience } = this.state;
        let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
        experience.startedDate = time;
        this.setState({ experience });
    }

    _handleChangeFinishedTime = (value) => {
        let { experience } = this.state;
        let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
        experience.finishedDate = time;
        this.setState({ experience });
    }

    _closeFixExperience = () => {
    }

    _createRequest = () => {
        this.requestServer();
    }

    async requestServer() {
        let { method } = this.props;
        let { experience } = this.state;
        if (experience.jobName === '' || experience.companyName === '' || experience.startedDate === 0 || experience.finishedDate === 0 || experience.description === "") {
            this.props.openPopup({msg:"Thiếu trường thông tin hoặc thông tin bị sai", type: 'unSuccess'})
        } else if (method === POST) {
            try {
                let res = await _requestToServer(POST, experience, experienceController, null, null);
                if (res.code === 200) {
                    this.props.openPopup({ msg: allMsg.updateSuccess, type: "success" })
                    this.props.callData()
                }
            } catch (err) {
                this.props.openPopup({ msg: allMsg.unSuccessUpdate, type: "unSuccess" })
            }
            setTimeout(() => {
                this.props._fixData('experience');
            }, 1500);

        }
    }

    render() {
        let { experience } = this.state;
        return (
            <div className='wrapper'>
                <div className='experience'>
                    {/* jobName */}
                    <div className='experience-content'>
                        <p><label style={{ color: 'red' }}>*</label>Tên vị trí</p>
                        <Input id='jobName' className='input_outside' placeholder='Ví dụ: UX-UI Designer' value={experience.jobName} onChange={this._handleInput} />
                    </div>

                    {/* Company */}
                    <div className='experience-content'>
                        <p><label style={{ color: 'red' }}>*</label>Tên Tổ chức</p>
                        <Input id='companyName' className='input_outside' placeholder='Ví dụ: Công ti cổ phần Works.vn' value={experience.companyName} onChange={this._handleInput} />
                    </div>

                    <div className='experience-content'>
                        <Row >
                            {/* Started Date */}
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className='properties'>
                                <p> <label style={{ color: 'red' }}>*</label>Từ tháng</p>
                                <DatePicker
                                    onChange={this._handleChangeStartedTime}
                                    placeholder='Ví dụ: 26/6/2018'
                                />
                            </Col>
                            {/* DatePicker Finished Time */}
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className='properties'>
                                <p><label style={{ color: 'red' }}>*</label>Từ tháng</p>
                                <DatePicker
                                    onChange={this._handleChangeFinishedTime}
                                    placeholder='Ví dụ: 26/6/2018'
                                />
                            </Col>
                        </Row>
                    </div>

                    {/* Description */}
                    <div className='experience-content'>
                        <p> <label style={{ color: 'red' }}>*</label>Mô tả nội dung</p>
                        <textarea id='description' placeholder='Nhập nội dung và mô tả cụ thể công việc đã làm' value={experience.description} onChange={this._handleInput}></textarea>
                    </div>
                    <p><label style={{ color: 'red' }}>*</label>Thông tin bắt buộc</p>
                </div>
                {/* submit button */}
                <Row className="holder-button" >
                    <Col xs={12}>
                        <button className='button-request' onClick={() => { this.props._fixData('experience') }}> Hủy</button>
                    </Col>
                    <Col xs={12}>
                        <button className='button-request' onClick={this._createRequest}> Lưu</button>
                    </Col>

                </Row>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

        openPopup: (data) => {
            dispatch({ type: OPEN_POPUP, data })
        },

        callData: () => dispatch({ type: CALL_DATA })
    }
}

export default connect(null, mapDispatchToProps)(FixExperience);
