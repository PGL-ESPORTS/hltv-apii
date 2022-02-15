let makeSlug = require('./makeSlug');
let cheerio = require('cheerio');
let got = require('got');

async function get1vs1Lost(id,name) {

    return new Promise((resolve, reject) => {

var vgmUrl = `https://www.hltv.org/stats/players/clutches/${id}/1on1/${makeSlug.makeSlug(name)}?startDate=2021-01-12&endDate=2021-07-01`;

got(vgmUrl).then(response => {
// console.log(response.body);
var $ = cheerio.load(response.body);
// console.log($.html());
var div = Number(($(`.summary .col:nth-child(2) .value`).html()));
    resolve(div);
// console.log(div);


}).catch(err => {
console.log(err);
});

})
}

module.exports = {get1vs1Lost};