const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const DbController = require('./lib/db-controller');
const CommandManager = require('./lib/command-manager');

class Yeri {
    constructor(options) {
        this.options = options;
        this.isMaknae = process.argv.includes('--maknae');
        this.uid = Math.floor(10000 + Math.random() * 90000);
        this.discord = new Discord.Client();
        this.db = new DbController();
        this.cmdMgr = new CommandManager(this);
        this.cmdMgr.prefix = '--';
    }

    connect() {
        return Promise.all([
            this.discord.login((!this.isMaknae) ? this.options.discord.token : this.options.discord.maknaeToken)
            .catch((reason) => {
                console.log('[ERROR]', 'Nie można połączyć z Discordem.');
                console.log(reason);
            }),
            this.db.connect(this.options.mongodb)
            .catch((reason) => {
                console.log('[ERROR]', 'Nie można połączyć z bazą danych.');
                console.log(reason);
            })
        ]);
    }

    start() {
        this.connect()
        .then(() => {
            this.loadModules();
            this.discord.user.setActivity('Node.js ' + process.version, 'LISTENING');
            this.discord.on('message', (msg) => {
                console.log(msg.content);
                this.cmdMgr.handleMessage(msg);
            });
        });
    }

    loadModules() {
        for (let moduleName in this.options.modules) {
            let modulePath = path.join(__dirname, 'modules', moduleName);
            this.cmdMgr.addModule(modulePath, this.options.modules[moduleName]);
        }
    }
}

module.exports = Yeri;