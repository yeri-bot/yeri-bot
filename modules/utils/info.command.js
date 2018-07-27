const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command('info', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    res.content.setColor(Command.INFO)
        .setTitle('Informacje o bocie')
        .setThumbnail('https://i.imgur.com/SFm57VI.png')
        .setDescription(
            `Wersja: ${yeri.options.version}\n` +
            `UID: ${yeri.uid}\n` +
            `Data uruchomienia: ${yeri.startTime.tz('Europe/Warsaw').format('HH:mm:ss DD.MM.YYYY')}\n` +
            `Czas pracy: ${yeri.startTime.locale('pl').fromNow(true)}`
        );
    res.end();
});