const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const DiscordHelper = require('../../helpers/discord-helper');
const numeral = require('../../helpers/numeral');

module.exports = new Command('makra', Permissions.EVERYONE, [0, 1], function(yeri, res, req, params, author, channel, guild) {
    if (this.macros.size == 0) {
        res.content.setColor(Command.INFO)
            .setTitle('Makra')
            .setDescription('Brak dostępnych makr.');
        res.end();

        return;
    }

    res.partial = true;
    let macrosAuthors = new Map();

    this.macros.forEach((macro) => {
        if (!macrosAuthors.has(macro.author)) {
            macrosAuthors.set(macro.author, []);
        }
        macrosAuthors.get(macro.author).push(macro.name);
    });

    macrosAuthors.forEach((macroNames, authorId) => {
        let authorName = DiscordHelper.getUserDisplayNameFromId(guild, authorId);

        let part = res.addPart();
        part.content.setColor(Command.INFO)
            .setTitle(authorName)
            .setDescription(macroNames.join(' '))
            .setFooter(macroNames.length + ' ' + numeral(macroNames.length, 'makro', 'makra', 'makr'));
    });

    res.end();
});