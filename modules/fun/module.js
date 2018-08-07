const Module = require('../../lib/module');

class FunModule extends Module {
    constructor() {
        super('fun');
    }
}

module.exports = new FunModule();