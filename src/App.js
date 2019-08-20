import React, { Component } from 'react';
import './components/sass/_common.scss';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Login from './components/login/Login';
import Register from './components/register/Register';
import { connect } from 'react-redux';
import { EXACT_AUTH } from './redux/const/authen';
import ForgotPassword from './components/forgot/ForgotPassword';
import Result from './components/result/Result';
import JobDetail from './components/job-detail/JobDetail';
import SaveJob from './components/save-job/SaveJob';
import AllNoti from './components/all-noti/AllNoti';
import { CALL_DATA } from './redux-saga/actionCreator/PersonInfo';
import  loadingLogo from './assets/image/831.gif'
import ChatPage from './components/chat/ChatPage';


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
            <Route exact path="/" component={Home} />
            <Route exact path="/profile" component={this.props.isAuthen === true ? Profile : Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/result" component={Result} />
            <Route exact path="/save-job" component={SaveJob} />
            <Route exact path="/job-detail/:id" component={JobDetail} />
            <Route exact path="/notifications" component={AllNoti} />
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