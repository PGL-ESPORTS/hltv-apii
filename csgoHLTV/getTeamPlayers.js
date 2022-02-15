const { HLTV } = require('hltv');

async function getTeamPlayers(team) {

    return new Promise((resolve, reject) => {

        HLTV.getTeamByName({ name: team }).then(res => {
            resolve(res);
  
        })
    })
}

module.exports = {getTeamPlayers};