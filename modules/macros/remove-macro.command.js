const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command(/^makro (usun$|usun ).*/, Permissions.EVERYONE, 2, function(yeri, res, req, params, author, channel, guild) {
    let macroName = params[1];

    if (!this.macros.has(macroName)) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription(`Makro o tej nazwie nie istnieje.`);
        res.end();
        return;
    }

    let isOp = (yeri.cmdMgr.permissionsMgr.getUserPermission(guild.id, author.id) >= Permissions.OPERATOR);

    if (author.id != this.macros.get(macroName).author || !isOp) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Nie jesteś właścicielem tego makra.');
        res.end();
        return;
    }

    this.macros.delete(macroName);

    res.content.setColor(Command.OK)
        .setTitle('Sukces')
        .setDescription(`Pomyślnie usunięto makro.`);
    res.end();
}, true, true);