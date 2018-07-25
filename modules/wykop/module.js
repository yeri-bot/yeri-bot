const Module = require('../../lib/module');
const WykopController = require('../../lib/wykop-controller');

class WykopModule extends Module {
    constructor() {
        super('wykop');
    }

    sync(db) {
        this.wykop = new WykopController(this.options.appKey, this.options.secretKey);
    }
}

module.exports = new WykopModule();