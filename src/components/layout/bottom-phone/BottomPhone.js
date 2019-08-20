import React, { Component } from 'react';
import './BottomPhone.scss';
import { Icon } from 'antd';
import { moveScroll } from '../../../assets/js/moveScroll';
import { OPEN_SIDE_BAR, CLOSE_SIDE_BAR } from '../../../redux/const/sidebar.state';
import {connect} from 'react-redux';
class BottomPhone extends Component {

    _toHead = () => {
        moveScroll(0, 0, true)
    }
    render() {

        let {show_sidebar } = this.props;
        return (
            <div className='bottom_phone show-only-phone'>
                <span className='link-to'>
                    <a href='/profile'>
                        <li><Icon type="user" /></li>
                        <li>Hồ sơ</li>
                    </a>
                </span>
                <span className='link-to'>
                    <a href='/'>
                        <li><Icon type="search" /></li>
                        <li>Tìm việc</li>
                    </a>
                </span>
                <span className='link-to'>
                    <a href='/'>
                        <li><Icon type="phone" /></li>
                        <li>Liên hệ</li>
                    </a>
                </span>
                <span className='link-to' onClick={this._toHead}>
                    <span>
                        <li><Icon type="up" /></li>
                        <li>Đầu trang</li>
                    </span>
                </span>
                <span className='link-to' onClick={() => { !show_sidebar ? this.props.openSideBar() : this.props.closeSideBar()}}>
                    <span>
                        <li><Icon type="menu-unfold" /></li>
                        <li>Menu</li>
                    </span>
                </span>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        show_sidebar: state.handleSideBarState.show_sidebar,
    }
}

const mapDispatchToProps = (dispatch) => {
     return {
        openSideBar: () => dispatch({type: OPEN_SIDE_BAR}),
        closeSideBar: () => dispatch({type: CLOSE_SIDE_BAR})

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomPhone)

