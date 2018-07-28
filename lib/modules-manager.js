class ModulesManager {
    constructor() {
        this.db = null;
        this.offModules = new Map();
    }

    sync(db) {
        this.db = db;

        db.getOffModules()
        .then((modules) => {
            modules.forEach((module) => {
                if (!this.offModules.has(module.guild)) {
                    this.offModules.set(module.guild, new Set())
                }
                this.offModules.get(module.guild).add(module.module);
            });
        });
    }

    getModuleState(moduleName, guildId = 'GLOBAL') {
        if (guildId == 'GLOBAL') {
            return !(this.offModules.has('GLOBAL') && this.offModules.get('GLOBAL').has(moduleName));
        }
        else {
            if (this.offModules.has('GLOBAL') && this.offModules.get('GLOBAL').has(moduleName)) {
                return false;
            }
            if (this.offModules.has(guildId) && this.offModules.get(guildId).has(moduleName)) {
                return false;
            }
            return true;
        }
    }

    offModule(moduleName, guildId = 'GLOBAL') {
        if (!this.offModules.has(guildId)) {
            this.offModules.set(guildId, new Set());
        }
        this.offModules.get(guildId).add(moduleName);
        return this.db.addOffModule(moduleName, guildId);
    }

    onModule(moduleName, guildId = 'GLOBAL') {
        if (this.offModules.has(guildId)) {
            this.offModules.get(guildId).delete(moduleName);
            if (this.offModules.get(guildId).size == 0) {
                this.offModules.delete(guildId);
            }
        }
        return this.db.removeOffModule(moduleName, guildId);
    }
}

module.exports = ModulesManager;