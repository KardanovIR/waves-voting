import React from 'react';

class WebAuthResults extends React.Component {
    render() {
        if (window.opener) {
            window.opener.postMessage({ url: window.location.href, updateResponseUrl: true }, window.location.origin);
        }
        window.close();
        
        return (
          <div className="sec_1 section">
              Loading ...
          </div>
        )
    }
}

export default WebAuthResults;