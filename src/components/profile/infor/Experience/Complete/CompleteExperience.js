import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { timeConverter } from '../../../../../assets/js/convertTime';
import { Row, Col, DatePicker, Input } from 'antd';
import { DELETE } from '../../../../../const/method';
import { unSuccessUpdate, wantingValidation, successUpdate, allMsg } from '../../../../../const/msg';
import { PUT } from '../../../../../const/method';
import { experienceController } from '../../../../../service/api/private.api';
import { _requestToServer } from '../../../../../service/exec';
import { connect } from 'react-redux';
import { OPEN_POPUP } from '../../../../../redux/const/popup';
import { CALL_DATA } from '../../../../../redux-saga/actionCreator/PersonInfo';
import moment from 'moment';

const mapDispatchToProps = (dispatch) => {
    return {
        openPopup: (data) => dispatch({ type: OPEN_POPUP, data }),
        callData: () => dispatch({ type: CALL_DATA }),
    }
}

class CompleteExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '',
            experience: {
                jobName: '',
                companyName: '',
                startedDate: 0,
                finishedDate: 0,
                description: ''
            },
            id: ''
        }
    }

    componentWillMount = () => {
        let { item, complete } = this.props;
        let { experience, activeKey } = this.state;
        experience = item;
        activeKey = complete
        this.setState({ experience, activeKey });
    }

    _handleInput = (event) => {
        let value = event.target.value;
        let id = event.target.id;
        let { experience } = this.state;
        experience[id] = value;
        this.setState({ experience });
    }

    _handleSelect = (key) => {
        let { activeKey } = this.state;
        activeKey = key;
        this.setState({ activeKey })
    }

    _handleChangeStartedTime = (value) => {
        let { experience } = this.state;
        if (value !== null) {
            let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
            experience.startedDate = time;
            this.setState({ experience });
        }
    }

    _handleChangeFinishedTime = (value) => {
        let { experience } = this.state;
        if (value !== null) {
            let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
            experience.finishedDate = time;
            this.setState({ experience });
        }
    }

    _createRequest = (method) => {
        this.requesToServer(method)
    }

    async requesToServer(method) {
        let { experience } = this.state;
        let { id, complete } = this.props;
        let msg = unSuccessUpdate;
        let res;

        if (method === PUT) {
            if (experience.companyName === '' || experience.jobName === '' || experience.startedDate === null || experience.fininshedDate === null) {
                msg = wantingValidation;
                this.props.openPopup({ msg, type: "unSuccess" });
            } else

                if (experience.startedDate > experience.finishedDate) {
                    msg = 'Ngày bắt đầu cần nhỏ hơn ngày kết thúc';
                    this.props.openPopup({ msg, type: "unSuccess" });
                } else {
                    try {
                        res = await _requestToServer(PUT, experience, experienceController + '/' + id, null, null);
                    }
                    catch (err) {
                        this.props.openPopup({ msg: allMsg.unSuccess, type: "unSuccess" });
                    };
                }

        }

        if (method === DELETE) {
            try {
                res = await _requestToServer(DELETE, null, experienceController + '/' + id, null, null);
            } catch (err) {
                this.props.openPopup({ msg: "Xoá thành công", type: "unSuccess" });
            };
        }

        if (res && res.code === 200) {
            msg = successUpdate;
            this.props.callData();
            this.props.openPopup({msg: allMsg.success , type: "success"});
            this._handleSelect(complete);
        }
    }

    render() {
        let { item, complete, fix } = this.props;
        let { experience, activeKey } = this.state;
        let startedDate = timeConverter(experience.startedDate);
        let finishedDate = timeConverter(experience.finishedDate);
        return (
            <Tabs activeKey={activeKey} onSelect={() => { }}>
                {/* Delete */}
                <Tab eventKey={complete} onSelect={this._handleSelect}  >
                    <div className='wrapper' id={complete} >
                        <div className="edit-delete">
                            <i className="fa fa-edit" onClick={() => { this._handleSelect(fix) }} ></i>
                            <i className="fa fa-trash" onClick={() => { this._createRequest(DELETE) }}></i>
                        </div>
                        <pre>
                            <p className='header-experience'>{item.jobName}</p>
                            <p>Nơi làm việc: {item.companyName}</p>
                            <p>{timeConverter(item.startedDate)} đến {timeConverter(item.finishedDate)}</p>
                            <p>Mô tả: {item.description}</p>
                        </pre>
                    </div>
                </Tab>

                {/* Update */}
                <Tab eventKey={fix}>
                    <div className='wrapper'>
                        <div className='experience'>
                            {/* jobName */}
                            <div className='experience-content'>
                                <p><label style={{ color: 'red' }}>*</label>Tên vị trí</p>
                                <Input id='jobName' type='text' className='input_outside' placeholder='Ví dụ: UX-UI Designer' value={experience.jobName} onChange={this._handleInput} />
                            </div>

                            {/* Company */}
                            <div className='experience-content'>
                                <p><label style={{ color: 'red' }}>*</label>Tên Tổ chức</p>
                                <Input id='companyName' type='text' className='input_outside' placeholder='Ví dụ: Công ti cổ phần Works.vn' value={experience.companyName} onChange={this._handleInput} />
                            </div>

                            <div className='experience-content'>
                                <Row >
                                    {/* Started Date */}
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className='column' >
                                        <p> <label style={{ color: 'red' }}>*</label>Từ tháng</p>
                                        <DatePicker
                                            defaultValue={moment(startedDate, 'DD/MM/YY')}
                                            onChange={this._handleChangeStartedTime}
                                            placeholder='Ví dụ: 26/6/2018'
                                        />
                                    </Col>
                                    {/* DatePicker Finished Time */}
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className='column'>
                                        <p><label style={{ color: 'red' }}>*</label>Từ tháng</p>
                                        <DatePicker
                                            defaultValue={moment(finishedDate, 'DD/MM/YY')}
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
                                <button className='button-request' onClick={() => (this._handleSelect(complete))}> Hủy</button>
                            </Col>
                            <Col xs={12}>
                                <button className='button-request' onClick={() => (this._createRequest(PUT))}> Lưu</button>
                            </Col>
                        </Row>
                    </div>
                </Tab>
            </Tabs>
        );
    }
}

export default connect(null, mapDispatchToProps)(CompleteExperience);
