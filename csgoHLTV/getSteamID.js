let variables = require("./variables.json");
var redis = require("redis");

 async function getSteamID(playerID) {

    return new Promise((resolve, reject) => {
        
        var db = redis.createClient(6379, variables.redisIp);
        db.auth(variables.redisPass,() => {
        // console.log("connected to redis");
        });
        db.select(2, function (err, ree) {
                
            db.get(`playersID`, function (err, playersID) {
    
                playersID =  JSON.parse(playersID);
                Object.keys(playersID).forEach(player => {
                    
                    if(player === playerID ) {
                            resolve(playersID[player])
                            console.log(playersID[player]);
                    }
                });                 
            })         
        })
    })
}

module.exports = {getSteamID};