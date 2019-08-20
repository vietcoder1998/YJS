import React, { Component } from 'react';
import Layout from './../../layout/Main/Layout';
import { Row, Col } from 'antd';

class NotFound extends Component {
    render() {
        return (
            <Layout>
                <div className='content'>
                    <Row>
                        <Col xs={0} sm={0} md={2} lg={3} xxl={5}></Col>
                        <Col xs={24} sm={24} md={20} lg={18} xxl={14}>
                            <div style={{ backgroundColor: 'white', height:'45vh', textAlign:'center' }}>
                                <img style={{width: '100%' , maxHeight:'125%'}} src={''} alt='not found'/>
                            </div>
                        </Col>
                        <Col xs={0} sm={0} md={2} lg={3} xxl={5}></Col>
                    </Row>
                </div>
            </Layout>
        );
    }
}

export default NotFound;