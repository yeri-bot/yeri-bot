const Module = require('../../lib/module');

class UtilsModule extends Module {
    constructor() {
        super('utils');
    }
}

module.exports = new UtilsModule();