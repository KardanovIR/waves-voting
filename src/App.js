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
    
                  <div className="footer">
                      <div className="cn container">
                          <a href="#" data-toggle="modal" data-target="#fModal">FAQ</a> <span>© Copyright 2018 Waves Platform</span>
                      </div>
                  </div>
    
    
                  <div className="modal fade" id="fModal" tabIndex="-1" role="dialog" aria-labelledby="voteModalLabel"
                       aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered fm" role="document">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                  </button>
                              </div>
                              <div className="modal-body">
                                  <div className="col-xl-12  col-lg-12   col-md-12">
                                      <span className="ra">FAQ</span>
                        
                                      <div className="sk">
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <ul>
                                              <li>Go to <a href="#">voting.wavesplatform.com</a></li>
                                              <li>Click Log in - you will be automatically redirected to
                                                  beta.wavesplatform.com
                                              </li>
                                              <li>Login into your Waves account. A window will pop up - click Continue
                                                  in the lower right corner. You will be redirected back to
                                                  voting.wavesplatform.com.
                                              </li>
                                          </ul>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                            
                                          <p className="bl">What is the ERC20 DEX vote all about?</p>
                                          <p>We are currently in the process of introducing the first ever ERC20 gateway
                                              for the Waves Platform! It’s a major milestone for Waves, and since we
                                              respect and value the opinions and expectations of our community, we
                                              wanted to let them decide which ERC20 token will be listed on DEX
                                              first.</p>
                        
                                      </div>
                                  </div>
                
                              </div>
                          </div>
                      </div>
                  </div>

              </div>
          </Router>
        );
    }
}

export default App;
