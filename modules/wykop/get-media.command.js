const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const Regex = require('../../helpers/regex');
const numeral = require('../../helpers/numeral');
const { extractTags, prepareEntryTitle, prepareEntryBody } = require('../../helpers/wykop-helper');
const moment = require('moment-timezone');

let commandPattern = /^((now[aey]|najnowsz[aey]) )?(wpis )?# ?([a-z0-9]+)( (z|nie|bez)( # ?[a-z0-9]+)+)?( (z|nie|bez)( # ?[a-z0-9]+)+)?( \+ ?(\d+))?$/i;

module.exports = new Command(commandPattern, Permissions.EVERYONE, undefined, function(yeri, res, req, params, author, channel, guild) {
    let reqGroups = new Regex(commandPattern).exec(req.fullCommand);

    let tagName = reqGroups[4];
    let newest = !!(reqGroups[2]);
    let onlyMedia = !(reqGroups[3]);
    let includes = [], excludes = [];
    let minVotes = reqGroups[12];

    // ### EXTRACT INCLUDES AND EXCLUDES ###
    if (/^z$/i.test(reqGroups[6])) {
        includes = extractTags(reqGroups[5], true);

        if (/^z$/i.test(reqGroups[9])) includes = includes.concat(extractTags(reqGroups[8], true));
        if (/^(nie|bez)$/i.test(reqGroups[9])) excludes = extractTags(reqGroups[8], true);
    }

    if (/^(nie|bez)$/i.test(reqGroups[6])) {
        excludes = extractTags(reqGroups[5], true);

        if (/^(nie|bez)$/i.test(reqGroups[9])) excludes = excludes.concat(extractTags(reqGroups[8], true));
        if (/^z$/i.test(reqGroups[9])) includes = extractTags(reqGroups[8], true);
    }

    // ### GET ENTRIES ###
    this.wykop.getTagEntries(tagName, 1)
    .then((response) => {
        let entries = response.items;
        entries.forEach((entry) => {
            entry.tags = extractTags(entry.body);
        });

        // ### FILTER ENTRIES ###
        entries = entries.filter((entry) => (
            (entry.embed != undefined || !onlyMedia)
            &&
            (minVotes <= entry.vote_count)
            &&
            (newest || !this.idHistory.hasId(entry.id, guild.id))
            &&
            !entry.tags.some((tag) => excludes.includes(tag))
            &&
            includes.every((tag) => entry.tags.includes(tag))
        ));

        // ### PREPARE RESPONSE ###
        if (entries.length == 0) {
            res.content.setColor(Command.INFO)
                .setTitle('Wykop')
                .setDescription('Brak jakichkolwiek wyników.');
            res.end();
            return;
        }

        let entry = (newest ? entries[0] : entries[Math.floor(Math.random() * entries.length)]);

        let votes = (entry.vote_count ? entry.vote_count + ' ' + numeral(entry.vote_count, 'plus', 'plusy', 'plusów') : 'Brak plusów');
        let time = moment.tz(entry.date, 'Europe/Warsaw').locale('pl').fromNow();

        if (onlyMedia) {
            res.content.setColor(Command.OK)
                .setAuthor(entry.author, entry.author_avatar_lo, `https://www.wykop.pl/ludzie/${entry.author}/`)
                .setTitle(prepareEntryTitle(entry.tags))    
                .setURL(entry.url)
                .setFooter(`${votes} \u2014 ${time}`);
            res.embed = entry.embed.url;
        }
        else {
            res.content.setColor(Command.OK)
                .setAuthor(entry.author, entry.author_avatar_lo, `https://www.wykop.pl/ludzie/${entry.author}/`)
                .setTitle('Zobacz wpis')
                .setURL(entry.url)
                .setDescription(prepareEntryBody(entry.body))  
                .setFooter(`${votes} \u2014 ${time}`);
            if (entry.embed != undefined) res.embed = entry.embed.url;
        }

        res.end();

        this.idHistory.addId(entry.id, guild.id);
    })
    .catch((err) => {
        res.reset();
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Wystąpił nieoczekiwany błąd poczas pobierania wyników.');
        res.end();
        console.log(err);
    });
}, false, true);