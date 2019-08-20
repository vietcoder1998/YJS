import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../src/logo-01.png';
import { connect } from 'react-redux';
import './Header.scss';
import { OPEN_POPUP } from '../../../redux/const/popup';
import { FAIL_AUTH } from '../../../redux/const/authen';
import clearStorage from '../../../service/clearStorage';
import { Tooltip, Icon } from 'antd';
import { OPEN_SIDE_BAR } from './../../../redux/const/sidebar.state';
import Notification from './notification/Notification';
import { allMsg } from '../../../const/msg';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_menu: false,
      isAuthen: false,
      name: '',
      show_noti: false,
      show_header: true
    }
  }

  _handleStateMenu = () => {
    let show_menu = !this.state.show_menu
    this.setState({ show_menu })
  }

  componentWillMount() {
    this._loadLocal();
    let { name } = this.state;
    name = localStorage.getItem('name');
    this.setState({ name });

  }

  componentWillReceiveProps(nextProps) {
    localStorage.getItem('name')
  }

  _loadLocal = () => {
    let { isAuthen } = this.props;
    this.setState({
      isAuthen
    })
  }

  _clearStorage = () => {
    clearStorage();
    let msg = allMsg.logOut;
    this.props.openPopup({ msg, type: 'success' });
    setTimeout(() => { window.location.reload() }, 2500);
  }

  _showSideBar = () => {
    this.props.openSideBar();
  }

  render() {
    let { isAuthen, show_menu, name, show_noti } = this.state;
    return (
      <React.Fragment>
        {show_noti ? <Notification /> : null}
        <div className="header">
          <div className="logo">
            <Link to="/"><img width={120} height={40} src={logo} alt="itea-scan" /> </Link>
          </div>
          <div className='direct-page'>
            <a href='/'> <Tooltip placement="bottom" title={'Home'}>Trang chủ</Tooltip></a>
            <a href='/result'><Tooltip placement="bottom" title={'Find Jobs'}>Tìm việc</Tooltip></a>
            <a href='/'><Tooltip placement="bottom" title={'Create CV'}>Tạo hồ sơ</Tooltip></a>
            <a href='/save-job'><Tooltip placement="bottom" title={'Blog Skills'}>Lịch sử </Tooltip></a>
          </div>
          <div className='function'>
            {/* IconBell */}
            <span className='label-function' onClick={() => { this.setState({ show_noti: !show_noti }) }}>
              <Tooltip placement="left" title={'Thông báo'}>
                <Icon type="bell" />
              </Tooltip>
              <div id='borderLeft'></div>

            </span>

            {/* Icon message */}
            <span className='label-function' >
              <Tooltip placement="bottomLeft" title={'Tin nhắn'}>
                <Icon type="message" />
              </Tooltip>
              <div id='borderLeft'></div>
            </span>

            {/* Side Bar */}
            <span className='label-function show-mobile' onClick={this._showSideBar}>
              <Icon type="bars" onClick={this.openBar} />
            </span>

            {/* Check Is Login */}

            {isAuthen ? (<span className='label-function hidden-mobile' onClick={this._handleStateMenu}>
              <Icon type="user" />
              <label>{name}</label>
              <Icon type={show_menu ? 'up' : 'down'} />
              <ul className='menu' style={{ display: show_menu === true ? 'block' : 'none' }}>
                <li><a href='/profile'>Profile</a></li>
                <li><a href='/reset-password'>Đổi mật khẩu</a></li>
                <li onClick={this._clearStorage}>Đăng xuất</li>
              </ul>
            </span>) :
              (<span className='label-login hidden-mobile'>
                <a href='/login'>Đăng nhập</a>
                <label>|</label>
                <a href='/register'>Đăng Kí</a>
              </span>
              )}
          </div>
        </div>
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthen: state.handleAuthState.isAuthen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openPopup: (data, reload) => dispatch({ type: OPEN_POPUP, data, reload }),
    logOut: (data, reload) => dispatch({ type: FAIL_AUTH, data, reload }),
    openSideBar: () => dispatch({ type: OPEN_SIDE_BAR }),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);