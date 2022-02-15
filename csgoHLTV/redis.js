let variables = require("./variables.json");
var redis = require("redis");
let makeSlug = require('./makeSlug.js')

function saveRedis(team, player, data) {
    var db = redis.createClient(6379, variables.redisIp);
    db.auth(variables.redisPass,() => {
    console.log("connected to redis");
    });
    db.select(2);

    db.set(`${makeSlug.makeSlug(team)}:playerData:${makeSlug.makeSlug(player)}`,data);
}

module.exports = {saveRedis};