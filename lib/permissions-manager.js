const Permissions = require('./permissions');

class PermissionsManager {
    constructor(ownerId) {
        this.guilds = new Map();
        this.ownerId = ownerId;
    }

    setUserPermission(guildId, userId, permission) {
        if (userId == this.ownerId) return;

        if (!this.guilds.has(guildId)) {
            this.guilds.set(guildId, new Map());
        }
        this.guilds.get(guildId).set(userId, permission);
    }

    getUserPermission(guildId, userId) {
        if (userId == this.ownerId) return Permissions.OWNER;

        if (!this.guilds.has(guildId) || !this.guilds.get(guildId).has(userId))
            return Permissions.EVERYONE;
        else
            return this.guilds.get(guildId).get(userId);
    }

    removeUserPermission(guildId, userId) {
        if (!this.guilds.has(guildId)) {
            this.guilds.get(guildId).delete(userId);
        }
    }
}

module.exports = PermissionsManager;