const { RichEmbed } = require('discord.js');

class Response {
    constructor(channel) {
        this.channel = channel;
        this.locked = false;
        this._partial = false;
        this._content = new RichEmbed();
        this._embed = null;
        this.parts = [];
    }

    get partial() {
        return this._partial;
    }

    set partial(value) {
        if (this.locked) throw new Error('Changing partial property is locked.');

        this._partial = value;
    }

    get content() {
        if (this._partial) throw new Error('Response cannot be partial.');

        return this._content;
    }

    set content(value) {
        if (this._partial) throw new Error('Response cannot be partial.');

        this.locked = true;
        this._content = value;
    }

    get embed() {
        if (this._partial) throw new Error('Response cannot be partial.');

        return this._embed;
    }

    set embed(value) {
        if (this._partial) throw new Error('Response cannot be partial.');

        this.locked = true;
        this._embed = value;
    }

    addPart(attachment = null) {
        if (!this._partial) throw new Error('Response must be partial.');

        this.locked = true;
        let part = { content: new RichEmbed(), attachment };
        this.parts.push(part);
        return part;
    }

    end() {
        if (this._partial) {
            this.parts.forEach((part) => {
                if (part.content != null) this.channel.send(part.content);
                if (part.embed != null) this.channel.send(part.embed);
            });
        }
        else {
            if (this._content != null) this.channel.send(this._content);
            if (this._embed != null) this.channel.send(this._embed);
        }
    }
}

module.exports = Response;