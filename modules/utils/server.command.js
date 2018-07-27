const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const moment = require('moment-timezone');

module.exports = new Command('serwer', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    res.content.setColor(Command.INFO)
        .setTitle('Informacje o serwerze')
        .setThumbnail(guild.iconURL)
        .setDescription(
            `Nazwa serwera: ${guild.name}\n` +
            `Użytkownicy: ${guild.memberCount}\n` +
            `Data utworzenia: ${moment(guild.createdAt).format('HH:mm:ss DD.MM.YYYY')}\n` +
            `Data dołączenia: ${moment(guild.joinedAt).format('HH:mm:ss DD.MM.YYYY')}`
        );
    res.end();
});