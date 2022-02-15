var username = 'pgl';
var password = 'Hm2faD75vbvXBEq3';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var http = new XMLHttpRequest();
const { HLTV } = require('hltv')
var redis = require("redis");
var redisIp = 'localhost';

const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');


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
var nameOfTheTeam = "Natus Vincere";
async function getTeamPlayers() {


    return new Promise((resolve, reject) => {

        HLTV.getTeamByName({ name: nameOfTheTeam }).then(res => {
            resolve(res);
  
            })
        })
    }

async function getPlayerById() {

 let data = await getTeamPlayers();
  
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
 
  var playerObject = {
      openingKills : new Number(),
      totalKills : new Number(),
      on1won : new Number(),
      on2won : new Number(),
      on3won : new Number(),
      on4won : new Number(),
      on5won : new Number(),
      on1lose : new Number(),
      WinPercentAfterFirstKill : new Number(),

  };
  var maps = ['de_inferno','de_ancient','de_vertigo','de_dust2','de_mirage','de_overpass','de_nuke']

  playersName.forEach(async (playerName) => {
        // let playerName = await playerrsName;
        playerObject = {};
        http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01`, false, username, password);
        http.send("");
        
        if (http.status == 200) {
            // console.log(JSON.parse(http.responseText), typeof http.responseText)
            let playerData = JSON.parse(http.responseText);
            // console.log(playerData);

            playerObject.on1lose = await get1vs1Lost(playerObj[playerName],playerName);
            
            async function get1vs1Lost(id,name) {

                return new Promise((resolve, reject) => {
            
            var vgmUrl = `https://www.hltv.org/stats/players/clutches/${id}/1on1/${makeSlug(name)}?startDate=2021-01-12&endDate=2021-07-01`;
            
            got(vgmUrl).then(response => {
            // console.log(response.body);
            var $ = cheerio.load(response.body);
            // console.log($.html());
            var div = Number(($(`.summary .col:nth-child(2) .value`).html()));
            playerObject.on1lose = div;
                resolve(div);
            // console.log(div);
            
            
            }).catch(err => {
            console.log(err);
            });
            
            })
            }
            playerObject.openingKills = playerData.openingKills;
            playerObject.totalKills = playerData.totalKills
            playerObject.on1won = playerData.clutches.on1won
            playerObject.on2won = playerData.clutches.on2won
            playerObject.on3won = playerData.clutches.on3won
            playerObject.on4won = playerData.clutches.on4won
            playerObject.on5won = playerData.clutches.on5won
            
            playerObject.WinPercentAfterFirstKill = Number(Number(playerData.teamWinPercentAfterFirstKill).toFixed(2));

            
            let playerMapData= {};
            maps.forEach(map =>{

                http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01&maps=${map}`, false, username, password);
                http.send("");
                if (http.status == 200) {
                    playerMapData  = JSON.parse(http.responseText);

                    if(playerMapData.deaths != "0.0") {
                    
                    playerObject[`${map}_KD`] =  Number(Number(playerMapData.kills/playerMapData.deaths).toFixed(2)); 
                    }
                    else {
                        playerObject[`${map}_KD`] =  0;
                    }
                    
                } else {
                    // console.log("⚠️ Authentication failed.");
                }
        

            }) 
            var redisObj = JSON.stringify(playerObject);

            // db.set(`${makeSlug(nameOfTheTeam)}:playerData:${makeSlug(playerMapData.nick)}`,redisObj);
            console.log(playerData);
        //    console.log(playerObject);
        //    console.log(playerMapData.weapons);
            


        } else {
            // console.log("⚠️ Authentication failed.");
        }

  }) 

}

getPlayerById();

