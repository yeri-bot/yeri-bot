const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command(/^makro (?!zmien$|zmien |usun$|usun ).*/, Permissions.EVERYONE, undefined, function(yeri, res, req, params, author, channel, guild) {
    let macroName = params[0];
    params.shift();
    let macroContent = params.join(' ');

    if (this.macros.has(macroName)) {
        if (author.id == this.macros.get(macroName).author) {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription(`Makro o tej nazwie już istnieje.\n` +
                    `Aby zmienić zawartość użyj komendy **${yeri.cmdMgr.prefixes[0]}makro zmien**`);
        }
        else {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription(`Makro o tej nazwie już istnieje.`);
        }
        res.end();
        return;
    }

    yeri.db.addMacro(macroName, macroContent, author.id)
    .then(() => {
        this.macros.set(macroName, {
            name: macroName,
            content: macroContent,
            author: author.id
        });
        
        res.content.setColor(Command.OK)
            .setTitle('Sukces')
            .setDescription(`Pomyślnie dodano makro o nazwie **${macroName}**.`);
        res.end();
    })
    .catch(() => {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription(`Wystąpił nieoczekiwany błąd podczas dodawania makra.`);
        res.end();
    });
}, true, true);