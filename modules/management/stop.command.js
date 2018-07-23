const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command('stop', Permissions.OPERATOR, [0, 1], function(res, params, sender, msg, channel) {
    if (params.length == 0 || parseInt(params[0]) === this.uid) {
        this.discord.on('disconnect', () => process.exit(0));
        this.discord.destroy();
    }
});