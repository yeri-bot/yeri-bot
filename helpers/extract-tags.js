module.exports = function(text) {
    let parser = /#([a-z0-9]+)/ig;
    let tag;
    let tags = new Set();

    while (tag = parser.exec(text)) {
        tags.add(tag[1]);
    }

    return Array.from(tags);
};