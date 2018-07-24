import React from 'react';

class Section1 extends React.Component {
    
    componentDidMount() {
        this.props.setActiveStep(1);
    }
    
    render() {
        return (
          <div className="sec_1 section">
              <div className="container">
                  <div className="row">
                      <div className="col-xl-12  col-lg-12   col-md-12">
                          <p className="ti"><span className="nss">ERC 20</span> Listing on DEX</p>
                          <p className="p1">A long-awaited gateway for ERC20 tokens is finally on its way to the Waves
                              Platform.
                              This will enable the community to exchange ERC20 tokens against other assets on one of the
                              most
                              advanced decentralised exchanges (DEX) securely.</p>
                          <p className="p2">We're letting the community decide which ERC20 tokens will be listed first!
                              Just log in to your Waves account using the browser version of the Waves Client. Create a
                              new Waves wallet if you don't have one in order to participate in the vote.</p>
                          <div className="pp">
                              <p>Voting period:</p>
                              <span>July 25 - August 27</span>
                          </div>
                          
                          <p className="bt"><a
                            href={"https://beta.wavesplatform.com#gateway/auth?r=" + window.location.origin + "&n=Waves voting&i=/_theme/favicon.ico&s=/web-auth-results.php&d=IAmVoting&debug=false"}
                            className="btn btn-primary buy load">Log In</a></p>
                          <div className="or"><span>OR</span></div>
                          <p><a href="https://beta.wavesplatform.com" target="_blank" className="hr">Create new
                              wallet</a></p>
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}

export default Section1;