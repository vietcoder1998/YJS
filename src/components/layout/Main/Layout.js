import React, { Component } from 'react';
import Popup from './../components/popup/Popup';
import SideBar from './../components/side-bar/SideBar'
import Header from './../components/header/Header'
import Footer from './../components/footer/Footer'

class Layout extends Component {
    render() {
        return (
            <div className='all-content'>
                <Popup />
                <SideBar />
                <Header />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default Layout;
