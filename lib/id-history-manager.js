class IdHistoryManager {
    constructor() {
        this.history = new Map();
        this.timeout = 1000 * 60 * 60;
    }

    addId(id, guildId) {
        if (!this.history.has(guildId)) {
            this.history.set(guildId, new Map());
        }
        if (this.history.get(guildId).has(id)) {
            clearTimeout(this.history.get(guildId).get(id));
        }
        this.history.get(guildId).set(id, setTimeout(() => {
            this.deleteId(id, guildId);
        }, this.timeout));
    }

    hasId(id, guildId) {
        if (!this.history.has(guildId)) {
            return false;
        }
        return this.history.get(guildId).has(id);
    }

    deleteId(id, guildId) {
        if (!this.history.has(guildId)) {
            return;
        }
        if (this.history.get(guildId).has(id)) {
            clearTimeout(this.history.get(guildId).get(id));
            this.history.get(guildId).delete(id);

            if (this.history.get(guildId).size == 0) {
                this.history.delete(guildId);
            }
        }
    }
}

module.exports = IdHistoryManager;