const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const Regex = require('../../helpers/regex');
const numeral = require('../../helpers/numeral');
const extractTags = require('../../helpers/extract-tags');
const timeAgo = require('../../helpers/time-ago');
const moment = require('moment-timezone');

let commandPattern = /^((now[aey]|najnowsz[aey]) )?#([a-z0-9]+)( (z|nie|bez)( #[a-z0-9]+)+)?( (z|nie|bez)( #[a-z0-9]+)+)?$/i;

module.exports = new Command(commandPattern, Permissions.EVERYONE, undefined, function(yeri, res, req, params, author, channel, guild) {
    let reqGroups = new Regex(commandPattern).exec(req.fullCommand);

    let tagName = reqGroups[3];
    let newest = !!(reqGroups[2]);
    let includes = [], excludes = [];

    if (/z/i.test(reqGroups[5])) {
        includes = extractTags(reqGroups[4]);

        if (/z/i.test(reqGroups[8])) includes = includes.concat(extractTags(reqGroups[7]));
        if (/(nie|bez)/i.test(reqGroups[8])) excludes = extractTags(reqGroups[7]);
    }

    if (/(nie|bez)/i.test(reqGroups[5])) {
        excludes = extractTags(reqGroups[4]);

        if (/(nie|bez)/i.test(reqGroups[8])) excludes = excludes.concat(extractTags(reqGroups[7]));
        if (/z/i.test(reqGroups[8])) includes = extractTags(reqGroups[7]);
    }

    this.wykop.getTagEntries(tagName, 1)
    .then((response) => {
        let entries = response.items;
        entries.forEach((entry) => {
            entry.tags = extractTags(entry.body);
        });

        entries = entries.filter((entry) => (
            entry.embed != undefined
            &&
            !entry.tags.some((tag) => excludes.includes(tag))
            &&
            includes.every((tag) => entry.tags.includes(tag))
        ));


        if (entries.length == 0) {
            res.content.setColor(Command.INFO)
                .setTitle('Wykop')
                .setDescription('Brak jakichkolwiek wyników.');
            res.end();
            return;
        }

        let entry = (newest ? entries[0] : entries[Math.floor(Math.random() * entries.length)]);

        let votes = (entry.vote_count ? entry.vote_count + ' ' + numeral(entry.vote_count, 'plus', 'plusy', 'plusów') : 'Brak plusów');
        let time = timeAgo(moment().diff(moment.tz(entry.date, 'Europe/Warsaw')));
        let title = '';

        entry.tags.map((tag) => '#' + tag).forEach((tag, index) => {
            let first = (index == 0);

            if (title.length + tag.length + !first <= 200) {
                if (!first) title += ' ';
                title += tag;
            } 
        });

        res.content.setColor(Command.OK)
            .setAuthor(entry.author, entry.author_avatar_lo, `https://www.wykop.pl/ludzie/${entry.author}/`)
            .setTitle(title)
            .setURL(entry.url)
            .setFooter(`${votes} \u2014 ${time}`);
        res.embed = entry.embed.url;
        res.end();
        
    })
    .catch((err) => {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Wystąpił nieoczekiwany błąd poczas pobierania wyników.');
        res.end();
        console.log(err);
    });
}, false, true);