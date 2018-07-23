const { RichEmbed } = require('discord.js');

class Response {
    constructor(channel) {
        this.channel = channel;
        this.partial = false;
        this.parts = [{
            content: new RichEmbed(),
            attachment: null
        }];
    }

    get content() {
        if (this.partial) throw new Error('Response cannot be partial.');

        return this.parts[0].content;
    }

    set content(value) {
        if (this.partial) throw new Error('Response cannot be partial.');

        this.parts[0].content = value;
    }

    get embed() {
        if (this.partial) throw new Error('Response cannot be partial.');

        return this.parts[0].embed;
    }

    set embed(value) {
        if (this.partial) throw new Error('Response cannot be partial.');

        this.parts[0].embed = value;
    }

    addPart(content = new RichEmbed(), attachment = null) {
        if (!this.partial) throw new Error('Response must be partial.');

        let part = { content, attachment };
        this.parts.push(part);
        return part;
    }

    end() {
        this.parts.forEach((part) => {
            if (part.content != null) this.channel.send(part.content);
            if (part.embed != null) this.channel.send(part.embed);
        });
    }
}

module.exports = Response;