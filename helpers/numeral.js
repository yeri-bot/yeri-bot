module.exports = function(quantity, opt1, opt2, opt3 = opt2) {
    if (quantity == 1) return opt1;
    else if (/([^1]|^)[2-4]$/.test(quantity.toString().substr(-2))) return opt2;
    else return opt3;
};