const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const { extractTags } = require('../../helpers/wykop-helper');

module.exports = new Command('stats', Permissions.EVERYONE, [1, 2], function(yeri, res, req, params, author, channel, guild) {
    let tagName = params[0];
    let maxEntries = Math.max(Math.min(500, parseInt(params[1])), 1) || 200;
    let pages = Math.ceil(maxEntries / 50);
    let requests = new Array(pages).fill(null);

    requests = requests.map((request, index) => { return this.wykop.getTagEntries(tagName, index + 1); });

    Promise.all(requests)
    .then((responses) => {
        let entries = responses
            .reduce((acc, response) => acc.concat(response.items), [])
            .slice(0, maxEntries);

        res.content.setColor(Command.INFO)
            .setTitle(`Statystyki tagu ${tagName}`);

        let tags = [];
        
        for (let entry of entries) {
            for (let tag of extractTags(entry.body)) {
                if ((index = tags.findIndex((e) => e[0] == tag)) != -1)
                    tags[index][1]++;
                else
                    tags.push([tag, 1]);
            }
        }

        res.embed = '';

        tags = tags.sort((a, b) => {
            if (b[1] > a[1]) return 1;
            if (b[1] < a[1]) return -1;
            if (b[0] > a[0]) return -1;
            if (b[0] < a[0]) return 1;
            return 0;
        });

        for (let [tag, count] of tags) {
            if (count != 1) res.embed += `**${tag}**(${count})  `;
            else res.embed += `**${tag}**  `;
        }

        res.end();
    })
    .catch(() => {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Wystąpił nieoczekiwany błąd poczas pobierania statystyk.');
        res.end();
        console.log(err);
    });
});