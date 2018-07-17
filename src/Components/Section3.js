import React from 'react';


class Token extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = { token: props.token };
    }
    
    vote = () => {
        const _this = this;
        
        const $votedEl = window.jQuery('[data-voted="true"]');
        const votedValue = parseInt($votedEl.find('.votes-count').text());
        $votedEl.attr('data-voted', "false");
        $votedEl.find('.votes-count').text(votedValue - 1);
        $votedEl.find('.btn-primary.buy.load').removeClass('disabled').text('Vote');
        
        
        //
        const $tokenEl = window.jQuery('[data-token-id="' + this.props.token.id + '"]');
        const currentValue = parseInt($tokenEl.find('.votes-count').text());
        $tokenEl.find('.votes-count').text(currentValue + 1);
        $tokenEl.attr('data-voted', "true");
        $tokenEl.find('.btn-primary.buy.load').addClass('disabled').text('Your vote!');
        
        fetch('/api/v1/votes/' + this.state.token.id, {
            method: 'POST',
            credentials: "same-origin"
        })
          .then(this.parseJson)
          .then(() => {
              _this.props.getFullData(_this.props.index);
          });
    };
    
    componentDidUpdate() {
        const token = this.state.token;
        token.voted_for = Boolean(window.jQuery('[data-token-id="' + this.props.token.id + '"]').data('voted'));
        if (this.state.token.voted_for !== token.voted_for) {
            this.setState({
                token: token
            });
        }
    }
    
    updateParentComponent = () => {
        this.props.getFullData(this.props.index);
    };
    
    render() {
        return (
          <div className="item" data-token-id={this.state.token.id}
               data-voted={this.state.token.voted_for}>
              <p className="n_current">{this.state.token.name}</p>
              <p className="s_current">{this.state.token.description}</p>
              <div className="sl">
                  <div className="we text"><span>Current price</span><p
                    style={{ fontSize: '16px' }}>{this.state.token.price}$</p></div>
                  <div className="we img"><img src={this.state.token.icon}/></div>
                  <div className="we text"><span>Votes</span><p
                    className='votes-count'>{this.state.token.votes_count}</p></div>
              </div>
              <div className="hd">
                  <a href="#" data-toggle="modal" onClick={this.vote} data-target="#voteModal"
                     className='btn btn-primary buy load'>Vote</a>
                  <p><a href="#" data-toggle="modal" onClick={this.updateParentComponent} data-target="#exampleModal"
                        className="hr">View
                      full rating</a></p>
              </div>
          </div>
        )
    }
};

class TokenInList extends React.Component {
    
    constructor(props) {
        super(props);
        this.token = this.props.token;
    }
    
    setCurrentToken = () => {
        this.props.setCurrentToken(this.props.index);
    };
    
    render() {
        return (
          (<a className="nav-link token-item" data-item-index={this.props.index} data-toggle="pill"
              href="#v1"
              onClick={this.setCurrentToken}
              role="tab" aria-selected="true"
              data-name={this.props.token.description}>
              <span className="tb_1">{this.props.index + 1}</span>
              <span className="tb_2"
                    id={this.props.token.description}>{this.props.token.name}<span> ({this.props.token.description})</span></span>
              <span className="tb_3">{this.props.token.votes_count}</span>
              <span className="tb_4"><span className="cr">Wtc</span><span
                className="tl">{this.props.token.wct_share}%</span></span>
          </a>)
        )
    }
}


class Section3 extends React.Component {
    
    state = {
        tokens: [],
        votedFor: null
    };
    
    constructor(props) {
        super();
        if (Boolean(this.getCookie('verified')) !== true) {
            window.location.href = '/';
        }
        this.state = {
            tokens: [],
            votedFor: null,
            fullData: [],
            currentTokenVotes: [],
            totalWctBalance: 0,
            currentTokenIndex: 0
            
        };
        this.getFullData();
    }
    
    getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }
    
    getFullData = (index) => {
        const _this = this;
        fetch('/api/v1/votes/tokens?fields=votes')
          .then(this.parseJson)
          .then(res => {
              _this.setState({
                  fullData: res.data,
                  currentTokenVotes: res.data[0].votes
              }, () => {
                  if (index !== undefined) {
                      this.setState({
                          currentTokenIndex: index
                      });
                      window.jQuery('[data-item-index="' + index + '"]').click();
                  }
              });
          });
        
        fetch('/api/v1/votes/balances')
          .then(this.parseJson)
          .then(res => {
              _this.setState({
                  totalWctBalance: res.data.total_wct_balance
              });
          });
    };
    
    parseJson = (res) => {
        return res.json();
    };
    
    updateTokensList() {
        fetch('/api/v1/tokens?fields=voted_for&withVotedFor=true', { credentials: 'same-origin' })
          .then(this.parseJson)
          .then(res => {
              this.setState({
                  tokens: res.data
              }, function () {
                  const $votedEl = window.jQuery('[data-voted="true"]');
                  $votedEl.find('.btn-primary.buy.load').addClass('disabled').text('Your vote!');
                  
                  let jQuery = window.jQuery;
                  
                  jQuery('.ob').off('click').click(function () {
                      
                      if (jQuery('.ob').hasClass('active')) {
                          jQuery(this).removeClass('active');
                          jQuery('.hc').hide();
                      }
                      else {
                          jQuery(this).addClass('active');
                          jQuery('.hc').show();
                      }
                      
                  });
                  
                  jQuery('.nav-link').off('click').click(function () {
                      let bb = jQuery(window).width();
                      if (bb < 768) {
                          jQuery('.tab-content').show();
                          let html = jQuery(this).html();
                          jQuery('.inf').html(html);
                          let hh = jQuery(this).data("name");
                          jQuery('.inf .tb_2 span').html(hh);
                      }
                  });
                  
                  jQuery('.tab-content .close').off('click').click(function () {
                      jQuery('.tab-content').hide();
                      jQuery('.inf').html('');
                  });
                  
                  let bb = jQuery(window).width();
                  if (bb < 768) {
                      jQuery("#carousel").Cloud9Carousel({
                          buttonLeft: jQuery("#buttons > .left"),
                          buttonRight: jQuery("#buttons > .right"),
                          autoPlay: 0,
                          bringToFront: true,
                          frontItemClass: 'd',
                          itemClass: "item",
                          xRadius: 2380,
                          yRadius: 10,
                          yOrigin: 15,
                          xOrigin: 152,
                          speed: 6,
                          fps: 30
                      });
                  }
                  else if (bb < 1060) {
                      jQuery("#carousel").Cloud9Carousel({
                          buttonLeft: jQuery("#buttons > .left"),
                          buttonRight: jQuery("#buttons > .right"),
                          autoPlay: 0,
                          bringToFront: true,
                          frontItemClass: 'd',
                          itemClass: "item",
                          xRadius: 380,
                          yRadius: 80,
                          yOrigin: 15,
                          xOrigin: 350,
                          speed: 6,
                          fps: 300
                      });
                  }
                  else if (bb < 1400) {
                      jQuery("#carousel").Cloud9Carousel({
                          buttonLeft: jQuery("#buttons > .left"),
                          buttonRight: jQuery("#buttons > .right"),
                          autoPlay: 0,
                          bringToFront: true,
                          frontItemClass: 'd',
                          itemClass: "item",
                          xRadius: 500,
                          yRadius: 60,
                          yOrigin: 5,
                          xOrigin: 450,
                          speed: 6,
                          fps: 300
                      });
                  }
                  else {
                      jQuery("#carousel").Cloud9Carousel({
                          buttonLeft: jQuery("#buttons > .left"),
                          buttonRight: jQuery("#buttons > .right"),
                          autoPlay: 0,
                          bringToFront: true,
                          frontItemClass: 'd',
                          itemClass: "item",
                          xRadius: 700,
                          yOrigin: 100,
                          xOrigin: 650,
                          speed: 8,
                          fps: 30
                      });
                  }
              })
          });
    }
    
    setCurrentToken = (currentTokenIndex) => {
        this.setState({
            currentTokenIndex: currentTokenIndex
        });
    };
    
    componentDidMount() {
        this.props.setActiveStep(3);
        this.updateTokensList();
    }
    
    setVotedFor = (token_id) => {
    };
    
    openFacebookLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://www.facebook.com/sharer/sharer.php?u=';
        const pagePart = '/voted?social=fb&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        window.location.href = sharePart + originPart + pagePart;
    };
    openTwitterLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://twitter.com/home?status=';
        const pagePart = '/voted?social=twitter&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        window.location.href = sharePart + originPart + pagePart;
    };
    openVkLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://vk.com/share.php?url=';
        const pagePart = '/voted?social=vk&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        window.location.href = sharePart + originPart + pagePart;
    };
    
    render() {
        return (
          <div className="sec_3 section">
              <div className="container">
                  <div className="row">
                      <div className="col-xl-12  col-lg-12   col-md-12">
                          <h3>Choose the ERC20 token you want to see first on DEX!</h3>
                          <p className="ti"><span className="nss">ERC 20</span> Listing on DEX</p>
                          
                          
                          <div id="carousel" style={{ paddingTop: 6 }}>
                              {
                                  this.state.tokens.map((token, index) => {
                                      return <Token token={token} votedFor={token.id === this.state.votedFor}
                                                    index={index} setVotedFor={this.setVotedFor}
                                                    getFullData={this.getFullData}/>
                                  })
                              }
                          </div>
                          
                          <div id="buttons">
                              <button className="left">
                              </button>
                              <button className="right">
                              </button>
                          </div>
                          
                          <div className="blm modal fade" id="voteModal" tabIndex="-1" role="dialog"
                               aria-labelledby="voteModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-dialog-centered" role="document">
                                  <div className="modal-content">
                                      <div className="modal-header">
                                          <button type="button" className="close" data-dismiss="modal"
                                                  aria-label="Close">
                                          </button>
                                      </div>
                                      <div className="modal-body">
                                          <div className="col-xl-12  col-lg-12   col-md-12">
                                              <span className="ra">You have voted</span>
                                              <p>Great! Share your choice with<br/>
                                                  friends on social media</p>
                                              <div className="soc">
                                                  <a href="#" className="fa" onClick={this.openFacebookLink}/>
                                                  <a href="#" className="tw" onClick={this.openTwitterLink}/>
                                                  <a href="#" className="vk" onClick={this.openVkLink}/>
                                              </div>
                                          </div>
                                      
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          
                          <div className="cont">
                              <div className=" modal fade" id="exampleModal" tabIndex="-1" role="dialog"
                                   aria-labelledby="exampleModalLabel" aria-hidden="true">
                                  <div className="modal-dialog" role="document">
                                      <div className="modal-content">
                                          <div className="modal-header">
                                              <button type="button" className="close" data-dismiss="modal"
                                                      aria-label="Close">
                                              </button>
                                          </div>
                                          <div className="modal-body">
                                              <div className="col-xl-12  col-lg-12   col-md-12">
                                                  <span className="ra">Rating</span>
                                              </div>
                                              
                                              <div className="col-xl-6  col-lg-6   col-md-6">
                                                  <span className="t_a">Total amount of WCT used by all voters:  </span>
                                              </div>
                                              <div className="col-xl-6  col-lg-6  col-md-6">
                                                  <span className="ch_t"><span>{this.state.totalWctBalance}</span> <span
                                                    className="wt">WCT</span></span>
                                              </div>
                                              
                                              
                                              <div className="col-xl-12  col-lg-12   col-md-12 tabl">
                                                  
                                                  <div className="panel_l">
                                                      <span className="tb_1">Place</span>
                                                      <span className="tb_2">Token </span>
                                                      <span className="tb_3">Votes</span>
                                                      <span className="tb_4">WCT (%)</span>
                                                  </div>
                                                  <div className="panel_r">
                                                      <span className="tt_1">#</span>
                                                      <span className="tt_2">Wallet Address</span>
                                                      <span className="tt_3">WCT Balance</span>
                                                  </div>
                                                  <div className="nav flex-column nav-pills" id="v-pills-tab"
                                                       role="tablist" aria-orientation="vertical">
                                                      {
                                                          this.state.fullData.map((token, index) => {
                                                              return <TokenInList token={token} index={index}
                                                                                  setCurrentToken={this.setCurrentToken}/>
                                                          })
                                                      }
                                                  </div>
                                                  <div className="tab-content" id="v-pills-tabContent">
                                                      <span className="sk close none"></span>
                                                      <div className="inf none"></div>
                                                      <div className="tab-pane fade show active" id="v1"
                                                           role="tabpanel">
                                                          {
                                                              this.state.fullData.length > 0 && this.state.fullData[this.state.currentTokenIndex].votes.map((vote, index) => {
                                                                  return (<div className="cv">
                                                                      <span className="tt_1">{index + 1}.</span>
                                                                      <span
                                                                        className="tt_2">{vote.address}</span>
                                                                      <span
                                                                        className="tt_3">{vote.wct_balance} WCT</span>
                                                                  </div>)
                                                              })
                                                          }
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        )
    }
}

export default Section3;