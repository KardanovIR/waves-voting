import React from 'react';


class Token extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            voteButtonText: 'Vote',
            voteButtonClasses: 'btn btn-primary buy load'
        };
    }
    
    vote = () => {
        const _this = this;
        this.setState({
            voteButtonText: 'Loading ...',
            voteButtonClasses: 'btn btn-primary buy load disabled'
        });
        
        fetch('/api/v1/votes/' + this.state.token.id, {
            method: 'POST',
            credentials: "same-origin"
        })
          .then(res => res.json())
          .then((result) => {
              this.setState({
                  voteButtonText: 'Your vote!',
                  voteButtonClasses: 'btn btn-primary buy load disabled'
              });
              
              result.data.balance = result.data.wct_balance / 100;
              
              const $votedEl = window.jQuery('[data-voted="true"]');
              const votedValue = parseInt($votedEl.find('.votes-count').text());
              const votedWCTValue = parseFloat($votedEl.find('.wct-amount').text());
              $votedEl.attr('data-voted', "false");
              $votedEl.find('.votes-count').text(votedValue - 1);
              $votedEl.find('.wct-amount').text((votedWCTValue - result.data.balance).toFixed(2));
              $votedEl.find('.btn-primary.buy.load').removeClass('disabled').text('Vote');
              
              
              //
              const $tokenEl = window.jQuery('[data-token-id="' + this.props.token.id + '"]');
              const currentValue = parseInt($tokenEl.find('.votes-count').text());
              const currentWCTValue = parseFloat($tokenEl.find('.wct-amount').text());
              $tokenEl.find('.votes-count').text(currentValue + 1);
              $tokenEl.find('.wct-amount').text((currentWCTValue + result.data.balance).toFixed(2));
              $tokenEl.attr('data-voted', "true");
              $tokenEl.find('.btn-primary.buy.load').addClass('disabled').text('Your vote!');
              
              
              _this.props.setVotedFor(_this.props.index, result.data.zero_balance);
              
              _this.props.getFullData(_this.props.index, false);
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
        this.props.getFullData(this.props.index, false);
    };
    
    render() {
        const _this = this;
        return (
          <div className="item" data-token-id={this.state.token.id}
               data-voted={this.state.token.voted_for}>
              <p className="n_current"><a href={this.state.token.link}
                                          target="_blank">{this.state.token.name}</a></p>
              <p className="s_current"><a href={this.state.token.link}
                                          target="_blank">{this.state.token.description}</a></p>
              <div className="sl">
                  <div className="we text"><span>WCT</span><p
                    style={{ fontSize: '16px' }}><span className="wct-amount">{this.state.token.wct_amount}</span></p>
                  </div>
                  <div className="we img"><img src={this.state.token.icon}/></div>
                  <div className="we text"><span>Votes</span><p
                    className='votes-count'>{this.state.token.votes_count}</p></div>
              </div>
              <div className="hd">
                  <a href="#" data-toggle="modal" data-target="#exampleModal"
                     className={this.state.voteButtonClasses}>View
                      full rating</a>
              </div>
          </div>
        )
    }
}

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
              <span className="tb_4"><span className="cr">WCT</span><span
                className="tl">{this.props.token.wct_share}%</span></span>
          </a>)
        )
    }
}


class Section3 extends React.Component {
    
    state = {
        tokens: [],
        votedFor: null,
        facebookLink: '#',
        twitterLink: '#',
        vkLink: '#',
        redditLink: '#',
        telegramLink: '#'
    };
    
    constructor(props) {
        super();
        // if (Boolean(this.getCookie('verified')) !== true) {
        //     window.location.href = '/';
        // }
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
    
    getFullData = (index, showModal) => {
        const _this = this;
        fetch('/api/v1/votes/tokens?fields=votes{order_by:"-wct_balance"}')
          .then(this.parseJson)
          .then(res => {
              _this.setState({
                  fullData: res.data,
                  currentTokenVotes: res.data[0].votes
              }, () => {
                  if (index !== undefined) {
                      this.setState({
                          currentTokenIndex: index
                      }, () => {
                          this.updateLinks(function () {
                              if (showModal !== false) {
                                  window.jQuery('#voteModal').modal('show');
                              }
                          });
                      });
                      window.jQuery('[data-item-index="' + index + '"]').click();
                  }
                  
                  
                  window.jQuery('.nav-link').off('click').on('click', function () {
                      var bb = window.jQuery(window).width();
                      if (bb < 768) {
                          window.jQuery('.tab-content').show();
                          var html = window.jQuery(this).html();
                          window.jQuery('.inf').html(html);
                          var hh = window.jQuery(this).data("name");
                          window.jQuery('.inf .tb_2 span').html(hh);
                      }
                  });
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
    
    adjustCarousel = () => {
        let jQuery = window.jQuery;
        
        if (jQuery("#carousel").data("carousel")) {
            jQuery("#carousel").data("carousel").deactivate();
        }
        
        var bb = jQuery(window).width();
        var hh = jQuery(window).height();
        
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
                yRadius: 60,
                yOrigin: 15,
                xOrigin: 350,
                speed: 6,
                fps: 300
            });
        }
        else if (bb < 1400 || hh < 1080) {
            jQuery("#carousel").Cloud9Carousel({
                buttonLeft: jQuery("#buttons > .left"),
                buttonRight: jQuery("#buttons > .right"),
                autoPlay: 0,
                bringToFront: true,
                frontItemClass: 'd',
                itemClass: "item",
                xRadius: 500,
                yRadius: 50,
                yOrigin: 15,
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
    };
    
    updateTokensList() {
        fetch('/api/v1/tokens?fields=voted_for&withVotedFor=true', { credentials: 'same-origin' })
          .then(this.parseJson)
          .then(res => {
              this.setState({
                  tokens: res.data
              }, () => {
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
                  
                  this.adjustCarousel();
                  
                  jQuery(window).off('resize').on('resize', () => {
                      this.adjustCarousel();
                      jQuery("#carousel").swipe({
                          swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                              console.log(event);
                              if (direction == 'left') {
                                  jQuery("button.right").click();
                              }
                              if (direction == 'right') {
                                  jQuery("button.left").click();
                              }
                              else {
                                  return true;
                              }
                          },
                          threshold: 30
                      });
                  });
                  
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
    
    setVotedFor = (index, zero_balance) => {
        this.updateLinks(function () {
            if (zero_balance === true) {
                window.jQuery("#emModal").modal('show');
            } else {
                window.jQuery("#voteModal").modal('show');
            }
        });
    };
    
    updateLinks = (callback) => {
        this.setState({
            facebookLink: this.getFacebookLink(),
            twitterLink: this.getTwitterLink(),
            vkLink: this.getVkLink(),
            redditLink: this.getRedditLink(),
            telegramLink: this.getTelegramLink()
        }, callback);
    };
    
    saveGAEvent = (socialNetwork) => {
        console.log('send', 'event', this.state.tokens[this.state.currentTokenIndex].description, 'Share', socialNetwork);
        window.ga('send', 'event', this.state.tokens[this.state.currentTokenIndex].description, 'Share', socialNetwork);
    };
    
    getFacebookLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://www.facebook.com/sharer/sharer.php?u=';
        const pagePart = '/voted?social=fb&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        return sharePart + originPart + encodeURIComponent(pagePart);
    };
    getTwitterLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://twitter.com/home?status=';
        const pagePart = '/voted?social=twitter&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        return sharePart + encodeURIComponent('I voted for my favorite #ERC20 token to be listed first on DEX. You can support your favorite token too! Just go here - ') + originPart + encodeURIComponent(pagePart) + encodeURIComponent(' #WavesERC20');
    };
    getVkLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://vk.com/share.php?url=';
        const pagePart = '/voted?social=vk&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        return sharePart + originPart + encodeURIComponent(pagePart);
    };
    getRedditLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'http://www.reddit.com/submit?title=' + encodeURIComponent('Waves ERC20 DEX Vote') + '&url=';
        const pagePart = '/voted?social=reddit&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        return sharePart + originPart + encodeURIComponent(pagePart);
    };
    getTelegramLink = () => {
        const originPart = window.location.origin;
        const sharePart = 'https://t.me/share/url?url=';
        const pagePart = '/voted?social=telegram&token=' + this.state.tokens[this.state.currentTokenIndex].description;
        return sharePart + originPart + encodeURIComponent(pagePart);
    };
    
    render() {
        return (
          <div className="sec_3 section">
              <div className="container">
                  <div className="row">
                      <div className="col-xl-12  col-lg-12   col-md-12">
                          <h3>Choose the ERC-20 token you want to see first on DEX!</h3>
                          <p className="ti"><span className="nss">ERC-20</span> Listing on DEX</p>
                          
                          
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
                          
                          <div className="modal fade" id="emModal" tabIndex="-1" role="dialog"
                               aria-labelledby="voteModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-dialog-centered em" role="document">
                                  <div className="modal-content">
                                      <div className="modal-header">
                                          <button type="button" className="close" data-dismiss="modal"
                                                  aria-label="Close">
                                          </button>
                                      </div>
                                      <div className="modal-body">
                                          <div className="col-xl-12  col-lg-12   col-md-12">
                                              <span className="ra">You have <span
                                                className="b_e">0 <span>WCT</span></span> on your account</span>
                                              
                                              <div className="sk">
                                                  <p>Please purchase at least 1 WCT on DEX <br/>
                                                      in order to participate in the vote</p>
                                                  <a target="_blank"
                                                     href="https://client.wavesplatform.com/dex?assetId2=DHgwrRvVyqJsepd32YbBqUeDH4GJ1N984X8QoekjgH8J&assetId1=WAVES"
                                                     className="btn btn-primary buy">Go to DEX</a>
                                              </div>
                                          </div>
                                      
                                      </div>
                                  </div>
                              </div>
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
                                              <p>Share your choice on social media,
                                                  so your favorite ERC20 token will
                                                  get more votes!</p>
                                              <div className="soc">
                                                  <a target="_blank" href={this.state.facebookLink} onClick={() => {
                                                      this.saveGAEvent('facebook')
                                                  }} className="fa"/>
                                                  <a target="_blank" href={this.state.twitterLink} onClick={() => {
                                                      this.saveGAEvent('twitter')
                                                  }} className="tw"/>
                                                  <a target="_blank" href={this.state.vkLink} onClick={() => {
                                                      this.saveGAEvent('vk')
                                                  }} className="vk"/>
                                                  <a target="_blank" href={this.state.redditLink} onClick={() => {
                                                      this.saveGAEvent('reddit')
                                                  }} className="ga"/>
                                                  <a target="_blank" href={this.state.telegramLink} onClick={() => {
                                                      this.saveGAEvent('telegram')
                                                  }} className="te"/>
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
                                              
                                              <div className="col-xl-12  col-lg-12   col-md-12">
                                                  <span className="t_a">Total amount of WCT used by all voters:  </span>
                                              </div>
                                              <div className="col-xl-6  col-lg-6  col-md-6">
                                                  <span
                                                    className="ch_t wt"><span>{this.state.totalWctBalance}</span> <span
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