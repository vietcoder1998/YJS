import React, { Component } from 'react';
import Layout from '../layout/Layout';
import './Login.scss';

// import * as auth from '../../service/auth';
import { connect } from 'react-redux';
import { authUserPassword } from '../../service/api/private.api';
import { setAuthSate, loginHeaders } from '../../service/auth';
import { auth_host } from '../../environment/development';
import { OPEN_POPUP } from '../../redux/const/popup';
import { Input, Tooltip, Icon, Button } from 'antd';
import { Col } from 'antd';
import { EXACT_AUTH } from './../../redux/const/authen';
import { allMsg } from './../../const/msg';
import { _requestToServer } from '../../service/exec';
import { POST } from '../../const/method';



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_name: "",
            password: "",
        }

        this.key_icon = <i className="fa fa-key"></i>
        this.letter_icon = <i className="fa fa-envelope"></i>
    }

    componentWillMount() {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode === 13 ) {
                this._createResponse();
            }
        })
    }

    handleUsername = (e) => {
        this.setState({
            user_name: e.target.value
        })
    }

    handlePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    _createResponse = () => {
        this.getResponse()
    }

    async getResponse() {
        let data = {
            username: this.state.user_name,
            password: this.state.password
        }

        let msg = allMsg.failLogin;
        let type = "unSuccess"


        try {
            let res = await _requestToServer(POST, data, authUserPassword, auth_host, loginHeaders);
            if (res.code === 200) {
                setAuthSate(res);
                msg = allMsg.loginSuccess;
                type = "success";
                this.props.setAuthen();
                this.props.openPopup({ msg, type });
                let last_access = localStorage.getItem('last_access');
                setTimeout(() => {
                    if (last_access) {
                        window.location.assign(last_access);
                    } else {
                        window.location.assign('/');
                    }
                }, 1500);
            }
    
        } catch(err) {
            this.props.openPopup({ msg, type });
            console.log(err)
        }
        
    }

    componentWillUnmount () {
        document.removeEventListener('keydown');
    }

    render() {
        return (
            <Layout>
                {/* <form> */}
                <div className='content'>
                    <div className='login-content'>
                        <Col xs={0} sm={0} md={6} lg={6} xl={7} xxl={8} ></Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={10} xxl={8} >
                            <div className="login-form">
                                <p className='title a_c'>ĐĂNG NHẬP</p>
                                <form>
                                    <p className='nomal'>
                                        <Input
                                            placeholder="Email"
                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            suffix={
                                                <Tooltip title="Email của bạn">
                                                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                                </Tooltip>
                                            }
                                            value={this.state.user_name}
                                            onChange={this.handleUsername} type='text'
                                        />
                                    </p>
                                    <p className='nomal'>
                                        <Input
                                            placeholder="Password"
                                            prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            suffix={
                                                <Tooltip title="Điền đúng mật khẩu">
                                                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                                </Tooltip>
                                            }
                                            value={this.state.password}
                                            onChange={this.handlePassword}
                                            type='password'
                                        />
                                    </p>
                                    <p className='fogot-password a_r'>
                                        <a href='/forgot-password' style={{ color: 'gray' }} >Quên mật khẩu ?</a>
                                    </p>
                                    <p>
                                        <Button type='primary' onClick={this._createResponse} block>Đăng nhập</Button>
                                    </p>
                                    <p className='a_c'>
                                        hoặc
                                     </p>
                                    <p>
                                        <Button type='blue-7' onClick={this._createRequest} block>
                                            <i id='facebook_square' className="fa fa-facebook-square"></i>
                                            Đăng nhập với Facebook
                                        </Button>
                                    </p>
                                    <p className='a_c'>
                                        Bạn chưa có tài khoản ? <a href='/register' style={{ color: 'red' }}>Đăng kí</a>
                                    </p>
                                </form>
                            </div>
                        </Col>
                        <Col xs={0} sm={0} md={6} lg={6} xl={7} xxl={8} ></Col>
                    </div>
                </div>
                {/* </form> */}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        prop: state.prop
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openPopup: (data) => dispatch({ type: OPEN_POPUP, data }),
        setAuthen: () => dispatch({ type: EXACT_AUTH }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
