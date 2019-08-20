import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Row, Col, DatePicker, Input } from 'antd';
import { allMsg } from '../../../../../const/msg';
import { PUT, DELETE } from '../../../../../const/method';
import { _requestToServer } from '../../../../../service/exec';
import { timeConverter } from '../../../../../assets/js/convertTime';
import { educationController } from '../../../../../service/api/private.api';
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

class CompleteEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            education: {
                school: "",
                branchOfLearning: "",
                startedDate: 0,
                finishedDate: 0,
                description: ''
            },

            activeKey: ''
        }
    }

    componentWillMount = () => {
        let { item, complete } = this.props;
        let { education, activeKey } = this.state;
        if (item !== null) {
            education = item;
        }
        activeKey = complete;
        this.setState({ education, activeKey });
    }

    _handleSelect = (key) => {
        let { activeKey } = this.state;
        activeKey = key;
        this.setState({ activeKey })
    }

    _handleData = (event) => {
        let { education } = this.state;
        let params;
        params = event.target.id;
        education[params] = event.target.value;
        this.setState({ education });
    }

    _handleChangeStartedTime = (value) => {
        let { education } = this.state;
        let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
        education.startedDate = time;
        this.setState({ education });
    }

    _handleChangeFinishedTime = (value) => {
        let { education } = this.state;
        let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
        education.finishedDate = time;
        this.setState({ education });
    }

    _createRequest = (method) => {
        let { education } = this.state;
        this.requestServer(method, education);
    }

    async requestServer(method, education) {
        let res;
        let { id } = this.props;
        if (method === PUT) {
            if (education.school === '' || education.branchOfLearning === '' || education.startDate === null || education.fininshedDate === null) {
                this.props.openPopup({msg : "Thông tin bị thiếu", type: "validation"});
            } else if (education.startedDate > education.finishedDate) {
                let msg = 'Ngày bắt đầu cần nhỏ hơn ngày kết thúc';
                this.props.openPopup({msg , type: 'validation'});
            }
            else {
                try {
                    res = await _requestToServer(PUT, education, educationController + '/' + id, null, null);
                } catch (err) {
                    this.props.openPopup({ msg: allMsg.unSuccess, type: 'success' });
                }
            }
        } else if (method === DELETE) {
            try {
                res = await _requestToServer(DELETE, null, educationController + '/' + id, null, null);
            } catch (err) {
                this.props.openPopup({ msg: allMsg.unSuccess, type: 'success' });
            }
        }

        if (res && res.code === 200) {
            this.props.callData();
            this.props.openPopup({ msg: allMsg.updateSuccess, type: 'success' });
        }
    }

    render() {
        let { item, complete, fix } = this.props;
        let { education, activeKey } = this.state;
        let startedDate = timeConverter(education.startedDate);
        let finishedDate = timeConverter(education.finishedDate);
        return (
            <Tabs activeKey={activeKey} onSelect={() => { }}>
                {/* Delete */}
                <Tab eventKey={complete}>
                    <div className='wrapper' id={complete}>
                        <div className="edit-delete">
                            <i className="fa fa-edit" onClick={() => { this._handleSelect(fix) }} ></i>
                            <i className="fa fa-trash" onClick={() => { this._createRequest(DELETE) }}></i>
                        </div>
                        <pre>
                            <p className='header-experience'>{item.label}</p>
                            <p>Nơi học: {item.school}</p>
                            <p>Ngành học: {item.branchOfLearning}</p>
                            <p>{timeConverter(item.startedDate)} đến {timeConverter(item.finishedDate)}</p>
                            <p>Mô tả: {item.description}</p>
                        </pre>
                    </div>
                </Tab>

                {/* Update */}
                <Tab eventKey={fix}>
                    <div className='wrapper'>
                        <div className='education'>
                            {/* Branch of learning */}
                            <div className='education-content'>
                                <p><label style={{ color: 'red' }}>*</label>Tên ngành/nghề đào tạo</p>
                                <Input id='branchOfLearning' className='input_outside' placeholder='Ví dụ: Công nghệ thông tin' value={education.branchOfLearning} onChange={this._handleData} />
                            </div>

                            {/* School */}
                            <div className='education-content'>
                                <p><label style={{ color: 'red' }}>*</label>Tên cơ sở đào tạo</p>
                                <Input id='school' className='input_outside' placeholder='Ví dụ: Trường Cao đẳng nghề' value={education.school} onChange={this._handleData} />
                            </div>

                            <div className='education-content'>
                                <Row >
                                    {/* Started Date */}
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className='column'>
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
                            <div className='education-content'>
                                <p> <label style={{ color: 'red' }}>*</label>Mô tả nội dung</p>
                                <textarea
                                    id='description'
                                    placeholder='Mô tả sơ lược quá trình học bạn làm những công việc gì, có tham gia các hoạt động ngoại khóa và chức vụ gì trong lớp'
                                    value={education.description}
                                    onChange={this._handleData}
                                >
                                </textarea>
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

export default connect(null, mapDispatchToProps)(CompleteEducation);
