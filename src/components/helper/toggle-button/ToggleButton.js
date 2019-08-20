import React, { Component } from 'react';
import './ToggleButton.scss';
import { connect } from 'react-redux';
import { _requestToServer } from '../../../service/exec';
import { isLookingFobJobState } from '../../../service/api/private.api';
import { PUT } from '../../../const/method';
import { OPEN_POPUP } from '../../../redux/const/popup';
import { CALL_DATA } from './../../../redux-saga/actionCreator/PersonInfo';
import { allMsg } from './../../../const/msg';

const mapDispatchToProps = (dispatch) => {
    return {
        openPopup: (data) => dispatch({ type: OPEN_POPUP, data }),
        callData: () => dispatch({ type: CALL_DATA })
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.handlePersonalInfo.personal_info.isLookingForJob
    }
}


class ButtonToggle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            state: true
        }
    }

    componentWillMount() {
        let { state } = this.props;
        this.setState({ state });
    }

    _handleStateButton = () => {
        let { state } = this.state;
        state = !state;
        this.setState({ state });
        this.requestToSever(state);
    }

    async requestToSever(state) {
        let msg = allMsg.unSuccessUpdate;
        try {
            let res = await _requestToServer(PUT, null, isLookingFobJobState + '/' + state);
            if (res) {
                msg = allMsg.findJobStateSuccess;
                await this.props.callData();
                await this.props.openPopup({msg, type: 'success'});
            } else {
                this.props.openPopup({msg, type: 'unSuccess'});
            }


        } catch (err) {
            throw err;
        }
    }

    render() {
        let { state } = this.state;
        return (
            <div className='toggle-button' >
                <div className='toggle-wrapper' onClick={this._handleStateButton} style={{ backgroundColor: state === true ? 'rgb(9, 209, 9)' : 'gray', borderColor: state === true ? 'rgb(9, 209, 9)' : 'gray' }}>
                    <div className='toggle-range' style={{ width: state === true ? '9px' : '0px' }}></div>
                    <div className='toggle-state'></div>
                </div>
                <div>
                    {this.state.state === true ? 'Đang tìm việc' : 'Đã có việc'}
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonToggle);
