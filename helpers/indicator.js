module.exports = function(text, value, max = null) {
    if (max == null) {
        return `${text} (${value})`;
    }
    else {
        return `${text} (${value}/${max})`;
    }
};