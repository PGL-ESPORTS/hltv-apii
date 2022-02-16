const { HLTV } = require('hltv')


HLTV.getTeamStats({ id: 4608 }).then(res => {
    console.log(res.overview);
})