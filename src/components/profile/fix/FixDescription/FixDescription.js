import React, { Component } from 'react';
import './FixDescription.scss';

import { putDescription } from '../../../../service/api/private.api';
import { sendStringHeader } from '../../../../service/auth';
import { connect } from 'react-redux';
import { OPEN_POPUP } from './../../../../redux/const/popup';
import { _requestToServer } from '../../../../service/exec';
import { CALL_DATA } from './../../../../redux-saga/actionCreator/PersonInfo';
import { Row, Col } from 'react-bootstrap';
import { allMsg } from './../../../../const/msg';

const mapDispatchToProps = (dispatch, ownProps) => ({
    openPopup: (data) => { dispatch({ type: OPEN_POPUP, data }) },
    reloadData: () => { dispatch({ type: CALL_DATA }) }
});

const mapStateToProps = state => {
    return {
        description: state.handlePersonalInfo.description
    }
}

class FixDescription extends Component {

    constructor(props) {
        super(props)
        this.state = {
            description: ''
        }
    }

    componentWillMount() {
        let description = this.props.description;

        this.setState({
            description
        })
    }

    _handleDescription = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    _createRequest = () => {
        this._sendRequest();
    }

    async _sendRequest() {
        let { description } = this.state;
        let res_put_decription = await _requestToServer(this.props.method, description, putDescription, null, sendStringHeader);

        let msg = allMsg.unSuccessUpdate;
        let type = 'unSuccess';
        try {
            if (res_put_decription.code === 200) {
                msg = allMsg.updateSuccess;
                type = 'success'
            }
            this.props.openPopup({ msg, type });
            this.props.reloadData();
        } catch (err) {
            this.props.openPopup({ msg: allMsg.unSuccessUpdate, type: "unSuccess" })
        }
        setTimeout(() => {
            this.props._fixData('description');
        }, 500);
    }

    render() {

        let { description } = this.state;
        return (
            <div className='wrapper'>
                <p>Mô tả bản thân</p>
                <textarea placeholder='Giới thiệu tính cách, sở thích, câu nói yêu thích của bản thân' onChange={this._handleDescription} value={description}></textarea>
                <Row className="holder-button" >
                    <Col xs={6}>
                        <button className='button-request'  onClick={() => {this.props._fixData('description')}}> Hủy</button>
                    </Col>
                    <Col xs={6}>
                        <button className='button-request' onClick={this._createRequest}> Lưu</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixDescription);
