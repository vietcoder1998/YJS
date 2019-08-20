import React, { Component } from 'react';
import './Person.scss';
import { timeConverter } from '../../../../assets/js/convertTime';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        personal_info: state.handlePersonalInfo.personal_info,
    }
}

class Person extends Component {
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
                avatarUrl: '',
                coverUrl: '',
                lat: 21.0223575259305,
                lon: 105.82227458143632
            },
        }
    }

    render() {
        let {
            personal_info
        } = this.props;

        return (
            <div className="wrapper">
                <div className='avatar'>
                    <img src={personal_info.avatarUrl} alt='avatar' />
                </div>
                <ul>
                    <li> <i className="fa fa-user "></i> Họ và tên: {personal_info.lastName + ' ' + personal_info.firstName}  </li>
                    <li> <i className="fa fa-briefcase " ></i> Trạng thái: {personal_info.isLookingForJob ===true ? 'Đang tìm việc' : 'Đã có công việc' }</li>
                    <li> <i className="fa fa-calendar "></i> Ngày sinh: {timeConverter(personal_info.birthday)}</li>
                    <li> <i className="fa fa-venus-mars "></i> Giới tính: {personal_info.gender === 'MALE' ? 'Nam' : 'Nữ'} </li>
                    <br></br>
                    <li> <i className="fa fa-home "></i> Địa chỉ: {personal_info.address}</li>
                    <li> <i className="fa fa-envelope "></i> Email: {personal_info.email}</li>
                    <li> <i className="fa fa-phone "></i>Điện thoại liên hệ:{personal_info.phone}</li>
                    <li> <i className="fa fa-address-card "></i> Số CMND:{personal_info.identityCard}</li>
                </ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(Person);