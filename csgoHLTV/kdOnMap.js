let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let http = new XMLHttpRequest();
let variables = require('./variables.json');
let maps = ['de_inferno','de_ancient','de_vertigo','de_dust2','de_mirage','de_overpass','de_nuke']

async function kdOnMap(playerName) {


        
    return new Promise((resolve, reject) => { 
        let playerMapData = {};
        let playerMaps = {};

        for(let i=0;i<maps.length;i++) {

        }

        maps.forEach(map =>{



            http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-12&endDate=2021-07-01&maps=${map}`, false, variables.username, variables.password);
            http.send("");
            if (http.status == 200) {
                playerMapData  = JSON.parse(http.responseText);
        
                if(playerMapData.deaths != "0.0") {
                playerMaps[`${map}_KD`] =  Number(Number(playerMapData.kills/playerMapData.deaths).toFixed(2)); 
                }
                else {
                    playerMaps[`${map}_KD`] =  0;
                }
                
            } else {
                // console.log("⚠️ Authentication failed.");
            }
        
        
        }) 
            resolve(playerMaps);
    });



}

module.exports = {kdOnMap};