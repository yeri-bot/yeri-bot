const Command = require('../../lib/command');
const Permissions = require('../../lib/permissions');
const https = require('https');

module.exports = new Command('tvp', Permissions.EVERYONE, undefined, function(yeri, res, req, params, author, channel, guild) {
    let data = 'fimg=0&msg=';
    data += encodeURIComponent(params.join(' ')).replace(/%20/g, '+');

    let httpReq = https.request({
        method: 'POST',
        host: 'pasek-tvpis.pl',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    }, (response) => {
        response.on('data', (chunk) => {});
        response.on('end', () => {
            let url = 'https://pasek-tvpis.pl' + response.headers.location;

            res.content = null;
            res.embed = url;
            res.end();
        });
    })
    .on('error', (err) => {
        res.content.setColor(Command.ERROR)
            .setTitle('Błąd')
            .setDescription('Wystąpił nieoczekiwany błąd.');
        res.end();
        console.log(err);
    });

    httpReq.write(data)
    httpReq.end();
});