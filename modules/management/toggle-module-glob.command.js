const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command(/^modul .+ glob(al)?$/i, Permissions.BOT_OWNER, 2, function(yeri, res, req, params, author, channel, guild) {
    let moduleName = params[0].toLowerCase();

    if (!yeri.cmdMgr.modules.has(moduleName)) {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Moduł o tej nazwie nie istnieje.');
        res.end();
        return;
    }

    let module = yeri.cmdMgr.modules.get(moduleName);

    if (yeri.cmdMgr.modulesMgr.getModuleState(moduleName)) {
        yeri.cmdMgr.modulesMgr.offModule(moduleName)
        .then(() => {
            res.content.setColor(Command.OK)
                .setTitle('Sukces')
                .setDescription('Moduł został dezaktywowany.');
            res.end();
        })
        .catch(() => {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription('Wystąpił błąd podczas dezaktywowania modułu.');
            res.end();
        });
    }
    else {
        yeri.cmdMgr.modulesMgr.onModule(moduleName)
        .then(() => {
            res.content.setColor(Command.OK)
                .setTitle('Sukces')
                .setDescription('Moduł został aktywowany.');
            res.end();
        })
        .catch(() => {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription('Wystąpił błąd podczas aktywowania modułu.');
            res.end();
        });
    }
}, true, true);