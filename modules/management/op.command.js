const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const DiscordHelper = require('../../helpers/discord-helper');

module.exports = new Command('op', Permissions.GUILD_OWNER, 1, function(yeri, res, req, params, author, channel, guild) {
    let userId = DiscordHelper.getUserIdFromMention(params[0]);

    if (!userId) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Nieprawidłowa wartość 1. parametru. Parametr powinien wskazywać na użytkownika.');
        res.end();
        return;
    }
    
    let permission = yeri.cmdMgr.permissionsMgr.getUserPermission(userId, guild);
    
    if (permission == Permissions.BOT_OWNER) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Użytkownik o tej nazwie jest właścicielem bota. Nie potrzebuje on roli operatora.');
        res.end();
    }
    else if (permission == Permissions.GUILD_OWNER) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Użytkownik o tej nazwie jest właścicielem serwera. Nie potrzebuje on roli operatora.');
        res.end();
    }
    else if (permission == Permissions.OPERATOR) {
        yeri.cmdMgr.permissionsMgr.removeOperator(userId, guild)
        .then(() => {
            res.content.setColor(Command.OK)
                .setTitle('Sukces')
                .setDescription('Rola operatora została odebrana.');
            res.end();
        })
        .catch((reason) => {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription('Wystąpił błąd podczas odbierana roli operatora.');
            res.end();
        });
    }
    else {
        yeri.cmdMgr.permissionsMgr.addOperator(userId, guild)
        .then(() => {
            res.content.setColor(Command.OK)
                .setTitle('Sukces')
                .setDescription('Rola operatora została przyznana.');
            res.end();
        })
        .catch((reason) => {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription('Wystąpił błąd podczas przyznawania roli operatora.');
            res.end();
        });
    }
});