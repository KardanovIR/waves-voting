const express = require('express');
const nodeApi = express.Router();

const WavesAPI = require('@waves/waves-api');
const URL = require('url');
const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);

const short = (input) => {
    if (typeof input !== 'number') {
        throw new Error('Numeric input is expected');
    }
    
    const bytes = new Array(1);
    for (let k = 1; k >= 0; k--) {
        bytes[k] = input & (255);
        input = input / 256;
    }
    
    return bytes;
};
const string = (str) => {
    let utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode >> 6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
              | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
              0x80 | ((charcode >> 12) & 0x3f),
              0x80 | ((charcode >> 6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
    
};


const checkValidity = (url) => {
    // get redirect url and parse it
    const parsedUrl = URL.parse(url, true);
    const signedData = parsedUrl.query.d;
    const signature = parsedUrl.query.s;
    const publicKey = parsedUrl.query.p;
    const hostname = parsedUrl.query.r;
    const shouldBeSigned = 'IAmVoting';
    
    if (shouldBeSigned !== signedData) return false;
    
    const permText = 'WavesWalletAuthentication';
    
    const dataByteArray = [].concat(
      short(permText.length),
      string(permText),
      short(hostname.length),
      string(hostname),
      short(shouldBeSigned.length),
      string(shouldBeSigned),
    );
    // console.log(dataByteArray, signature, publicKey);
    return Waves.crypto.isValidTransactionSignature(Uint8Array.from(dataByteArray), signature, publicKey);
    
};

// middleware that is specific to this router
nodeApi.use(function (req, res, next) {
    next();
});

// define the home page route
nodeApi.get('/validate', function (httpReq, httpRes) {
    const parsedUrl = URL.parse(httpReq.url, true);
    const signature = parsedUrl.query.s;
    const signedData = parsedUrl.query.d;
    const publicKey = parsedUrl.query.p;
    const hostname = parsedUrl.query.r;
    
    httpRes.json({
        publicKey: publicKey,
        signature: signature,
        hostname: hostname,
        signedData: signedData,
        address: Waves.tools.getAddressFromPublicKey(publicKey),
        valid: checkValidity(httpReq.url)
    });
});


module.exports = nodeApi;
