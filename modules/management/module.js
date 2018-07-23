const Module = require('../../lib/module');

class ManagementModule extends Module {
    constructor() {
        super('management');
    }
}

module.exports = new ManagementModule();