function extractTags(text) {
    let parser = /#([a-z0-9]+)/ig;
    let tag;
    let tags = new Set();

    while (tag = parser.exec(text)) {
        tags.add(tag[1]);
    }

    return Array.from(tags);
}

function prepareEntryTitle(tags) {
    let title = '';

    tags.map((tag) => '#' + tag).forEach((tag, index) => {
        let first = (index == 0);

        if (title.length + tag.length + !first <= 200) {
            if (!first) title += ' ';
            title += tag;
        } 
    });

    return title;
}

function escapeEntryBody(text) {
    return text.replace(/<br \/>/g, '')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/`/g, '\\`')
        .replace(/#<a href="#.+?">(.+?)<\/a>/g, '**#$1**')
        .replace(/<a href="(.+?)".*?>(.+?)<\/a>/g, '[$2]($1)')
        .replace(/<em>([^]*?)<\/em>/g, '_$1_')
        .replace(/<strong>([^]*?)<\/strong>/g, '**$1**')
        .replace(/<code>([^]*?)<\/code>/g, '```\n$1```')
        .replace(/<code class="dnone">([^]*?)<\/code>/g, '```[spoiler]\n$1```')
        .replace(/<cite>([^]*?)<\/cite>/g, '```[cytat]\n$1```')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#91;/g, '\\[')
        .replace(/&#92;/g, '\\\\')
        .replace(/&amp;/g, '&');
}

function prepareEntryBody(body) {
    let splitter = new RegExp(`(${[
        '<br />',
        '#<a href="#.+?">.+?<\/a>',
        '<a href=".+?".*?>.+?<\/a>',
        '<em>[^]*?<\/em>',
        '<strong>[^]*?<\/strong>',
        '<code.*?>[^]*?<\/code>',
        '<cite>[^]*?<\/cite>'
    ].join('|')})`);

    let parts = body.split(splitter).map((part) => escapeEntryBody(part));
    let length = 0;

    for (let [index, part] of parts.entries()) {
        length += part.length;
        if (length > 2048) {
            parts.splice(index);
            break;
        }
    }

    return parts.join('').trimRight();
}

module.exports = { extractTags, prepareEntryTitle, escapeEntryBody, prepareEntryBody };