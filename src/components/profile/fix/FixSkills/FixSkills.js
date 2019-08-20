import React, { Component } from 'react';
import './FixSkills.scss';
// import * as _ from 'lodash';
import { connect } from 'react-redux';
import { _requestToServer } from '../../../../service/exec';
import { skillsController } from '../../../../service/api/private.api';
import { allMsg } from '../../../../const/msg';
import { OPEN_POPUP } from './../../../../redux/const/popup';
import { CALL_DATA } from './../../../../redux-saga/actionCreator/PersonInfo';
import { _get } from '../../../../service/base-api';
import { list_skills_api } from '../../../../service/api/public.api';
import { public_host } from '../../../../environment/development';
import { PUT } from './../../../../const/method';
import { Row, Col } from 'react-bootstrap';

const mapDispatchToProps = (dispatch) => {
    return {
        openPopup: (data) => {
            dispatch({ type: OPEN_POPUP, data })
        },

        callData: () => dispatch({ type: CALL_DATA }),
    }
}

const mapStateToProps = (state) => {
    return {
        skills: state.handlePersonalInfo.skills
    }
}

class FixSkills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            state: ['Thiết kế', 'PHP', 'html'],
            list_skills: [],
            skills: [],
            params: {
                pageIndex: 0,
                pageSize: 0,
            },
            list_tag: []
        }

        this.list_tag = [];
    }
    async  componentWillMount() {
        try {
            let { skills } = this.props;
            let { list_skills } = this.state;
            let res = await _get({ pageIndex: 0, pageSize: 0 }, list_skills_api, public_host);
            list_skills = res.data.items;
            this.setState({ list_skills, skills });
        } catch (err) {
            throw err;
        }

    }

    _addLabel = (event) => {
        let { list_tag } = this.state;
        let id = parseInt(event.target.id);
        let name = event.target.innerText;

        if (list_tag.length <= 10) {

            list_tag.push({ id, name });
            this.setState({ list_tag });
        }
    }

    _handleData = () => {
        let { skills, list_tag } = this.state;
        let new_skills = skills.concat(list_tag);
        this.setState({ skills: new_skills, list_tag: [] });
    }

    _removeTag = (index_skills, name_skills, id_skills) => {
        let { skills, list_skills } = this.state;
        let index = index_skills
        if (index !== -1) {
            skills.splice(index, 1);
        }
        list_skills.push({ id: id_skills, name: name_skills })
        this.setState({ skills, list_skills })
    }

    _removeTagInput = (index_skills, name_skills, id_skills) => {
        let { list_tag, list_skills } = this.state;
        let index = index_skills
        if (index !== -1) {
            list_tag.splice(index, 1);
        }
        list_skills.push({ id: id_skills, name: name_skills })
        this.setState({ list_tag, list_skills })
    }

    _createRequest = () => {
        this.requestToServer();
    }

    async requestToServer() {
        let { skills } = this.state;
        let array_list_skills = skills.map((item) => {
            return item.id;
        })

        try {
            let res = await _requestToServer(PUT, array_list_skills, skillsController, null, null);
            if (res.code === 200) {
                this.props.openPopup({ msg: allMsg.success, type: "success" })
            }
            this.props.callData();
        } catch (err) {
            this.props.openPopup({ msg: allMsg.unSuccessUpdate, type: "unSuccess" })
        }

        setTimeout(() => {
            this.props._fixData('skills')
        }, 1500);
    }

    render() {
        let { list_skills, skills, list_tag } = this.state;
        return (
            <div className='wrapper'>
                <div className='ability'>
                    {/* List Skills */}
                    <p>Thêm kĩ năng hoặc công việc phù hợp</p>
                    <div className='list-ability'>
                        {skills && skills.map((item, index) => {
                            return (
                                <label key={index} id={index} className='tag-ablity'>
                                    {item.name}
                                    <i id={index} className="fa fa-times" aria-hidden="true" width="5px" height='5px' onClick={() => { this._removeTag(index, item.name, item.id) }}></i>
                                </label>
                            );
                        })}
                    </div>

                    {/* Add new list */}
                    <div className='list-skills'>
                        <ul className='input-area' value={list_tag} >
                            <div
                                className='input-area-place'
                                style={{ display: list_tag.length > 0 ? 'none' : 'visible' }}
                            >
                                Thêm kĩ năng hoặc công việc
                            </div>
                            {list_tag && list_tag.map((item, index) => {
                                return (
                                    <label id={item.id} key={'tag' + index}>
                                        {item.name + ' '}
                                        <i id={index} className="fa fa-times" aria-hidden="true" width="5px" height='5px' onClick={() => { this._removeTagInput(index, item.name, item.id) }}></i>
                                    </label>)
                            })}
                        </ul>
                        <button className="btn-add" onClick={this._handleData}>
                            <i className="fa fa-plus" ></i>
                        </button>
                        <label>
                            {list_tag && list_tag.length > 10 ? 'Bạn thêm quá nhiều trường kĩ năng' : 'Số kĩ năng chuẩn bị thêm ' + list_tag.length + ' kĩ năng'}
                        </label>
                        <ul className='data-api'>
                            {list_skills && list_skills.map((item, index) => {
                                return (
                                    <label id={item.id} key={index} onClick={this._addLabel}>
                                        {item.name}
                                    </label>
                                )
                            })}
                        </ul>
                    </div>
                    <Row className="holder-button" >
                        <Col xs={6}>
                            <button className='button-request' onClick={() => { this.props._fixData('skills') }}> Hủy</button>
                        </Col>
                        <Col xs={6}>
                            <button className='button-request' onClick={this._createRequest}> Lưu</button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixSkills);
