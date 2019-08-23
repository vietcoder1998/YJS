import React, { Component } from 'react';
import './components/sass/_common.scss';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from './components/view/not-found/NotFound';
import Login from './components/view/login/Login';
import { connect } from 'react-redux';
import { EXACT_AUTH } from './redux/const/authen';
import ForgotPassword from './components/view/forgot/ForgotPassword';
import Admin from './components/view/admin/Admin';
import { CALL_DATA } from './redux-saga/actionCreator/PersonInfo';
import  loadingLogo from './assets/image/831.gif'
import ChatPage from './components/view/chat/Main/ChatPage';


class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    this._loadLocal();
    let { isAuthen } = this.props;
    if (isAuthen) {
      this.props.callData();
    }
  }

  componentDidMount() {
    this.setState({ loading: false })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthen !== nextProps.isAuthen) {
      try {
        this._loadLocal();
      } catch (err) {
        throw err;
      }
    }
  }

  componentDidCatch() {
    this.setState({ loading: true })
  }

  _loadLocal = () => {
    let token = localStorage.getItem('accessToken');
    if (token !== null) {
      this.props.checkAuthen(token);
    }
  }
  
  

  render() {
    let { loading } = this.state;

    if (loading) {
      return (
        <div className='loading-app'>
          <img src={loadingLogo} alt='logo' />
        </div>
      )
    } else {

      return (
        <Router>
          <Switch>
            <Route exact path="/admin" component={this.props.isAuthen === true ? Admin : Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Login} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/chat" component={ChatPage} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthen: state.handleAuthState.isAuthen
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthen: (token) =>
      dispatch({
        type: EXACT_AUTH,
        accessToken: token
      }),

    callData: () => dispatch({
      type: CALL_DATA
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);