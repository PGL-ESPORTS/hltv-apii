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

async function getTeamPlayers() {


    return new Promise((resolve, reject) => {


        HLTV.getTeamStats({ id: 4608 }).then(res => {
          
           resolve(res);
         
        })

        // HLTV.getTeamByName({ name: "Natus Vincere" }).then(res => {
        //     // resolve(res);
            
        // })

        // HLTV.getTeamStats({ id: 4608 }).then(res => {
        //     // console.log(res.currentLineup);
        //     resolve(res.currentLineup);
           
        // })
});
}


async function getPlayerById() {

 let data = await getTeamPlayers();
  
       var objectToParse ={};
        objectToParse.players = [];
        
        (data.currentLineup).forEach(player =>{
               
                    (objectToParse.players).push(player);
               
            })
            objectToParse.name = data.name;
           
           
    

    let players = objectToParse.players;
   let playersName = [];
  players.forEach(player => {
    playersName.push(player['name']);
  });
 

  playersName.forEach(playerName => {

        http.open("get", `https://www.hltv.org/api/event/player/${playerName}?startDate=2021-01-01&endDate=2021-06-06`, false, username, password);
        http.send("");
        
        if (http.status == 200) {
            // console.log(JSON.parse(http.responseText), typeof http.responseText)
            let playerData = JSON.parse(http.responseText);
            let redisObj = http.responseText;
            
            db.set(`${makeSlug(data.name)}:playersData:6months:${makeSlug(playerData.nick)}`,redisObj);
            console.log("OK. You now established a session. You can navigate to the URL.");
        } else {
            console.log("⚠️ Authentication failed.");
        }
  })
        var teams = ['Gambit'];
        // 'BIG','mousesports','Heroic','Gambit','NIP','Vitality'];

        (data.matches).forEach(match =>{
            if(teams.includes(match.team2.name)) {
                
                        HLTV.getMatchMapStats({ id: match.mapStatsId }).then((res) => {
                            db.set(`${data.name}:${makeSlug(data.name)}:${makeSlug(match.team2.name)}:${res.matchId}:${match.mapStatsId}`,JSON.stringify(res));
                        })
            }
        })



}

getPlayerById();

