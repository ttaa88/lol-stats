const apiConfig = {
    riotRoot: "https://na1.api.riotgames.com",    
    apiKey: "RGAPI-80c4ccc1-1cd2-4a4a-905b-0d62da721736"
}

const summonerApi = {
    byName: "lol/summoner/v4/summoners/by-name",
}

const matchApi = {
    byAccountId: "lol/match/v4/matchlists/by-account",
    byMatchId: "/lol/match/v4/matches"
}

function formUrl(api, param){
    return `${apiConfig.riotRoot}/${api}/${param}?api_key=${apiConfig.apiKey}`;
}

export { apiConfig, summonerApi, formUrl, matchApi };