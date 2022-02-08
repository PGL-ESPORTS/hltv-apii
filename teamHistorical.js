var username = 'pgl';
var password = 'Hm2faD75vbvXBEq3';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var http = new XMLHttpRequest();
const { HLTV } = require('hltv')
var redis = require("redis");
var redisIp = 'localhost';

function makeSlug(text) {
    var slug = text.replace(/[^a-z0-9- .]/gi, '').trim().replace(/\s+/g, '_').replace(/\./g, '_').toLowerCase();

    if (slug.startsWith('team_')) {
        slug = slug.slice(5);
    }

    return slug;
}

var redisPass = '';
var db = redis.createClient(6379, redisIp);

db.auth(redisPass,() => {
    console.log("connected to redis");
  });
  db.select(2);

//   var maps = ['de_inferno','de_ancient','de_vertigo','de_dust2','de_mirage','de_overpass','de_nuke']
//   maps.forEach(map=> {


    
    http.open("get", `https://www.hltv.org/api/event/team/4608?startDate=2021-01-01&endDate=2021-07-06`, false, username, password);
    http.send("");
    
    if (http.status == 200) {
        // console.log(JSON.parse(http.responseText), typeof http.responseText)
        let teamData = JSON.parse(http.responseText);
        let redisObj = http.responseText;
        console.log(teamData);
        // console.log(teamData.teamName);
        db.set(`${makeSlug(teamData.teamName)}:teamData:6months`,redisObj);
        console.log("OK. You now established a session. You can navigate to the URL.");
    } else {
        console.log("⚠️ Authentication failed.");
    }



//   })

