import React, { Component } from 'react';
import './SideBar.scss';
import { connect } from 'react-redux';
import { OPEN_POPUP } from '../../../redux/const/popup';
import { FAIL_AUTH } from '../../../redux/const/authen';
import clearStorage from '../../../service/clearStorage';
import { CLOSE_SIDE_BAR } from '../../../redux/const/sidebar.state';
import { Icon } from 'antd';
// import CoverImage from '../../../assets/image/Abstract-Envelope.svg';
import { allMsg } from './../../../const/msg';


class SideBar extends Component {

    constructor() {
        super();
        this.state = {
            show_sidebar: false
        }
    }

    _closeSideBar = () => {
        this.props.closeSideBar()
    }

    openBar = () => {
        this.setState({
            show_sidebar: true
        })
    }

    _clearStorage = () => {
        clearStorage();
        let msg = allMsg.logOut;
        this.props.openPopup({ msg, type: 'success' });
        setTimeout(() => { window.location.reload() }, 2500);
    }

    render() {
        let { show_sidebar, isAuthen } = this.props;
        return (
            <div className="sidebar">
                <div className="background-sidebar" style={{ display: show_sidebar ? 'block' : 'none' }} onClick={this._closeSideBar}></div>
                {/* Side Bar */}
                <div className="side-bar_right" style={{ width: show_sidebar ? '90vw' : '0pc' }}>
                    <div className='' style={{ display: show_sidebar ? 'block' : 'none' }}>
                        <div className='close-sidebar'>
                            <Icon type="close" onClick={this._closeSideBar} />
                        </div>
                        {/* Cover Image */}
                        <div className='cover-img' style={{ display: show_sidebar ? 'block' : 'none' }}>
                        </div>

                        <div className="content-sidebar">
                            <ul>
                                <li><Icon type="home" /><a href='/'>Trang chủ</a></li>
                                <li><i className="fa fa-briefcase"></i><a href='/'>Tìm việc</a></li>
                                <li><Icon type="user-add" /><a href='/'>Tạo CV</a></li>
                                <li className='b_b'><Icon type="book" /><a href='/'>Kĩ năng</a></li>
                                <li style={{ display: isAuthen ? 'block' : 'none' }}><Icon type="message" /><a href='/profile'>Tin nhắn</a></li>
                                <li style={{ display: isAuthen ? 'block' : 'none' }}><Icon type="flag" /><a href='/save-job'>Lịch sử ứng tuyển</a></li>
                                <li style={{ display: isAuthen ? 'block' : 'none' }}><Icon type="notification" /><a href='/notifications'>Thông báo</a></li>
                                <li style={{ display: isAuthen ? 'block' : 'none' }}><Icon type="user" /><a href='/profile'>Hồ sơ</a></li>
                                <li style={{ display: isAuthen ? 'block' : 'none' }} onClick={this._clearStorage}><Icon type="logout" />Đăng xuất</li>
                                <li style={{ display: isAuthen ? 'none' : 'block' }}><Icon type="key" /><a href='/login'>Đăng nhập</a></li>
                                <li style={{ display: isAuthen ? 'none' : 'block' }}><Icon type="solution" /><a href='/register'>Đăng kí</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthen: state.handleAuthState.isAuthen,
        show_popup: state.handlePopupState,
        show_sidebar: state.handleSideBarState.show_sidebar,
        personal_info: state.handlePersonalInfo.personal_info
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        openPopup: (data, reload) => dispatch({ type: OPEN_POPUP, data, reload }),
        logOut: ( reload) => dispatch({ type: FAIL_AUTH, reload }),
        closeSideBar: () => dispatch({ type: CLOSE_SIDE_BAR })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);