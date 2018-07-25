const numeral = require('./numeral');

module.exports = function(time) {
    let ago = {};
    let div = 1;

    div *= 1000; ago.seconds = Math.floor(time / div);
    div *= 60;   ago.minutes = Math.floor(time / div);
    div *= 60;   ago.hours   = Math.floor(time / div);
    div *= 24;   ago.days    = Math.floor(time / div);
                 ago.weeks   = Math.floor(ago.days / 7);
    div *= 30;   ago.months  = Math.floor(time / div);
    div *= 12;   ago.years   = Math.floor(time / div);

    let units = {
        years: { max: +Infinity, numerals: ['rok', '# lata', '# lat'] },
        months: { max: 12, numerals: ['miesiąc', '# miesiące', '# miesięcy'] },
        weeks: { max: 4, numerals: ['tydzień', '# tygodnie', '# tygodni'] },
        days: { max: 31, numerals: ['dzień', '# dni', '# dni'] },
        hours: { max: 24, numerals: ['godzinę', '# godziny', '# godzin'] },
        minutes: { max: 60, numerals: ['minutę', '# minuty', '# minut'] },
        seconds: { max: 60, numerals: ['sekundę', '# sekundy', '# sekund'] }
    };

    for (unitName in units) {
        let unit = units[unitName];
        let quantity = ago[unitName];

        if (quantity >= 1 && quantity < unit.max) {
            return numeral(quantity, unit.numerals[0], unit.numerals[1], unit.numerals[2]).replace(/#/g, quantity) + ' temu';
        }
    }
};