const Module = require('../../lib/module');
const WykopController = require('../../lib/wykop-controller');
const IdHistoryManager = require('../../lib/id-history-manager');

class WykopModule extends Module {
    constructor() {
        super('wykop');
        this.idHistory = new IdHistoryManager();
    }

    sync(db) {
        this.wykop = new WykopController(this.options.appKey, this.options.secretKey);
    }
}

module.exports = new WykopModule();