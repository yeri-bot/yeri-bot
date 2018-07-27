const fs = require('fs');
const Command = require('./command');
const PermissionsManager = require('./permissions-manager');
const Response = require('./response');

class CommandManager {
    constructor(yeri) {
        this.prefixes = ['--'];
        this.yeri = yeri;
        this.modules = new Map();
        this.permissionsMgr = new PermissionsManager(yeri.options.discord.ownerId);
        this.lastCommands = new Map();
    }

    addModule(dirPath, options) {
        if (!fs.existsSync(dirPath)) {
            console.log('[ERROR]', `Nie można załadować modułu. Folder o ścieżce "${dirPath}" nie istnieje.`);
            return;
        }
        if (!fs.existsSync(dirPath + '/module.js')) {
            console.log('[ERROR]', `Nie można załadować modułu. Plik o ścieżce "${dirPath}/module.js" nie istnieje.`);
            return;
        }

        let module = require(dirPath + '/module.js');
        module.options = options;

        fs.readdirSync(dirPath).forEach((file) => {
            if (/^(.+)\.command\.js$/i.test(file)) {
                let command = require(dirPath + '/' + file);
                command.module = module;
                module.commands.add(command);
            }
        });

        this.modules.set(module.name, module);
        
        module.sync(this.yeri.db);

        return module;
    }

    handleMessage(message) {
        let res = new Response(message.channel);
        
        let guildId = message.guild.id;
        let cmdReq = this.parseCommand(message.content);
        cmdReq.guildId = guildId;

        if (cmdReq.hasPrefix && cmdReq.fullCommand == '') {
            if (this.lastCommands.has(guildId)) {
                cmdReq = this.lastCommands.get(guildId);
            }
            else {
                res.content.setColor(Command.ERROR)
                    .setTitle('Błąd')
                    .setDescription('W bieżącej sesji nie została wykonana jeszcze żadna komenda.');
                res.end();
                return;
            }
        }
        
        let userPermission = this.permissionsMgr.getUserPermission(guildId, message.author.id);

        let executed = false;
        let obstacles = {
            moduleDisabled: false,
            permissionDenied: false,
            invalidParameters: false
        };

        for (let module of this.modules.values()) {
            for (let command of module.commands) {
                command.matches(module, cmdReq, (match, obstacle) => {
                    if (!match) {
                        if (obstacle == 2) obstacles.invalidParameters = true;
                        return;
                    }

                    if (command.permission > userPermission) {
                        obstacles.permissionDenied = true;
                        return;
                    }
                    
                    if (!module.options.enabled) {
                        obstacles.moduleDisabled = true;
                        return;
                    }

                    command.callback.call(module, this.yeri, res, cmdReq, Array.from(cmdReq.parameters), message.author, message.channel, message.guild);
                    executed = true;
                });
                if (executed) break;
            }
            if (executed) break;
        }

        let isCommand = true;

        if (!executed) {
            res.content.setColor(Command.ERROR)
                .setTitle('Błąd');

            if (obstacles.moduleDisabled) {
                res.content.setDescription('Komenda nie mogła zostać wykonana, gdyż moduł jest nieaktywny.');
                res.end();
            }
            else if (obstacles.permissionDenied) {
                res.content.setDescription('Komenda nie mogła zostać wykonana, gdyż nie posiadasz odpowiednich uprawnień.');
                res.end();
            }
            else if (obstacles.invalidParameters) {
                res.content.setDescription('Komenda nie mogła zostać wykonana, gdyż liczba parametrów jest niezgodna.');
                res.end();
            }
            else if (cmdReq.hasPrefix) {
                res.content.setDescription('Komenda lub makro o tej nazwie nie istnieje.');
                res.end();
            }
            else {
                isCommand = false;
            }
        }

        if (isCommand) {
            this.lastCommands.set(guildId, cmdReq);
        }
    }

    parseCommand(messageContent) {
        messageContent = messageContent.trim().replace(/\s+/g, ' ');

        let bits = messageContent.split(' ');
        let command = { hasPrefix: false };

        for (let prefix of this.prefixes) {
            if (bits[0].startsWith(prefix)) {  //{prefix}{commandName}, ...
                command.hasPrefix = true;
                bits[0] = bits[0].slice(prefix.length);
                break;
            }
            else if (bits[0] == prefix) {      //{prefix}, {commandName}, ...
                command.hasPrefix = true;
                bits.shift();
                break;
            }
        }

        command.fullCommand = bits.join(' ');
        command.name = bits[0];
        bits.shift();
        command.parameters = bits;
        command.parametersCount = bits.length;

        return command;
    }
}

module.exports = CommandManager;