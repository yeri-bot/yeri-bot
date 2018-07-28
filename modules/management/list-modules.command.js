const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const indicator = require('../../helpers/indicator');

module.exports = new Command('moduly', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    let modules = [];
    let modulesCount = yeri.cmdMgr.modules.size;
    let activeModulesCount = 0;

    yeri.cmdMgr.modules.forEach((module) => {
        let globalState = yeri.cmdMgr.modulesMgr.getModuleState(module.name);
        let localState = yeri.cmdMgr.modulesMgr.getModuleState(module.name, guild.id);

        if (localState) {
            modules.push(`**${module.name}**`);
            activeModulesCount++;
        }
        else {
            if (globalState == false) {
                modules.push(module.name + '!');
            }
            else {
                modules.push(module.name);
            }
        }
    });

    res.content.setColor(Command.INFO)
        .setTitle(indicator('Moduły', activeModulesCount, modulesCount))
        .setDescription(modules.join(' '));
    res.end();
});