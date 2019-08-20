import React, { Component } from 'react';
import './CompleteLanguageSkills.scss'
import { connect } from 'react-redux';
import { _requestToServer } from '../../../../../service/exec';
import { Tabs, Tab } from 'react-bootstrap';
import { Row, Col, Input } from 'antd';
import ChooseLanguage from '../../../../layout/choose-language/ChooseLanguage';
import { DELETE } from '../../../../../const/method';
import { OPEN_POPUP } from '../../../../../redux/const/popup';
import { CALL_DATA } from '../../../../../redux-saga/actionCreator/PersonInfo';
import { allMsg } from '../../../../../const/msg';
import { PUT } from '../../../../../const/method';
import { languageSkillsController } from '../../../../../service/api/private.api';

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openPopup: (data) => dispatch({ type: OPEN_POPUP, data }),
        callData: () => dispatch({ type: CALL_DATA }),
    }
}

class CompleteLanguageSkills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language_skills: {
                languageID: 0,
                level: "",
                certificate: "",
                score: 0,
            },
            id: '',
            activeKey: 'complete',
            list_choose_degree: [
                { id: 1, value: 'Sơ cấp' },
                { id: 2, value: 'Trung cấp' },
                { id: 3, value: 'Cao Cấp' },
                { id: 4, value: ' Bản địa' }
            ],
        }

    }

    componentWillMount = () => {
        let { item, complete } = this.props;
        let { language_skills, activeKey } = this.state;
        if (item !== null) {
            language_skills = item;
            activeKey = complete;
        }
        this.setState({ language_skills, activeKey });
    }

    _deleteLanguageSkill = () => {
        console.log('hello')
        let { id } = this.props.id;
        this._createRequest(id);
    }

    _handleSelect = (key) => {
        let { activeKey } = this.state;
        activeKey = key;
        this.setState({ activeKey })
    }

    _handleLevel = (event) => {
        let { language_skills } = this.state;
        language_skills.level = event.target.value;
        this.setState({ language_skills })
    }

    _handleLanguageSkills = (event) => {
        let { language_skills } = this.state;
        let param = event.target.id;
        let value = event.target.value;
        language_skills[param] = value;
        this.setState({ language_skills })
    }

    _createRequest = (method) => {
        let { language_skills } = this.state;
        let { complete } = this.props;
        let cut_id = document.getElementById('language' + complete).innerText;
        let _arrayCut = cut_id.split(".");
        language_skills.languageID = _arrayCut[0];
        this.requestServer(method, language_skills);
    }

    async requestServer(method, language_skills) {
        let res;
        let { id, complete } = this.props;
        try {
            if (method === PUT) {
                if (language_skills.languageID === null || language_skills.level === '') {
                    this.props.openPopup({msg: allMsg.validation , type: 'validation'});
                } else {
                    try {
                        res = await _requestToServer(PUT, language_skills, languageSkillsController + '/' + id, null, null);

                    } catch (err) {
                        this.props.openPopup({ msg: allMsg.success, type: "unSuccess" });
                    };
                }
            } else if (method === DELETE) {
                try {
                    res = await _requestToServer(DELETE, null, languageSkillsController + '/' + id, null, null);
                } catch (err) {
                    this.props.openPopup({ msg: "Xoá thành công", type: "success" });
                };

            }

            if (res.code === 200) {
                this.props.callData();
                this.props.openPopup({msg: allMsg.updateSuccess, type: "success"});
                this._handleSelect(complete)
            }
        }catch (err) {
            this.props.openPopup({ msg: allMsg.unSuccess, type: "unSuccess" });
        };

    }

    render() {
        let { index, item, complete, fix } = this.props;
        let { language_skills, activeKey } = this.state;
        return (
            <Tabs key={index} activeKey={activeKey} onSelect={() => { }} >
                {/* Update of delete */}
                <Tab eventKey={complete}>
                    <div className="language-skills" id={complete}>
                        {/* function for button */}
                        <div className="edit-delete">
                            <i id={index} className="fa fa-edit" onClick={() => { this._handleSelect(fix) }}></i>
                            <i id={index} className="fa fa-trash" onClick={() => { this._createRequest(DELETE) }}></i>
                        </div>
                        <Row>
                            <Col sm={24} md={12} lg={6}>
                                <label id="language-name">{item.language.name}</label>
                            </Col>
                            <Col sm={24} md={12} lg={6}>
                                <label>{item.level}</label>
                            </Col>
                            <Col sm={24} md={12} lg={6}>
                                <label>
                                    <i className="fa fa-graduation-cap"></i>
                                    Chứng chỉ: {item.certificate ? item.certificate : "Không"}
                                </label>
                            </Col>
                            <Col sm={24} md={12} lg={6}>
                                <label>
                                    <i className="fa fa-certificate"></i>
                                    Điểm số: {item.score ? item.score : "Không"}
                                </label>
                            </Col>
                        </Row>

                    </div>
                </Tab>

                {/* Fix */}
                <Tab eventKey={fix}  >
                    <div className='wrapper language-skills-fix'>
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className='collumn'>
                                <ChooseLanguage indicative={complete} languageID={language_skills.languageID} />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className='column'>
                                <div className='chose-degree'>
                                    <label>
                                        <input type="radio" name="gender" value="Sơ cấp" onClick={this._handleLevel} defaultChecked /> Sơ cấp
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="Trung cấp" onClick={this._handleLevel} /> Trung cấp
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="Cao cấp" onClick={this._handleLevel} /> Cao cấp
                                    </label>
                                    <label>
                                        <input type="radio" name="gender" value="Bản địa" onClick={this._handleLevel} /> Bản địa
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} className='column'>
                                <p className='language-input'>
                                    Chứng chỉ
                                </p>
                                <Input id='certificate' type='text' placeholder='Certificate' value={language_skills.certificate} onChange={this._handleLanguageSkills} />
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} className='column'>
                                <p>
                                    Điểm số
                                </p>
                                <Input id='score' type='text' placeholder='Score' value={language_skills.score} onChange={this._handleLanguageSkills} />
                            </Col>
                        </Row>
                        {/* Button holder */}
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
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CompleteLanguageSkills)