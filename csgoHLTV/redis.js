let variables = require("./variables.json");
var redis = require("redis");
let makeSlug = require('./makeSlug.js')

async function saveRedis(team, player, data) {
    var db = redis.createClient(6379, variables.redisIp);
    db.auth(variables.redisPass,() => {
    // console.log("connected to redis");
    });
    db.select(2);
    // console.log(data);
    await db.set(`${makeSlug.makeSlug(team)}:${makeSlug.makeSlug(player)}`,data);
}

module.exports = {saveRedis};