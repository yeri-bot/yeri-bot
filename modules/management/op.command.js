const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const DiscordHelper = require('../../helpers/discord-helper');

module.exports = new Command('op', Permissions.OWNER, 1, function(res, params, msg, author, channel, guild) {
    let userId = DiscordHelper.getUserIdFromMention(params[0]);

    if (!userId) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Nieprawidłowa wartość 1. parametru. Parametr powinien wskazywać na użytkownika.');
        res.end();
        return;
    }
    
    let permission = this.cmdMgr.permissionsMgr.getUserPermission(guild.id, userId);
    if (permission == Permissions.EVERYONE) {
        this.cmdMgr.permissionsMgr.setUserPermission(guild.id, userId, Permissions.OPERATOR);
        res.content.setColor(Command.OK)
            .setTitle('Sukces')
            .setDescription('Rola operatora została nadana.');
        res.end();
    }
    else if (permission == Permissions.OPERATOR) {
        this.cmdMgr.permissionsMgr.removeUserPermission(guild.id, userId);
        res.content.setColor(Command.OK)
            .setTitle('Sukces')
            .setDescription('Rola operatora została odebrana.');
        res.end();
    }
    else if (permission == Permissions.OWNER) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Użytkownik o tej nazwie jest właścicielem bota. Nie potrzebuje on roli operatora.');
        res.end();
    }
});