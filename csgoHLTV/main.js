let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let http = new XMLHttpRequest();
let variables = require('./variables.json');
let getTeamPlayers = require('./getTeamPlayers');
let kdOnMap  = require("./kdOnMap");
let get1vs1Lost = require('./get1vs1Lost');  
let team = "Natus Vincere";
let saveRedis = require('./redis')
let getSteamID = require('./getSteamID');
let makeSlug = require('./makeSlug.js');

async function getPlayerById() {

    let data = await getTeamPlayers.getTeamPlayers(team);
    let playersArray = [];
    (data.players).forEach(player =>{
                
                if(player.type == "Starter") {

                    (playersArray).push(player);
                }
    })

    let playerObj = {}; //obiect {playerName : playerHLTVid} pt toti playerii din team.
    let playersName = []; //arry cu numele lor
    playersArray.forEach(player => {
    playersName.push(player['name']);
    playerObj[`${player['name']}`] = player['id'];
 
    });

    for (let i=0;i<playersName.length;i++) {
        let playerName = playersName[i];
        playerObject = {};
        http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=${variables.startData}&endDate=${variables.endData}`, false, variables.username, variables.password);
        http.send("");
        
        if (http.status == 200) {

            let playerData = JSON.parse(http.responseText);
            
            playerData.on1lost = await get1vs1Lost.get1vs1Lost(playerObj[playerName],playerName); //pt obtinerea clutchurile 1 vs 1 pierdute
                       
            playerData.steamID =  await getSteamID.getSteamID(`${makeSlug.makeSlug(playerName)}`);
            let mapsKD = await kdOnMap.kdOnMap(playerName);
            playerData.mapsKD = mapsKD//pt obtinerea KD-ului pe ficare mapa.
           
            console.log(playerData);
            // console.log( kdOnMap.kdOnMap(playerName));
            let redisObj = JSON.stringify(playerData);
           
            await saveRedis.saveRedis(team, playerData.steamID, redisObj);

        } else {
            // console.log("⚠️ Authentication failed.");
        }
    }
}

getPlayerById();


