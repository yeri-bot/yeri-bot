const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

let command = new Command('', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    res.content = null;
    res.embed = this.macros.get(guild.id).get(req.name).content;
    res.end();
});

command.matches = function(module, cmdReq, cb) {    
    if (!cmdReq.hasPrefix) return cb(false, 1);
    if (cmdReq.parametersCount > 0) return cb(false, 2);

    if (!module.macros.has(cmdReq.guildId)) cb(false, 0);
    else if (!module.macros.get(cmdReq.guildId).has(cmdReq.name)) cb(false, 0);
    else cb(true);
};

module.exports = command;