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
    
    let localState = yeri.cmdMgr.modulesMgr.getModuleState(moduleName, guild.id);
    let globalState = yeri.cmdMgr.modulesMgr.getModuleState(moduleName);

    if (localState == true) {
        yeri.cmdMgr.modulesMgr.offModule(moduleName, guild.id)
        .then(() => {
            res.content.setColor(Command.OK)
                .setTitle('Sukces')
                setDescription('Moduł został dezaktywowany.');
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
        if (globalState == false) {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd')
                .setDescription('Moduł nie mógł zostać aktywowany, gdyż został dezaktywowany globalnie.');
            res.end();
            return;
        }

        yeri.cmdMgr.modulesMgr.onModule(moduleName, guild.id)
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
});