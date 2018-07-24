const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

let command = new Command('', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    res.content = null;
    res.embed = this.macros.get(req.name).content;
    res.end();
});

command.matches = function(module, cmdRequest, cb) {    
    if (!cmdRequest.hasPrefix) return cb(false, 1);
    if (cmdRequest.parametersCount > 0) return cb(false, 2);

    if (module.macros.has(cmdRequest.name.toLowerCase())) cb(true);
    else cb(false, 0);
};

module.exports = command;