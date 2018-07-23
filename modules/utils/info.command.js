const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command('info', Permissions.EVERYONE, 0, function(yeri, res, params, sender, msg, channel) {
    res.content.setColor(Command.INFO)
        .setTitle('Informacje o bocie')
        .setThumbnail('https://i.imgur.com/SFm57VI.png')
        .setDescription(
            `Wersja: ${yeri.options.version}\n` +
            `UID: ${yeri.uid}`
        );
    res.end();
});