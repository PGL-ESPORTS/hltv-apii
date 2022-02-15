let makeSlug = require('./makeSlug');
let cheerio = require('cheerio');
let got = require('got');


async function get1vs1Lost(id,name) {

    return new Promise((resolve, reject) => {
        
var vgmUrl = `https://www.hltv.org/stats/players/clutches/${id}/1on1/${makeSlug.makeSlug(name)}?startDate=2021-01-12&endDate=2021-07-01`;

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