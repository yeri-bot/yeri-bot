const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command(/^makro (zmien$|zmien ).*/, Permissions.EVERYONE, undefined, function(yeri, res, req, params, author, channel, guild) {
    let macroName = params[1];
    params.shift();
    params.shift();
    let macroContent = params.join(' ');

    if (!this.macros.has(guild.id) || !this.macros.get(guild.id).has(macroName)) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription(`Makro o tej nazwie nie istnieje.`);
        res.end();
        return;
    }

    let isOp = (yeri.cmdMgr.permissionsMgr.getUserPermission(guild, author.id) >= Permissions.OPERATOR);

    if (author.id != this.macros.get(guild.id).get(macroName).author && !isOp) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Nie jesteś właścicielem tego makra.');
        res.end();
        return;
    }

    yeri.db.setMacro(macroName, macroContent, guild.id)
    .then(() => {
        this.macros.get(guild.id).get(macroName).content = macroContent;

        res.content.setColor(Command.OK)
            .setTitle('Sukces')
            .setDescription(`Pomyślnie zmieniono zawartość makra.`);
        res.end();
    })
    .catch(() => {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription(`Wystąpił nieoczekiwany błąd podczas edytowania makra.`);
        res.end();
    });
}, true, true);