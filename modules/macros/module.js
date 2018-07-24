const Module = require('../../lib/module');

class MacrosModule extends Module {
    constructor() {
        super('macros');

        this.macros = new Map();
    }

    sync(db) {
        db.getMacros()
        .then((macros) => {
            macros.forEach((macro) => {
                this.macros.set(macro.name, macro);
            });
        })
        .catch((reason) => {
            console.log('[ERROR]', 'Nie można zsynchronizować z bazą danych.');
            console.log(reason);
        });
    }
}

module.exports = new MacrosModule();