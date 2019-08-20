import React, { Component } from 'react';
import './FixLanguageSkills.scss';
import { Row, Col, Input } from 'antd';
import { _get } from '../../../../service/base-api';
import { list_languages } from '../../../../service/api/public.api';
import { public_host } from '../../../../environment/development';
import { connect } from 'react-redux';
import { POST } from '../../../../const/method';
import { _requestToServer } from '../../../../service/exec';
import { languageSkillsController } from '../../../../service/api/private.api';
import { PUT } from './../../../../const/method';
import { successUpdate, unSuccessUpdate, wantingValidation, allMsg } from '../../../../const/msg';
import { OPEN_POPUP } from './../../../../redux/const/popup';
import { CALL_DATA } from './../../../../redux-saga/actionCreator/PersonInfo';


class FixLanguageSkills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_language: [],
            is_show: false,
            choose_lg: {},
            languageName: '',
            language_skills: {
                languageID: 0,
                level: "",
                certificate: "",
                score: 0
            },
            id: ''
        }
    }

    async componentWillMount() {
        let { list_language } = this.state;
        let res_language = await _get(null, list_languages, public_host);
        list_language = res_language.data.items;
        this.setState({ list_language });
    }

    _handleShowListLanguage = () => {
        let { is_show } = this.state;
        this.setState({ is_show: !is_show });
    }

    _chooseLanguage = (name, index, id_lg) => {
        let { languageName, language_skills, id } = this.state;
        languageName = name;
        language_skills.languageID = index + 1;
        id = id_lg;
        this.setState({ languageName, language_skills, id });
        this._handleShowListLanguage();
    }

    _handleLanguageSkills = (event) => {
        let { language_skills } = this.state;
        let param = event.target.id;
        let value = event.target.value;
        language_skills[param] = value;
        this.setState({ language_skills })
    }

    _handleCertificate = (event) => {
        let { language_skills } = this.state;
        language_skills.level = event.target.value;
        this.setState({ language_skills })
    }

    _createRequest = () => {
        this.requestServer(this.props.method);
    }

    async requestServer(method) {
        let msg = unSuccessUpdate;
        let { language_skills } = this.state;
        if (language_skills.languageID === null || language_skills.level === '') {
            msg = wantingValidation
            this.props.openPopup(msg);
        } else if (method === POST) {
            try {
                let res = await _requestToServer(POST, language_skills, languageSkillsController, null, null);
                if (res.code === 200) {
                    msg = successUpdate
                    this.props.callData();
                    this.props.openPopup({msg: allMsg.updateSuccess, type: "success"});
                }
            } catch (err) {
                this.props.openPopup({ msg: allMsg.unSuccessUpdate, type: "unSuccess" })
            }
            setTimeout(() => {
                this.props._fixData('languageSkills');
            }, 500);

        } else if (method === PUT) {

        }
    }

    render() {
        let { list_language, is_show, languageName, language_skills } = this.state;
        let icon_choose = <i className="fa fa-chevron-down"></i>;
        let icon_not_choose = <i className="fa fa-chevron-down"></i>;
        return (
            <div className='wrapper language-skills-fix'>
                <Row>
                    <Col xs={24} md={12} lg={12} sm={24}>
                        <ul className='language-skills-ul'>
                            <li onClick={this._handleShowListLanguage} style={{ borderBottom: "solid gray 1px" }}>
                                <span>
                                    {languageName === '' ? 'chọn ngôn ngữ' : languageName}{is_show === true ? icon_not_choose : icon_choose}
                                </span>
                            </li>
                            <div className='list_language' style={{ display: is_show === true ? 'block' : 'none' }}>
                                {list_language.map((item, index) => {
                                    return <li key={index} onClick={this._chooseLanguage.bind(this, item.name, index, item.id)}>{item.name}</li>
                                })}
                            </div>
                        </ul>

                    </Col>
                    <Col xs={12} md={12} lg={12} sm={12} className='column'>
                        <div className='chose-degree'>
                            <label>
                                <input type="radio" name="gender" value="Sơ cấp" onClick={this._handleCertificate} /> Sơ cấp
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Trung cấp" onClick={this._handleCertificate} /> Trung cấp
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Cao cấp" onClick={this._handleCertificate} /> Cao cấp
                            </label>
                            <label>
                                <input type="radio" name="gender" value="Bản địa" onClick={this._handleCertificate} /> Bản địa
                            </label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} md={12} lg={12} sm={24} className='column'>
                        <p className='language-input'>
                            Chứng chỉ
                        </p>
                        <Input id='certificate' placeholder='Certificate' value={language_skills.certificate} onChange={this._handleLanguageSkills} />

                    </Col>
                    <Col xs={24} md={12} lg={12} sm={24}>
                        <p>
                            Điểm số
                        </p>
                        <Input id='score' placeholder='Score' value={language_skills.score} onChange={this._handleLanguageSkills} />
                    </Col>

                </Row>
                {/* Button holder */}
                <Row className="holder-button" >
                    <Col xs={12}>
                        <button className='button-request' onClick={() => { this.props._fixData('languageSkills') }}> Hủy</button>
                    </Col>
                    <Col xs={12}>
                        <button className='button-request' onClick={this._createRequest}> Lưu</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openPopup: (data) => {
            dispatch({ type: OPEN_POPUP, data })
        },
        callData: () => dispatch({ type: CALL_DATA }),
    }
}
export default connect(null, mapDispatchToProps)(FixLanguageSkills);
