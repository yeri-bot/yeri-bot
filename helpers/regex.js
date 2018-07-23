class Regex {
    constructor(pattern, flags) {
        if (typeof pattern == 'string') {
            this._regexp = new RegExp(pattern, flags);
        }
        else if (pattern instanceof RegExp) {
            this._regexp = new RegExp(pattern.source, (flags !== undefined) ? flags : pattern.flags);
        }
        else {
            throw new TypeError('pattern attribute must be string or RegExp.');
        }
    }

    get source() {
        return this._regexp.source;
    }

    set source(value) {
        this._regexp = new RegExp(value, this.flags);
    }

    get flags() {
        return this._regexp.flags;
    }
    
    set flags(value) {
        this._regexp = new RegExp(this.source, value);
    }

    hasFlag(flag) {
        return this.flags.search(flag) != -1;
    }
    
    toggleFlag(flag, state) {
        let flags = this.flags;
    
        if (this.hasFlag(flag) && state == false) {
            flags = flags.replace(flag, '');
        }
        else if (!this.hasFlag(flag) && state == true) {
            flags += flag;
        }
        else {
            return;
        }
    
        this.flags = flags;
    }

    match(text) {
        return this._regexp.test(text);
    }

    exec(text) {
        return this._regexp.exec(text);
    }

    static escape(text) {
        return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    toString() {
        return this._regexp.toString();
    }
}

module.exports = Regex;