import React, { Component } from 'react';
// import DatePicker from "react-datepicker";
import './FixPerson.scss';
import { _put } from '../../../../service/base-api';
import { personalInfo, updateAvatar } from '../../../../service/api/private.api';
import { connect } from 'react-redux';
import moment from 'moment';
import { allMsg } from '../../../../const/msg';
import { OPEN_POPUP } from './../../../../redux/const/popup';
import { CALL_DATA } from './../../../../redux-saga/actionCreator/PersonInfo';
import ButtonToggle from './../../../helper/toggle-button/ToggleButton';
import { sendFileHeader } from './../../../../service/auth';
import { Icon, Row, Col, Modal, Input, Button, DatePicker } from 'antd';
import MapContainer from './../../../layout/google-maps/MapContainer';
import { timeConverter } from '../../../../assets/js/convertTime';

class FixPerson extends Component {

    constructor(props) {
        super(props);
        this.state = {
            personal_info: {
                firstName: '',
                lastName: '',
                birthday: '',
                gender: '',
                address: '',
                phone: '',
                identityCard: '',
                lat: 21.0223575259305,
                lon: 105.82227458143632,
            },

            show_popup: false,

            marker: {
                lat: 21.0223575259305,
                lng: 105.82227458143632,
            },

            location: '',
            address: '',
            avatarUrl: '',
            avatar: '',
            isLookingForJobs: true,
        }
    }

    componentWillMount() {
        let { personal_info, address, location } = this.props;
        address = personal_info.address;
        location = address;
        let isLookingForJobs = personal_info.isLookingForJobs;
        let { avatarUrl } = this.state;
        avatarUrl = personal_info.avatarUrl;
        this.setState({ personal_info, location, address, avatarUrl, isLookingForJobs });
    }

    _handleData = (event) => {
        let type = event.target.id;
        let { personal_info } = this.state;
        personal_info[type] = event.target.value;
        this.setState({ personal_info })
    }

    _handleTime = (value) => {
        let { personal_info } = this.state;
        let time = 1000 * moment(value, 'YYYY/MM/DD').unix();
        personal_info.birthday = time
        this.setState({ personal_info })
    }

    _handleGender = (event) => {
        let { personal_info } = this.state;
        let value = event.target.value;
        personal_info.gender = value
        this.setState({ personal_info })
    }

    _handleClose = () => {
        let { show_popup } = this.state;
        show_popup = !show_popup;
        this.setState({ show_popup });
    }

    _closeModal = () => {
        this.setState({ show_popup: false })
    }

    _setMap = () => {
        let { personal_info, address } = this.state;
        let { marker } = this.props;
        personal_info.lat = marker.lat;
        personal_info.lon = marker.lng;
        address = localStorage.getItem('location')
        this.setState({ personal_info, address })
        this._handleClose()
    }


    _upLoadFile(event) {
        let { avatar } = this.state;
        let files = event.target.files;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
            this.setState({ avatarUrl: e.target.result })
        }
        avatar = files[0];
        this.setState({ avatar });
    }

    _createRequest = () => {
        this._requestServer();
    }

    _openLocation = () => {
        this.setState({ show_popup: true })
    }

    async  _requestServer() {
        let { personal_info, avatar } = this.state;
        let res_avatar;
        let res_profile;

        try {
            res_profile = await _put(personal_info, personalInfo, null, null);
        } catch (err) {
            this.props.openPopup({ msg: "Lỗi trường thông tin", type: "unSuccess" });
        };


        if (avatar !== '') {
            let form = new FormData();
            form.append('avatar', avatar);

            try {
                res_avatar = await _put(form, updateAvatar + '?avatarContentType=image%2Fpng', null, sendFileHeader);
            } catch (err) {
                this.props.openPopup({ msg: "Ảnh quá dung lượng", type: 'unSuccess' })
            }
        }

        if (res_avatar && res_profile && res_profile.code === 200 && res_avatar.code === 200) {
            this.props.openPopup({ msg: allMsg.successUpdate, type: "unSuccess" });
        }
        
        setTimeout(() => {
            this.props._fixData('person')
        }, 1500);

    }

    render() {
        let { personal_info, show_popup, address, avatarUrl, marker } = this.state;
        console.log(personal_info)
        let birth_day = timeConverter(personal_info.birthday);
        return (
            <div className='wrapper'>
                {/* Center */}
                <Modal
                    visible={show_popup}
                    onCancel={this._handleClose}
                    onOk={this._setMap}
                    title='Định vị trên bản đồ'
                    style={{ top: '10vh' }}
                    footer={[
                        <Button key="back" onClick={this._handleClose}>
                            Trở lại
                        </Button>,
                        <Button key="submit" type="primary" onClick={this._setMap}>
                            Cập nhật
                    </Button>
                    ]} >
                    <div >
                        <MapContainer initialCenter={marker} onHandle={this._handleTest} />
                    </div>
                </Modal>

                {/* Fix Infomation */}
                <Row className='person-info'>
                    {/* left div */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <div className='person-avatar'>
                            <h5>Cập nhật ảnh đại diện</h5>
                            <img className='avatar' src={avatarUrl} alt='avatar' />
                            <form>
                                <label htmlFor='avatar' style={{ fontSize: 15 }}>
                                    <Icon type="upload" />
                                    Upload ảnh avatar
                                </label>
                            </form>
                            <Input id='avatar' type='file' name='file' alt='for avatar' style={{ display: 'none' }} onChange={(e) => { this._upLoadFile(e) }} />
                        </div>
                        <div className='person-content'>
                            <p>Email</p>
                            <Input id='email' type='text' className='input_outside' placeholder='Your Email' value={personal_info.email} onChange={this._handleData} />
                        </div>
                        <div className='person-content'>
                            <p>Điện thoại</p>
                            <Input id='phone' type='text' className='input_outside' placeholder='Phone' value={personal_info.phone} onChange={this._handleData} />
                        </div>
                        <div className='person-content'>
                            <p>Ngày sinh</p>
                            <DatePicker
                                defaultValue={moment(birth_day, 'DD/MM/YY') ? moment(birth_day, 'DD/MM/YY') : null}
                                onChange={this._handleTime}
                                placeholder='Birth day'
                            />
                        </div>
                    </Col>
                    {/* right div */}
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <div className='person-content'>
                            <p>Họ</p>
                            <Input id='lastName' type='text' className='input_outside' placeholder='LastName' value={personal_info.lastName} onChange={this._handleData} />
                        </div>
                        <div className='person-content'>
                            <p>Tên</p>
                            <Input id='firstName' type='text' className='input_outside' placeholder='FirstName' value={personal_info.firstName} onChange={this._handleData} />
                        </div>
                        <div className='person-content'>
                            <ButtonToggle />
                        </div>
                        <div className='person-content'>
                            <p>Giới tính</p>
                            <Icon type="man" />
                            <label>
                                <input type="radio" name="gender" value="MALE" onClick={this._handleGender} defaultChecked={personal_info.gender === 'MALE' ? true : false} />Nam
                            </label>
                            <Icon type="woman" />
                            <label>
                                <input type="radio" name="gender" value="FEMALE" onClick={this._handleGender} defaultChecked={personal_info.gender === 'MALE' ? false : true} /> Nữ
                            </label>
                        </div>
                        <div className='person-content'>
                            <p>Địa chỉ</p>
                            <Input id='address' type='text' className='input_outside' placeholder='Address' value={address} onClick={this._openLocation} />
                        </div>
                        <div className='person-content'>
                            <p>Số CMND</p>
                            <Input id='identityCard' type='text' className='input_outside' placeholder='CMND' value={personal_info.identityCard} onChange={this._handleData} />
                        </div>
                    </Col>
                </Row>

                {/* submit button */}
                <Row className="holder-button" >
                    <Col xs={12}>
                        <button className='button-request' onClick={() => { this.props._fixData('person') }}> Hủy</button>
                    </Col>
                    <Col xs={12}>
                        <button className='button-request' onClick={this._createRequest}> Lưu</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        personal_info: state.handlePersonalInfo.personal_info,
        marker: state.handleMapState.marker,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openPopup: (data) => dispatch({ type: OPEN_POPUP, data }),
        callData: () => dispatch({ type: CALL_DATA }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FixPerson);