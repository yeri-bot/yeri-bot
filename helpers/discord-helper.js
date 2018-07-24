class DiscordHelper {
    static getUserIdFromMention(mention) {
        let results = /^<@!?(\d+)>$/.exec(mention);
        if (results != null) {
            return results[1];
        }
        else {
            return null;
        }
    }

    static getUserDisplayNameFromId(guild, userId) {
        if (guild.members.has(userId)) {
            return  guild.members.get(userId).displayName;
        }
        return '(' + userId + ')';
    }
}

module.exports = DiscordHelper;