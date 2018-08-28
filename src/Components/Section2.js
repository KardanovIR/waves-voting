import React from 'react';
import { Link } from "react-router-dom";
import 'whatwg-fetch'

class Section2 extends React.Component {
    
    getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
    
    
    constructor(props) {
        super();
        // if (Boolean(this.getCookie('verified')) !== true) {
        //     window.location.href = '/';
        // }
    }
    
    componentDidMount() {
        this.props.setActiveStep(2);
    }
    
    
    render() {
        return (
          <div className="sec_2 section">
              <div className="container">
                  <div className="row">
                      <div className="col-xl-12  col-lg-12   col-md-12">
                          <p className="ti"><span className="nss">ERC-20</span> Listing on DEX</p>
                          <ul className="list">
                              <li>You will need WCT (Waves Community Token) to participate in the vote</li>
                              <li>The total amount of WCT you have will affect the impact of your vote</li>
                              <li>The results of the vote will be announced on 29 August at 12 pm (UTC+3)</li>
                              <li>The final impact of your vote will be fixed the moment voting ends</li>
                              <li>You can acquire WCT <a target="_blank"
                                                         href="https://client.wavesplatform.com/dex?assetId2=DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J&assetId1=WAVES">on DEX</a></li>
                              <li><strong>NOTE. We are not taking away your WCT tokens. They will remain in your full
                                  posession.</strong></li>
                          </ul>
                          <div className="in">
                              <img src="/img/wct.png"/>
                              <p>WCT (Waves Community Token) is a special token designed to facilitate
                                  and reward community engagement. <a target="_blank"
                                                                      href="https://client.wavesplatform.com/dex?assetId2=DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J&assetId1=WAVES">WCT
                                      can be bought on DEX</a></p>
                          </div>
                          {/*<Link to="vote" className="btn btn-primary buy load">Vote</Link>*/}
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}

export default Section2;