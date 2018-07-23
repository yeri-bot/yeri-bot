const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command('stop', Permissions.OPERATOR, [0, 1], function(yeri, res, params, sender, msg, channel) {
    if (params.length == 0 || parseInt(params[0]) === yeri.uid) {
        yeri.discord.on('disconnect', () => process.exit(0));
        yeri.discord.destroy();
    }
});