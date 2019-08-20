import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../layout/Main/Layout';
import LeftBar from '../../layout/components/LeftBar/LeftBar';


const propTypes = {
    
};


export class Admin extends Component {

    constructor(props) {
       super(props);
       this.state = {
    
       };
    }

    _handleChangeComponent (event) {
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
                <LeftBar _handleChangeComponent= {this._handleChangeComponent} />
                <div className='content-admin'>
                    <div></div>
                </div>
            </Layout>
        );
    }
}


Admin.propTypes = propTypes;


export default Admin;
