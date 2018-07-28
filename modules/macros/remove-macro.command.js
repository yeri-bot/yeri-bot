const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command(/^makro (usun$|usun ).*/, Permissions.EVERYONE, 2, function(yeri, res, req, params, author, channel, guild) {
    let macroName = params[1];

    if (!this.macros.has(guild.id) || !this.macros.get(guild.id).has(macroName)) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription(`Makro o tej nazwie nie istnieje.`);
        res.end();
        return;
    }

    let isOp = (yeri.cmdMgr.permissionsMgr.getUserPermission(author.id, guild) >= Permissions.OPERATOR);

    if (author.id != this.macros.get(guild.id).get(macroName).author && !isOp) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Nie jesteś właścicielem tego makra.');
        res.end();
        return;
    }

    yeri.db.removeMacro(macroName, guild.id)
    .then(() => {
        this.macros.get(guild.id).delete(macroName);

        res.content.setColor(Command.OK)
            .setTitle('Sukces')
            .setDescription(`Pomyślnie usunięto makro.`);
        res.end();
    })
    .catch(() => {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription(`Wystąpił nieoczekiwany błąd podczas usuwania makra.`);
        res.end();
    });
}, true, true);