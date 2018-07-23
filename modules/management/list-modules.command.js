const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const indicator = require('../../helpers/indicator');

module.exports = new Command('moduly', Permissions.EVERYONE, 0, function(yeri, res, params, sender, msg, channel) {
    let modules = [];
    let modulesCount = yeri.cmdMgr.modules.size;
    let activeModulesCount = 0;

    yeri.cmdMgr.modules.forEach((module) => {
        if (module.options.enabled) {
            modules.push(`**${module.name}**`);
            activeModulesCount++;
        }
        else {
            modules.push(module.name);
        }
    });

    res.content.setColor(Command.INFO)
        .setTitle('Moduły ' + indicator(activeModulesCount, modulesCount))
        .setDescription(modules.join(' '));
    res.end();
});