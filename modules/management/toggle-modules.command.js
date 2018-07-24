const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command('modul', Permissions.OPERATOR, 1, function(yeri, res, req, params, author, channel, guild) {
    let moduleName = params[0].toLowerCase();

    if (!yeri.cmdMgr.modules.has(moduleName)) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Moduł o tej nazwie nie istnieje.');
        res.end();
        return;
    }

    let module = yeri.cmdMgr.modules.get(moduleName);
    
    res.content.setColor(Command.OK)
        .setTitle('Sukces');

    if (module.options.enabled) {
        module.options.enabled = false;
        res.content.setDescription('Moduł został dezaktywowany.');
    }
    else {
        module.options.enabled = true;
        res.content.setDescription('Moduł został aktywowany.');
    }
    res.end();
});