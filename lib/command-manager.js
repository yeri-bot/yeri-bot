const fs = require('fs');
const Command = require('./command');
const PermissionsManager = require('./permissions-manager');
const Response = require('./response');

class CommandManager {
    constructor(botInstance) {
        this.prefix = '!';
        this.botInstance = botInstance;
        this.modules = new Map();
        this.permissionsMgr = new PermissionsManager(botInstance.options.discord.ownerId);
        this.lastCommand = null;
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
        
        return module;
    }

    handleMessage(message) {
        let cmdRequest = this.parseCommand(message.content);
        let res = new Response(message.channel);
        let userPermission = this.permissionsMgr.getUserPermission(message.guild.id, message.author.id);
        let isOwner = (this.botInstance.options.discord.ownerId == message.author.id);

        let executed = false;
        let obstacles = {
            moduleDisabled: false,
            permissionDenied: false,
            invalidParameters: false
        };

        for (let module of this.modules.values()) {
            for (let command of module.commands) {
                command.matches(module, cmdRequest, (match, obstacle) => {
                    if (!match) {
                        if (obstacle == 2) obstacles.invalidParameters = true;
                        return;
                    }

                    if (!isOwner && command.permission > userPermission) {
                        obstacles.permissionDenied = true;
                        return;
                    }
                    
                    if (!module.options.enabled) {
                        obstacles.moduleDisabled = true;
                        return;
                    }

                    command.callback.call(module, this.botInstance, res, cmdRequest, cmdRequest.parameters, message.author, message.channel, message.guild);
                    executed = true;
                });
                if (executed) break;
            }
            if (executed) break;
        }

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
            else if (cmdRequest.hasPrefix) {
                res.content.setDescription('Komenda o tej nazwie nie istnieje.');
                res.end();
            }
        }
    }

    parseCommand(messageContent) {
        messageContent = messageContent.trim().replace(/\s+/g, ' ');

        let bits = messageContent.split(' ');
        let command = {};

        if (bits[0].startsWith(this.prefix)) {  //{prefix}{commandName}, ...
            command.hasPrefix = true;
            bits[0] = bits[0].slice(this.prefix.length);
        }
        else if (bits[0] == this.prefix) {      //{prefix}, {commandName}, ...
            command.hasPrefix = true;
            bits.shift();
        }
        else {                                  //{commandName}, ...
            command.hasPrefix = false;
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