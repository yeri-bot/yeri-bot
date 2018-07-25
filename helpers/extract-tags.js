module.exports = function(text) {
    let parser = /#([a-z0-9]+)/ig;
    let tag;
    let tags = [];

    while (tag = parser.exec(text)) {
        tags.push(tag[1]);
    }

    return tags;
};