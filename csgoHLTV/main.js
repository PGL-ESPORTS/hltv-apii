var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let http = new XMLHttpRequest();
let fs = require('fs');
let cheerio = require('cheerio');
let got = require('got');
let makeSlug = require('./makeSlug');
let saveRedis = require('./redis.js');
let variables = require('./variables.json');
let getTeamPlayers = require('./getTeamPlayers');
let  kdOnMap  = require("./kdOnMap");
  
var team = "Natus Vincere";

async function getPlayerById() {

 let data = await getTeamPlayers.getTeamPlayers(team);
  
       var objectToParse ={};
        objectToParse.players = [];
        
        (data.players).forEach(player =>{
                
                if(player.type == "Starter") {

                    (objectToParse.players).push(player);
                }
            })

    let playerObj = {};
    let players = objectToParse.players;
    let playersName = [];
    players.forEach(player => {
    playersName.push(player['name']);
    playerObj[`${player['name']}`] = player['id'];

  });
//   console.log(playerObj);
 
  playersName.forEach(async (playerName) => {
 
        playerObject = {};
        http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01`, false, variables.username, variables.password);
        http.send("");
        
        if (http.status == 200) {

            let playerData = JSON.parse(http.responseText);
            playerObject.on1lose = await get1vs1Lost(playerObj[playerName],playerName);
            playerData.maps =  await kdOnMap.kdOnMap(playerName);
            playerData.on1lost  = playerObject.on1lose;
            // console.log(playerData);
            var redisObj = JSON.stringify(playerData);
            saveRedis.saveRedis(team, playerData.nick, redisObj);

        } else {
            // console.log("⚠️ Authentication failed.");
        }

  }) 

}

getPlayerById();



async function get1vs1Lost(id,name) {

    return new Promise((resolve, reject) => {

var vgmUrl = `https://www.hltv.org/stats/players/clutches/${id}/1on1/${makeSlug.makeSlug(name)}?startDate=2021-01-12&endDate=2021-07-01`;

got(vgmUrl).then(response => {
var $ = cheerio.load(response.body);
var div = Number(($(`.summary .col:nth-child(2) .value`).html()));
playerObject.on1lose = div;
    resolve(div);

}).catch(err => {
console.log(err);
});

})
}