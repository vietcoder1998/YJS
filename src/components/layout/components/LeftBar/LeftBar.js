import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './LeftBar.scss';
import { Button, Icon } from 'antd';

const propTypes = {

};


export class LeftBar extends Component {
    render() {
        return (
            <div className='left-bar '>
                <ul>
                    <li><Icon type="appstore" /><span>Dashboard</span>  </li>
                    <li><Icon type="user" /><span>User</span> </li>
                    <li><Icon type="bell" /><span>Notification</span></li>
                    <li><Icon type="message" /><span>FeedBack</span> </li>
                </ul>
            </div>
        );
    }
}


LeftBar.propTypes = propTypes;


export default LeftBar;
