let makeSlug = require('./makeSlug');
let cheerio = require('cheerio');
let got = require('got');
let variables = require('./variables.json')


async function get1vs1Lost(id,name) {

    return new Promise((resolve, reject) => {
        
var vgmUrl = `https://www.hltv.org/stats/players/clutches/${id}/1on1/${makeSlug.makeSlug(name)}?startDate=${variables.startData}&endDate=${variables.endData}`;

got(vgmUrl).then(response => {
var $ = cheerio.load(response.body);
var div = Number(($(`.summary .col:nth-child(2) .value`).html()));
    resolve(div);

}).catch(err => {
console.log(err);
});

})
}

module.exports = {get1vs1Lost};