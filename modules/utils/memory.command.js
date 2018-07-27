const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');

module.exports = new Command('pamiec', Permissions.EVERYONE, 0, function(yeri, res, req, params, author, channel, guild) {
    let mem = process.memoryUsage();
    
    for (let memType in mem) {
        mem[memType] = (mem[memType] / (1024 * 1024)).toFixed(1);
    }

    res.content.setColor(Command.INFO)
        .setTitle('Informacje o wykorzystaniu pamięci')
        .setThumbnail('https://i.imgur.com/SFm57VI.png')
        .setDescription(
            `RSS: ${mem.rss} MB\n` +
            `Heap (w użyciu): ${mem.heapUsed} MB\n` +
            `Heap (całkowity): ${mem.heapTotal} MB\n` +
            `External: ${mem.external} MB`
        );
    res.end();
});