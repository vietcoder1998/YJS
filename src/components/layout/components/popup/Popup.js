import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Popup.scss';
import { CLOSE_POPUP } from '../../../../redux/const/popup';
import { Modal, Icon } from 'antd';
// import { successUpdate } from '../../../const/msg';

const mapStateToProps = (state) => {
    return {
        data: state.handlePopupState.data,
        is_show: state.handlePopupState.is_show
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        closePopup: () => {
            dispatch({
                type: CLOSE_POPUP
            })
        },
    }
}

class Popup extends Component {

    _closePopup = () => {
        this.props.closePopup();
    }

    render() {
        let { data, is_show } = this.props;
        let icon = null;
        switch (data.type) {
            case 'success':
                icon = <Icon type="check-circle" theme="twoTone" twoToneColor='#52c41a' />
                break;
            case 'validate':
                icon = <Icon type="info-circle" theme="twoTone" twoToneColor='orange' />
                break;
            default:
                icon = <Icon type="close-circle" theme="twoTone" twoToneColor='red' />
                break;
        }

        return (
            <Modal visible={is_show} onCancel={this._closePopup} onOk={this._closePopup} title="Works.vn thông báo"  >
                <div className='popup-data'>
                    <p className='a_c'>{data.msg}</p>
                    <p className='a_c' style={{ fontSize: '40px' }}>
                        {icon}
                    </p>
                </div>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Popup);