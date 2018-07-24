class Module {
    constructor(name) {
        this.name = name.toLowerCase();
        this.options = {};
        this.commands = new Set();
    }

    sync(db) { }
}

module.exports = Module;