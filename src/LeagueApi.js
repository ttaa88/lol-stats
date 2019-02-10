const apiConfig = {
    riotRoot: "https://na1.api.riotgames.com",    
    apiKey: "RGAPI-ed5204ab-e2a3-4251-bb1b-e75fc55d79c8"
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