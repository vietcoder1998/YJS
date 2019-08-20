import React, { Component } from 'react';
import Layout from '../layout/Layout';
import { Tooltip, Button, Icon, Input, Checkbox, Row, Col, Modal } from 'antd';
import './Register.scss';
import { connect } from 'react-redux';
import { OPEN_POPUP } from '../../redux/const/popup';
import { _post } from '../../service/base-api';
import { registrasionController } from '../../service/api/private.api';
import { noInfoHeader } from '../../service/auth';
import MapContainer from '../layout/google-maps/MapContainer';

const isNumeric = (value) => {
    return /^-{0,1}\d+$/.test(value);
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email_register_dto: {
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                gender: "MALE",
                phone: "",
                lat: 124,
                lon: 113
            },

            repassword: '',

            marker: {
                lat: 21.0223575259305,
                lng: 105.82227458143632,
                x: 0,
                y: 0,
            },

            checked: true,
            is_exactly_email: false,
            is_exactly_pw: false,
            is_exactly_phone: false,
            is_exactly_firstname: false,
            is_exactly_lastname: false,
            is_exactly_rpw: false,
            is_except_rule: false,
            show_popup: false,

            location: '',
        }
    }

    _handleInput = (event) => {
        let {
            email_register_dto,
            is_exactly_pw,
            is_exactly_firstname,
            is_exactly_lastname,
            is_exactly_email,
            is_exactly_rpw,
            is_exactly_phone,
            repassword
        } = this.state;
        const param = event.target.id;
        let value = event.target.value;
        // Check Value
        switch (param) {
            case 'firstName':
                if (value.length > 0) {
                    is_exactly_firstname = true;
                } else {
                    is_exactly_firstname = false;
                }
                break;
            case 'lastName':
                if (value.length > 0) {
                    is_exactly_lastname = true
                } else {
                    is_exactly_lastname = false
                }
                break;
            case 'phone':
                if (isNumeric(value) === true && (value.length === 10 || value.length === 11)) {
                    is_exactly_phone = true
                } else {
                    is_exactly_phone = false
                }
                break;
            case 'email':
                is_exactly_email = false;
                for (let i = 0; i < value.length; i++) {
                    if (value[i] === '@') {
                        is_exactly_email = true;
                        break;
                    }
                }
                break;

            case 'password':
                if (value.length > 5) {
                    is_exactly_pw = true;
                } else {
                    is_exactly_pw = false;
                }
                break;
            case 'repassword':
                if (value === email_register_dto.password) {
                    is_exactly_rpw = true;
                } else {
                    is_exactly_rpw = false;
                }
                break;
            default:
                break;
        }

        if (param === 'repassword') {
            repassword = value;
        } else {
            email_register_dto[param] = value;
        }

        this.setState({
            email_register_dto,
            is_exactly_firstname,
            is_exactly_lastname,
            is_exactly_email,
            is_exactly_rpw,
            is_exactly_pw,
            is_exactly_phone,
            repassword
        });
    }

    _openMap = () => {
        this.setState({ show_popup: true })
    }

    _setMap = () => {
        let { marker } = this.props;
        console.log(marker)
        let { location, email_register_dto } = this.state;
        email_register_dto.lat = marker.lat;
        email_register_dto.lon = marker.lng;
        let address = localStorage.getItem('location');
        location = address;
        this.setState({ marker, location, show_popup: false, email_register_dto });
    }

    _handleClose = () => {
        let { show_popup } = this.state;
        show_popup = false;
        this.setState({ show_popup });
    }


    _handleCheckbox = (e) => {
        this.setState({ is_except_rule: e.target.checked });
    }

    _handleGender = (e) => {
        let { email_register_dto, checked } = this.state;
        console.log(e.target.value)
        email_register_dto.gender = e.target.value;
        checked = !checked;
        this.setState({ email_register_dto, checked })
    }

    _handleRegister = () => {
        this.requestToServer();
    }

    async requestToServer() {
        let {
            email_register_dto,
            is_exactly_firstname,
            is_exactly_lastname,
            is_exactly_email,
            is_exactly_rpw,
            is_exactly_pw,
            is_exactly_phone,
            is_except_rule,
        } = this.state;

        let msg = 'Đăng kí thất bại';
        if (
            is_exactly_firstname === false || is_exactly_lastname === false
            || is_exactly_lastname === false || is_exactly_email === false
            || is_exactly_rpw === false || is_exactly_pw === false
            || is_exactly_phone === false
        ) {
            msg = 'Thông tin của bạn cung cấp bị lỗi hoặc bị thiếu trường thông tin';
            this.props.openPopup(msg);
        } else if (is_except_rule === false) {
            msg = 'Bạn chưa đồng ý với điều khoản của chúng tôi';
            this.props.openPopup(msg);
        } else try {
            let res = await _post(email_register_dto, registrasionController, null, noInfoHeader);
            console.log(res)
            if (res.code === 200) {
                msg = 'Đăng kí thành công';
                this.props.openPopup(msg);
            } else {

            }
        } catch (err) {
            msg = 'Email hoặc số điện thoại đã tồn tại';
            this.props.openPopup(msg);
        }
    }

    render() {
        let { email, password, firstName, lastName, phone } = this.state.email_register_dto;
        let {
            location,
            repassword,
            checked,
            is_exactly_firstname,
            is_exactly_lastname,
            is_exactly_email,
            is_exactly_phone,
            is_exactly_rpw,
            is_exactly_pw,
            show_popup,
        } = this.state;

        return (
            <Layout>
                <Modal title='Chọn vị trí của bạn' style={{ top: '10vh' }} visible={show_popup} footer={[
                    <Button key="back" onClick={this._handleClose}>
                        Trở lại
                    </Button>,
                    <Button key="submit" type="primary" onClick={this._setMap}>
                        Cập nhật
                    </Button>
                ]} onHide={this._handleClose} onCancel={this._handleClose}>
                    <MapContainer />
                </Modal>
                <div className='content' >
                    {/* Form Register */}
                    <Row>
                        <Col xs={0} sm={0} md={6} xl={8} lg={6} ></Col>
                        <Col xs={24} sm={24} md={12} xl={8} lg={12}>
                            <form className='register'>
                                <div className='title a_c'>ĐĂNG KÍ</div>
                                {/* FirstName And LastName */}
                                <Row>
                                    <Col sm={12} md={12} lg={12} xl={12}>
                                        <div className='normal'>
                                            <Input
                                                id='firstName'
                                                placeholder="Họ (đệm)"
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                suffix={
                                                    <Tooltip title={is_exactly_firstname ? "Họ" : "Điền họ"}>
                                                        <Icon type={is_exactly_firstname ? 'check' : "warning"} style={{ color: is_exactly_firstname ? 'green' : 'red' }} />
                                                    </Tooltip>
                                                }
                                                value={firstName}
                                                onChange={this._handleInput} type='text'
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={12} md={12} xl={12} lg={12} >
                                        <div className='normal'>
                                            <Input
                                                id='lastName'
                                                placeholder="Tên"
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                suffix={
                                                    <Tooltip title={is_exactly_lastname ? "Tên" : "Điền Tên"}>
                                                        <Icon type={is_exactly_lastname ? 'check' : "warning"} style={{ color: is_exactly_lastname ? 'green' : 'red' }} />
                                                    </Tooltip>
                                                }
                                                value={lastName}
                                                onChange={this._handleInput}
                                                type='text'
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                {/* Gender */}
                                <div className='normal'>
                                    <Row>
                                        <Col xs={8}>Giới tính</Col>
                                        <Col xs={8}>
                                            <input name="gender" type="checkbox" checked={checked} value='MALE' onChange={this._handleGender} />
                                            <span>Nam</span>
                                        </Col>
                                        <Col xs={8}>
                                            <input name="gender" type="checkbox" checked={!checked} value='FEMALE' onChange={this._handleGender} />
                                            <span>Nữ</span>
                                        </Col>
                                    </Row>
                                </div>
                                {/* Address */}
                                <div className='normal'>
                                    <Input
                                        placeholder="Địa chỉ"
                                        prefix={<Icon type="area-chart" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        suffix={
                                            <Tooltip title="Your JPS">
                                                <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this._handleClose} />
                                            </Tooltip>
                                        }
                                        onClick={this._openMap}
                                        value={location}
                                        type='text'
                                    />
                                </div>
                                {/* Mail */}
                                <div className='normal'>
                                    <Input
                                        id='email'
                                        placeholder="Email"
                                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        suffix={
                                            <Tooltip title={is_exactly_email ? "Email chính xác" : "Điền Địa chỉ mail"}>
                                                <Icon type={is_exactly_email ? 'check' : "warning"} style={{ color: is_exactly_email ? 'green' : 'red' }} />
                                            </Tooltip>
                                        }
                                        value={email}
                                        onChange={this._handleInput}
                                        type='text'
                                    />
                                </div>
                                {/* Phone */}
                                <div className='normal'>
                                    <Input
                                        id='phone'
                                        placeholder="Số điện thoại"
                                        prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        suffix={
                                            <Tooltip title={is_exactly_phone ? "Số điện thoại chính xác" : "Điền Sô điện thoại"}>
                                                <Icon type={is_exactly_phone ? 'check' : "warning"} style={{ color: is_exactly_phone ? 'green' : 'red' }} />
                                            </Tooltip>
                                        }
                                        value={phone}
                                        onChange={this._handleInput} type='text'
                                    />
                                </div>
                                {/* Password */}
                                <div className='normal'>
                                    <Input
                                        id='password'
                                        placeholder="Mật khẩu"
                                        prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        suffix={
                                            <Tooltip title={is_exactly_pw ? "Mật khẩu hợp lệ" : "Mật khẩu quá ngắn"}>
                                                <Icon type={is_exactly_pw ? 'check' : "warning"} style={{ color: is_exactly_pw ? 'green' : 'red' }} />
                                            </Tooltip>
                                        }
                                        value={password}
                                        onChange={this._handleInput}
                                        type='password'
                                    />
                                </div>
                                {/* RePassword */}
                                <div className='normal'>
                                    <Input
                                        id='repassword'
                                        placeholder="Nhập lại mật khẩu"
                                        prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        suffix={
                                            <Tooltip title={is_exactly_rpw ? "Mật khẩu nhập lại hợp lệ" : "Mật khẩu chính xác"}>
                                                <Icon type={is_exactly_rpw ? 'check' : "warning"} style={{ color: is_exactly_rpw ? 'green' : 'red' }} />
                                            </Tooltip>
                                        }
                                        value={repassword}
                                        onChange={this._handleInput}
                                        type='password'
                                    />
                                </div>
                                {/* Except */}
                                <div className='normal'>
                                    <p className='fogot-password'>
                                        <Checkbox onChange={this._handleCheckbox}>
                                            Đồng ý với <a href='/' target='_blank' style={{ color: "#4a9ae1" }}>điều khoản</a> của Worksvn
                                    </Checkbox>
                                    </p>
                                    <p>
                                        <Button type='primary' onClick={this._handleRegister} block>Hoàn tất</Button>
                                    </p>
                                    <p className='or'>
                                        hoặc
                                    </p>
                                    <p>
                                        <Button type='blue-7' onClick={this.login} block>
                                            <Icon type="facebook" style={{color: 'blue'}} />
                                            Đăng kí với Facebook
                                    </Button>
                                    </p>
                                    <p className='a_c'>
                                        Bạn đã có tài khoản ? <a href='/login' style={{ color: 'red' }}>Đăng nhập</a>
                                    </p>
                                </div>
                            </form>
                        </Col>
                        <Col xs={0} sm={0} md={6} xl={8} lg={6} ></Col>
                    </Row>
                </div>
                {/* Map */}
            </Layout>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openPopup: (data) => dispatch({ type: OPEN_POPUP, data }),
})

const mapStateToProps = state => ({
    marker: state.handleMapState.marker
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);