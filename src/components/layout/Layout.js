import React, { Component } from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import Popup from './popup/Popup';
import BottomPhone from './bottom-phone/BottomPhone';
import SideBar from './side-bar/SideBar';

class Layout extends Component {
    render() {
        return (
            <div className='all-content'>
                <Popup />
                <BottomPhone />
                <SideBar />
                <Header />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default Layout;
