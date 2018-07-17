import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './App.css';
import Section1 from "./Components/Section1";
import Section2 from "./Components/Section2";
import Section3 from "./Components/Section3";
import WebAuthResults from "./Components/WebAuthResult";
import 'whatwg-fetch'
import classNames from 'classnames';

class App extends Component {
    
    state = {
        address: '',
        WCTBalance: 0,
        step: 1
    };
    
    constructor() {
        super();
        this.state = {
            address: '',
            WCTBalance: 0,
            step: 1
        }
    }
    
    setActiveStep = (step) => {
        this.setState({ step: step })
    };
    
    getStepClassName(number) {
        if (this.state.step === number) {
            return "step active";
        } else {
            return "step";
        }
    }
    
    getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
    
    canGoFurther() {
        return (Boolean(this.getCookie('verified')) === true);
    }
    
    parseJson = (res) => {
        return res.json();
    }
    
    
    updateCurrentStake = () => {
        const _this = this;
        fetch('/api/v1/users/me', { credentials: "same-origin" })
          .then(this.parseJson)
          .then(function (res) {
              _this.setState({
                  address: res.data.address,
                  WCTBalance: res.data.wct_balance
              });
          })
    };
    
    
    toggleAccountModal = () => {
        this.setState({
            showAccountModal: !this.state.showAccountModal
        })
    };
    
    componentWillMount() {
        this.updateCurrentStake();
    }
    
    render() {
        let ConditionalLink = this.canGoFurther() ? Link : 'span';
        
        let accountModalClasses = classNames({ "ob": true, "active": this.state.showAccountModal });
        
        return (
          <Router>
              <div>
                  <div className="top">
                      <div className="container">
                          <div className="row">
                              <div className="col-xl-3 col-lg-3 col-md-3 bb">
                                  <img src="/img/logo.png"/>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 nv">
                                  <div className="nav">
                                      <Link className="bl_n load" to="/">
                                          <div className={this.getStepClassName(1)}>1</div>
                                          <div className="step_t">Log In</div>
                                      </Link>
                                      <div className="line"></div>
                                      <ConditionalLink className="bl_n load" to="/get-wct">
                                          <div className={this.getStepClassName(2)}>2</div>
                                          <div className="step_t">Get WCT</div>
                                      </ConditionalLink>
                                      <div className="line"></div>
                                      <ConditionalLink className="bl_n load" to="/vote">
                                          <div className={this.getStepClassName(3)}>3</div>
                                          <div className="step_t">Vote</div>
                                      </ConditionalLink>
                                  </div>
                              </div>
                              <div className="col-xl-3 col-lg-3 col-md-3 ac" onClick={this.toggleAccountModal}>
                                  <div className={accountModalClasses}
                                       style={{ 'display': this.state.step > 1 ? 'block' : '' }}>
                                      <div className="vi">
                                          <span className="im_c"></span>
                                          <span className="nu_c">{this.state.address}</span>
                                      </div>
                                      <div className="hc"
                                           style={{ 'display': this.state.step > 1 && this.state.showAccountModal ? 'block' : '' }}>
                                          <div className="wtc">
                                              <div className="t1">Your WCT ballance:</div>
                                              <div className="t2"><span className="total">{this.state.WCTBalance}</span><span
                                                className="current">WCT</span></div>
                                          </div>
                                          <div className="au">
                                              <a href="/logout">Logout</a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <Route exact path='/' render={(props) => (
                    <Section1 setActiveStep={this.setActiveStep}/>
                  )}/>
                  <Route exact path='/get-wct' render={(props) => (
                    <Section2 setActiveStep={this.setActiveStep}/>
                  )}/>
                  <Route exact path='/vote' render={(props) => (
                    <Section3 setActiveStep={this.setActiveStep}/>
                  )}/>
                  <Route exact path='/web-auth-results' render={(props) => (
                    <WebAuthResults {...props}/>
                  )}/>
              </div>
          </Router>
        );
    }
}

export default App;
