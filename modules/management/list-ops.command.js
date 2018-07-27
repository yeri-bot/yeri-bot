const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const DiscordHelper = require('../../helpers/discord-helper');

module.exports = new Command('operatorzy', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    let ops = yeri.cmdMgr.permissionsMgr.ops;

    if (!ops.has(guild.id)) {
        res.content.setColor(Command.INFO)
            .setTitle('Operatorzy')
            .setDescription('Lista operatorów jest pusta.');
        res.end();
        return;
    }

    let opNames = Array.from(ops.get(guild.id)).map((userId) => {
        return DiscordHelper.getUserDisplayNameFromId(guild, userId);
    });

    res.content.setColor(Command.INFO)
        .setTitle('Operatorzy')
        .setDescription(opNames.join('  '));
    res.end();
});