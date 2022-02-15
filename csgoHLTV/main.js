let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let http = new XMLHttpRequest();
let saveRedis = require('./redis.js');
let variables = require('./variables.json');
let getTeamPlayers = require('./getTeamPlayers');
let maps = ['de_inferno','de_ancient','de_vertigo','de_dust2','de_mirage','de_overpass','de_nuke']
  
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
  

  playersName.forEach(async (playerName) => {
        // let playerName = await playerrsName;
        
        playerObject = {};
        http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01`, false, variables.username, variables.password);
        http.send("");
        
        if (http.status == 200) {
            // console.log(JSON.parse(http.responseText), typeof http.responseText)
            let playerData = JSON.parse(http.responseText);
            // console.log(playerData);
            playerObject.on1lose = await get1vs1Lost.get1vs1Lost(playerObj[playerName],playerName);
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

                http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01&maps=${map}`, false, variables.username, variables.password);
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
            saveRedis.saveRedis(team, playerMapData.nick, redisObj);
            console.log(playerData);
        //    console.log(playerObject);
        //    console.log(playerMapData.weapons);
        } else {
            // console.log("⚠️ Authentication failed.");
        }

  }) 

}

getPlayerById();

