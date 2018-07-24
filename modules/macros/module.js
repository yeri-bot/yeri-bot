const Module = require('../../lib/module');

class MacrosModule extends Module {
    constructor() {
        super('macros');

        this.macros = new Map();
    }
}

module.exports = new MacrosModule();