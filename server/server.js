const express = require('express')
const config = require('./LeagueApi')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const https = require('https');

app.get('/summer', cors(), (req, res, next) => {
    getAccountId(req.query["name"]);   
});

app.listen(port, () => console.log(`Listening on port ${port}`));

function formUrl(api, param){
    return `${config.apiConfig.riotRoot}/${api}/${param}?api_key=${config.apiConfig.apiKey}`;
}

function getAccountId(name){
    https.get(formUrl(config.summonerApi.byName, name), res => {
        res.on('data', chunk => {
            getMatchList(JSON.parse(chunk)["accountId"]);
        });
    })    
}

function getMatchList(accountId) {
    https.get(formUrl(config.matchApi.byAccountId, accountId), res => {
        let data = "";  
        let matches = [];

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {              
            matches = JSON.parse(data).matches.slice(0, 10).map(m => m["gameId"])      
            console.log(matches);     
        });
    })
}

function matchRow(accountId, data){
    for (var d of data){
      this.getMatchDetails(accountId, d.gameId);
    }    
  }