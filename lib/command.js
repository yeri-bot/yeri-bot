const Regex = require('../helpers/regex');

class Command {
    constructor(pattern, permission, parameters, callback, prefixed = true, matchFull = false) {
        if (typeof pattern == 'string') {
            pattern = '^' + Regex.escape(pattern) + '$';
        }
        this.pattern = new Regex(pattern);
        this.pattern.toggleFlag('i', true);
        this.permission = permission;
        this.parameters = parameters;
        this.callback = callback;
        this.module = null;
        this.prefixed = prefixed;
        this.matchFull = matchFull;
    }

    matches(module, cmdRequest, cb) {
        if (cmdRequest.hasPrefix != this.prefixed) return cb(false, 1);
        if (!this.matchFull && !this.pattern.match(cmdRequest.name)) return cb(false, 0);
        if (this.matchFull && !this.pattern.match(cmdRequest.fullCommand)) return cb(false, 0);
        
        let checkVariant = (variant) => {
            if (typeof variant == 'number') {
                return (cmdRequest.parametersCount == variant);
            }
            else if (this.parameters instanceof RegExp) {
                return variant.test(cmdRequest.parametersCount);
            }
            else if (this.parameters instanceof Regex) {
                return variant.match(cmdRequest.parametersCount);
            }
            else if (variant == undefined || variant == null) {
                return true;
            }
            else {
                return false;
            }
        };

        if (this.parameters instanceof Array) {
            if (this.parameters.some((variant) => checkVariant(variant))) {
                cb(true);
            }
            else {
                cb(false, 2);
            }
        }
        else {
            if (checkVariant(this.parameters)) {
                cb(true);
            }
            else {
                cb(false, 2);
            }
        }
    }
}

Command.OK = '#149372';
Command.INFO = '#4080ff';
Command.ERROR = '#f04040';

module.exports = Command;