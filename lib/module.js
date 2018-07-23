class Module {
    constructor(name) {
        this.name = name.toLowerCase();
        this.options = {};
        this.commands = new Set();
    }
}

module.exports = Module;