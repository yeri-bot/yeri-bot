const Yeri = require('./yeri');

new Yeri({
    version: '4.0.0',
    discord: {
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
        }
    }
}).start();