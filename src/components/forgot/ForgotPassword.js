import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Tooltip, Icon, Button, Col, Row } from 'antd';
import './ForgotPassword.scss';
import Layout from './../layout/Layout';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    _handleInput = (e) => {
        this.setState({ email: e.target.value })
    }

    render() {
        let { email } = this.state;
        return (
            <Layout>
                {/* <form> */}
                <Row>
                    <Col xs={4} sm={0} md={6} xl={8} lg={7} ></Col>
                    <Col xs={16} sm={24} md={12} xl={8} lg={10} >
                        <div className="forgot-content">
                            <p className='title a_c'>Quên mật khẩu</p>
                            <p className='normal a_c'>
                                Xác nhận mật khẩu qua email
                            </p>
                            <p className='normal'>
                                <Input
                                    placeholder="Email"
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    suffix={
                                        <Tooltip title="Email của bạn">
                                            <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                    value={email}
                                    onChange={this.handleUsername} type='text'
                                />
                            </p>
                            <p>
                                <Button type='primary' onClick={this.login} block>Gửi</Button>
                            </p>
                            <p className='a_c'>
                                Quay trở lại? <a href='/register' style={{ color: 'red' }}>Đăng kí</a>
                            </p>
                            <p className='a_c'>
                                <a href='/'>Trợ giúp</a>
                            </p>
                        </div>
                    </Col>
                    <Col xs={4} sm={0} md={6} xl={8} lg={7}></Col>
                </Row>
                {/* </form> */}
            </Layout>
        );
    }
}

export default connect(null, null)(ForgotPassword);
