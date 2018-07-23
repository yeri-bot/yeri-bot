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
}

module.exports = DiscordHelper;