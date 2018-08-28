import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, } from 'react-router-dom'
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
        return true;
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
        
        // let accountModalClasses = classNames({ "ob": true, "active": this.state.showAccountModal });
        
        return (
          <Router>
              <div id='main-container'>
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
                              <div className="col-xl-3 col-lg-3 col-md-3 ac">
                                  {/*<div className={accountModalClasses}*/}
                                  {/*style={{ 'display': this.state.step > 1 ? 'block' : '' }}>*/}
                                  {/*<div className="vi">*/}
                                  {/*<span className="im_c"></span>*/}
                                  {/*<span className="nu_c">{this.state.address}</span>*/}
                                  {/*</div>*/}
                                  {/*<div className="hc"*/}
                                  {/*style={{ 'display': this.state.step > 1 && this.state.showAccountModal ? 'block' : '' }}>*/}
                                  {/*<div className="wtc">*/}
                                  {/*<div className="t1">Your WCT ballance:</div>*/}
                                  {/*<div className="t2"><span className="total">{this.state.WCTBalance}</span><span*/}
                                  {/*className="current">WCT</span></div>*/}
                                  {/*</div>*/}
                                  {/*<div className="au">*/}
                                  {/*<a href="/logout">Logout</a>*/}
                                  {/*</div>*/}
                                  {/*</div>*/}
                                  {/*</div>*/}
                              </div>
                          </div>
                      </div>
                  </div>
                  <Switch>
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
                      <Route render={(props) => (
                        <Section1 setActiveStep={this.setActiveStep}/>
                      )}/>
                  </Switch>
                  
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
                                          <p>
                                              We are currently in the process of introducing the first ever ERC20
                                              gateway for the Waves Platform! It’s a major milestone for Waves, and
                                              since we respect and value the opinions and expectations of our community,
                                              we wanted to let them decide which ERC20 token will be listed on DEX
                                              first.
                                          </p>
                                          <p className="bl">Is there any possibility of scam or fraud? Can the vote be
                                              undermined?</p>
                                          <p>No, the vote cannot be undermined or sabotaged in any way, since it is
                                              carried out on the blockchain. </p>
                                          
                                          <p className="bl">What was behind the decision of choosing precisely these
                                              ERC20 tokens for the vote?</p>
                                          <p>
                                              These ERC20 tokens represent some of the most popular projects on the
                                              Ethereum platform, so we know there is demand for them in the market. By
                                              adding them to the Waves DEX, we can bring new traders and new liquidity
                                              to our platform, and bring the benefits of fast, decentralised trading to
                                              these established communities. In short, it’s win/win.
                                          </p>
                                          
                                          <p className="bl">What do I need in order to vote?</p>
                                          <p>You must have a Waves account and hold at least 1 WCT.</p>
                                          
                                          <p className="bl">Can I vote multiple times?</p>
                                          <p>The rule is simple: 1 user = 1 vote, but you can change your decision
                                              multiple times before the vote is over. If you have already voted, but
                                              decided to vote for another token, your vote will migrate from your
                                              original choice to the new one.</p>
                                          
                                          <p className="bl">What is WCT?</p>
                                          <p>The Waves Community Token. This is a token that was distributed to WAVES
                                              holders as a series of airdrops over the course of about a year. It was
                                              created as a way to reward long-term WAVES holders and enable them to
                                              engage with the development of the platform, including taking decisions
                                              like this.</p>
                                          
                                          <p className="bl">How do I create a Waves account?</p>
                                          <p>
                                              Go to <a href="http://client.wavesplatform.com"
                                                       target="_blank">http://client.wavesplatform.com</a> and follow
                                              the
                                              steps there.</p>
                                          
                                          <p className="bl">Where can I get WCT?</p>
                                          <p>You can purchase WCT on our decentralised exchange (DEX), which can be
                                              found in the Waves Client after you have registered a Waves account. You
                                              can buy WCT for WAVES, BTC or other popular currencies, using the built-in
                                              gateways to deposit these.</p>
                                          
                                          <p className="bl">What’s the role of WCT tokens in the vote?</p>
                                          <p>Any amount of WCT tokens on your account automatically provides you with
                                              the right and ability to participate in the vote. The more WCT you have,
                                              the more valuable your vote is.</p>
                                          
                                          <p className="bl">How do you assess the value of WCT tokens in the vote?</p>
                                          <p>The more your WCT tokens represent as a proportion of the overall amount
                                              used to vote, the more valuable your vote is. For example, there are a
                                              total of 10 million WCT tokens. Let’s say that 5 million are used in the
                                              course of the vote. You vote using 1,000 tokens. That means your vote
                                              counts as 1,000/5,000,000 = 0.02% of the vote’s overall weight. (Remember,
                                              the total number of WCT used to vote will be spread among many ERC20
                                              tokens.).</p>
                                          
                                          <p className="bl">How many WCT tokens must I possess in order to vote?</p>
                                          <p>You must have at least 1 WCT on your account. The more WCT you have, the
                                              more valuable your vote.</p>
                                          
                                          <p className="bl">Will I lose my WCT tokens? Do you take them away?</p>
                                          <p>No, all of your WCT tokens will remain in your full possession after you
                                              have voted.</p>
                                          
                                          <p className="bl">I have created a Waves account and got some WCT. What am I
                                              supposed to do now?</p>
                                          <p>
                                              <ul>
                                                  <li>Go to <a href="http://voting.wavesplatform.com"
                                                               target="_blank">http://voting.wavesplatform.com.</a></li>
                                                  <li>Click Log in - you will be automatically redirected to <a
                                                    href="http://client.wavesplatform.com"
                                                    target="_blank">http://client.wavesplatform.com.</a></li>
                                                  <li>Login into your Waves account. A window will pop up - click
                                                      Continue in the lower right corner. You will be redirected back
                                                      to <a href="http://voting.wavesplatform.com"
                                                            target="_blank">http://voting.wavesplatform.com</a>.
                                                  </li>
                                                  <li>Click Vote - a carousel with all ERC20 tokens participating in the
                                                      vote will appear on the screen.
                                                  </li>
                                                  <li>Choose your favorite ERC20 token and press Vote button directly
                                                      under its image.
                                                  </li>
                                                  <li>That’s it! You have voted!</li>
                                              </ul>
                                          </p>
                                      
                                      </div>
                                  </div>
                              
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  
                  <div class="modal fade" id="ercModal" tabindex="-1" role="dialog" aria-labelledby="voteModalLabel"
                       aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered em erc" role="document">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                  </button>
                              </div>
                              <div class="modal-body">
                                  <div class="col-xl-12  col-lg-12   col-md-12">
                                      <span class="ra">ERC-20 Listing on DEX</span>
                                      
                                      <div class="sk">
                                          <p>Voting for the first ERC-20 token to hit the exchange has come to a
                                              close.<br/>
                                              Thanks to all community members for making your voices heard! Here are
                                              more details on our winner, the newest addition to DEX!</p>
                                      </div>
                                      
                                      <div class="sl">
                                          <div class="we text">
                                              <span>WCT</span>
                                              <p>364485.95</p>
                                              <span class="pro">28.61%</span>
                                          </div>
                                          <div class="we img"><img src="https://voting.wavesplatform.com/img/BNT.png"/></div>
                                          <div class="we text">
                                              <span>Votes</span>
                                              <p><span className="tb_3">63</span></p>
                                              {/*<span class="pro"></span>*/}
                                          </div>
                                      </div>
                                      
                                      <div class="desc">
                                          <p>Bancor</p>
                                          <span>BNT</span>
                                      </div>
                                  
                                  
                                  </div>
                                  {/*<a class="btn btn-primary buy" href="#" onClick={(e) => {*/}
                                      {/**/}
                                  {/*}}>View full rating</a>*/}
                              
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
