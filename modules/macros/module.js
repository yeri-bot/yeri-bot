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
                if (!this.macros.has(macro.guild)) this.macros.set(macro.guild, new Map());
                this.macros.get(macro.guild).set(macro.name, macro);
            });
        })
        .catch((reason) => {
            console.log('[ERROR]', 'Podczas synchronizacji z bazą danych wystąpił błąd.');
            console.log(reason);
        });
    }
}

module.exports = new MacrosModule();