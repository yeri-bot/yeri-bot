const http = require('http');
const md5 = require('../helpers/md5');

class WykopController {
    constructor(appKey, secretKey) {
        this.appKey = appKey;
        this.secretKey = secretKey;
    }

    _sendRequest(path) {
        return new Promise((resolve, reject) => {
            let chunks = [];

            http.request({
                host: 'a.wykop.pl',
                path,
                headers: { 'apisign': md5(this.secretKey + 'http://a.wykop.pl' + path) }
            }, (response) => {
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => {
                    let response = JSON.parse(Buffer.concat(chunks));
                    if (response.error == undefined) resolve(response);
                    else reject(response.error);
                });
            })
            .on('error', (err) => reject(err))
            .end();
        });
    }

    getTagEntries(tagName, page = 1) {
        return this._sendRequest(`/tag/entries/${tagName}/appkey,${this.appKey},page,${page}`);
    }
}

module.exports = WykopController;