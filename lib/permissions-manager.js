const Permissions = require('./permissions');

class PermissionsManager {
    constructor(ownerId) {
        this.ownerId = ownerId;
        this.db = null;
        this.ops = new Map();
    }

    sync(db) {
        this.db = db;

        this.db.getOperators()
        .then((operators) => {
            operators.forEach((operator) => {
                if (!this.ops.has(operator.guild)) {
                    this.ops.set(operator.guild, new Set());
                }
                this.ops.get(operator.guild).add(operator.user);
            });
        });
    }

    getUserPermission(userId, guild) {
        if (userId == this.ownerId) return Permissions.BOT_OWNER;
        
        if (userId == guild.ownerID) return Permissions.GUILD_OWNER;

        if (!this.ops.has(guild.id) || !this.ops.get(guild.id).has(userId)) return Permissions.EVERYONE;

        return Permissions.OPERATOR;
    }

    addOperator(userId, guild) {
        if (!this.ops.has(guild.id)) {
            this.ops.set(guild.id, new Set());
        }
        this.ops.get(guild.id).add(userId);
        return this.db.addOperator(userId, guild.id);
    }

    removeOperator(userId, guild) {
        if (this.ops.has(guild.id)) {
            this.ops.get(guild.id).delete(userId);
            if (this.ops.get(guild.id).size == 0) {
                this.ops.delete(guild.id);
            }
        }
        return this.db.removeOperator(userId, guild.id);
    }
}

module.exports = PermissionsManager;