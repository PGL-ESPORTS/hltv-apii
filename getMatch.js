const { compareDocumentPosition } = require('domutils');
const { HLTV } = require('hltv');




HLTV.getMatch({ id: 2350052 }).then(res => {
  console.log(res);
})


