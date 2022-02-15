var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let http = new XMLHttpRequest();
let variables = require('./variables.json');
let getTeamPlayers = require('./getTeamPlayers');
let  kdOnMap  = require("./kdOnMap");
let get1vs1Lost = require('./get1vs1Lost');  
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
  
  for (let i=0;i<playersName.length;i++) {
        let playerName = playersName[i];
      playerObject = {};
      http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01`, false, variables.username, variables.password);
      http.send("");
      
      if (http.status == 200) {

          let playerData = JSON.parse(http.responseText);
          playerObject.on1lose = await get1vs1Lost.get1vs1Lost(playerObj[playerName],playerName);
          playerData.maps =  await kdOnMap.kdOnMap(playerName);
          playerData.on1lost  = playerObject.on1lose;
          console.log(playerData);
          var redisObj = JSON.stringify(playerData);
          // saveRedis.saveRedis(team, playerData.nick, redisObj);

      } else {
          // console.log("⚠️ Authentication failed.");
      }

  }
}

getPlayerById();


