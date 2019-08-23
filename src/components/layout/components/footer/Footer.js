import React, { Component } from 'react';
import './Footer.scss';
import { Col, Row } from 'antd';
import { Icon } from 'antd'

class Footer extends Component {
  render() {
    return (
      <div className='footer' >
        {/* <div className="content-footer">
          <Row >
            <Col xs={24} sm={24} md={8} lg={8} className='rule hidden-mobile'>
              <ul>
                <li><Icon type="right" /><a href='/'>Giới thiệu</a></li>
                <li><Icon type="right" /><a href='/'>Quy định bảo mật</a></li>
                <li><Icon type="right" /><a href='/'>Điều khoản sử dụng</a></li>
                <li><Icon type="right" /><a href='/'>Cam kết</a></li>
              </ul>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className=" contact hidden-mobile">
              <p>
                <label>
                  Địa chỉ: 144 Xuân Thủy, Cầu Giấy, Hà Nội
                </label>
              </p>
              <p>
                <label>
                  Kết nối với chúng tôi
              </label> <i className="fa fa-facebook-square"></i>
              </p>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} className=' rule app'>
              <div className='market-chlay'>
                <p>Mobile App on Google Play</p>
                <img src={CHPlay} alt='CHPlay' height='50px' width='160px' />
              </div>
            </Col>
          </Row>
        </div> */}
        {/* CopyRight */}
        <div className='copy-right'>
          <label>Copy right @ Work.vn2017</label>
        </div>
      </div >
    );
  }
}

export default Footer;