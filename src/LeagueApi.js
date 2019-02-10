const apiConfig = {
    riotRoot: "https://na1.api.riotgames.com",    
    apiKey: "RGAPI-2ac7a890-071f-4d04-972c-ebad1e7355d8"
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