const Yeri = require('./yeri');

new Yeri({
    version: '4.0.6',
    discord: {
        prefixes: ['--', '\u2014'],
        ownerId: '*****************',
        token: '*******.***.****************',
        maknaeToken: '*******.***.****************'
    },
    mongodb: {
        host: '*****************:27017',
        db: '**********************',
        user: '**********************',
        password: '************'
    },
    modules: {
        'management': {
            enabled: true
        },
        'utils': {
            enabled: true
        },
        'macros': {
            enabled: true
        },
        'wykop': {
            enabled: true,
            appKey: '**********',
            secretKey: '**********'
        }
    }
}).start();