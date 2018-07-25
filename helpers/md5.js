const crypto = require('crypto');

module.exports = function(text) {
    return crypto.createHash('md5').update(text).digest('hex');
};