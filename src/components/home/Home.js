import React, { Component } from 'react';
import Layout from '../layout/Layout';
import { connect } from 'react-redux';
import { CALL_DATA } from './../../redux-saga/actionCreator/PersonInfo';
import TabSearch from './tab-search/TabSearch';
import TopJob from './top-job/TopJob';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        localStorage.setItem('paging', JSON.stringify({pageIndex: 0, pageSize: 10}))
    }

    render() {
        return (
            <Layout>
                {/* <CarouselUX /> */}
                <TabSearch />
                <TopJob />
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    isAuthen: state.handleAuthState.isAuthen
})

const mapDispatchToprops = dispatch => ({
    callData: () => dispatch({ type: CALL_DATA })
})



export default connect(mapStateToProps, mapDispatchToprops)(Home);
