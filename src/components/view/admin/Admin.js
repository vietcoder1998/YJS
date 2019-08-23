import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../layout/Main/Layout';
import LeftBar from '../../layout/components/LeftBar/LeftBar';
import Info from '../../layout/components/info/Info';
import Chart from '../../layout/components/chart/Chart';
import './Admin.scss';
import { Col, Row } from 'antd';
import Block from '../../layout/components/block/Block';
import TestAvatar from '../../../assets/image/test_avatar.jpg';

const propTypes = {

};

const topStreamer = [
    { id: 'a', avatar: TestAvatar, name: 'Andried', viewers: 10000, fans: 15000, token: 15200 },
    { id: 'a', avatar: TestAvatar, name: 'Andried', viewers: 10000, fans: 15000, token: 15200 },
    { id: 'a', avatar: TestAvatar, name: 'Andried', viewers: 10000, fans: 15000, token: 15200 },
    { id: 'a', avatar: TestAvatar, name: 'Andried', viewers: 10000, fans: 15000, token: 15200 },
     { id: 'a', avatar: TestAvatar, name: 'Andried', viewers: 10000, fans: 15000, token: 15200 }
]


export class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    _handleChangeComponent(event) {
        switch (event) {
            case '':
                return '';

            default:
                return '';
        }
    }

    render() {
        return (
            <Layout>
                <LeftBar _handleChangeComponent={this._handleChangeComponent} />
                <div className='content-admin'>
                    {/* Pretation */}
                    <React.Fragment>
                        <Info describe='DashBoard' breakcumb='Home' >
                            <Row>
                                <Col xs={24} sm={24} md={12} xl={12} xxl={6}>
                                    <Block describe='Active Premium Users'>

                                    </Block>
                                </Col>
                                <Col xs={24} sm={24} md={12} xl={12} xxl={6}>
                                    <Block describe='Active Users'>

                                    </Block>
                                </Col>
                                <Col xs={24} sm={24} md={12} xl={12} xxl={6}>
                                    <Block describe='New users'>

                                    </Block>
                                </Col>
                            </Row>
                            {/* Content */}
                            <div className='content-detail-chart' >
                                <Chart />
                            </div>
                        </Info>

                        {/* Top User */}
                        <Info describe='Top Streamers'>
                            {/* Content */}
                            <div className='content-detail-table' >
                                <div>
                                    <table>
                                        <tbody>
                                            <tr className='b_b'>
                                                <th ></th>
                                                <th>Name</th>
                                                <th>Viewers</th>
                                                <th>Fans</th>
                                                <th>Token received</th>
                                            </tr>
                                            {topStreamer && topStreamer.map((item, index) => {
                                                return (<tr key={index} className='b_b'>
                                                    <td><img src={item.avatar} /></td>
                                                    <td >{item.name}</td>
                                                    <td>{item.viewers}</td>
                                                    <td>{item.fans}</td>
                                                    <td>{item.token}</td>
                                                </tr>)
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Info>
                    </React.Fragment>
                </div>
            </Layout>
        );
    }
}


Admin.propTypes = propTypes;


export default Admin;
