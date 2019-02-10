import React, { Component } from 'react';
import { summonerApi, formUrl, matchApi } from './LeagueApi';
import axios from 'axios';
import Table from '@material-ui/core/Table';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


var runes = [];
var spells = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',    
      matches: []      
    };
    this.handleInput = this.handleInput.bind(this);
    this.getAccountId = this.getAccountId.bind(this);

    this.champions = this.loadChampion();
    this.items = this.loadItems();
    this.runes = this.loadRune();
    this.spells = this.loadSpells();
  }

  loadChampion(){
    var json = JSON.parse(JSON.stringify(require("./static/champion.json").data)); 
    var champions = {};
    for (const key of Object.keys(json)) {
      champions[json[key].key] = key;
    }      
    return champions;
  }

  loadItems(){
    var json = JSON.parse(JSON.stringify(require("./static/item.json").data)); 
    var items = {};
    for (const key of Object.keys(json)) {
      items[key] = json[key].name;
    }      
    return items;
  }

  loadRune(){
    var runes = {};
    var json = JSON.parse(JSON.stringify(require("./static/runesReforged.json"))); 
    json.forEach(d => { 
      d.slots.forEach(s => { 
        s.runes.forEach(r => {
          runes[r.id] = r.key;
        })
      })
    })    
    return runes;
  }

  loadSpells(){
    var json = JSON.parse(JSON.stringify(require("./static/summoner.json").data)); 
    var spells = {};
    for (const key of Object.keys(json)) {
      spells[json[key].key] = key;
    }      
    return spells;
  }

  handleInput(e) {
    this.setState({name: e.target.value});
  }

  getAccountId(e) {
    this.setState({matches: []});
    var self = this;
    axios({
      method:'get',
      header:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      url:formUrl(summonerApi.byName, self.state.name)
    })
      .then(function(response) {
        self.getMatchList(response.data.accountId)
    });
    e.preventDefault();
  }

  getMatchList(accountId) {
    var self = this;
    axios({
      method:'get',
      url:formUrl(matchApi.byAccountId, accountId)
    })
      .then(function(response) {
        self.matchRow(accountId, response.data.matches.slice(0, 10))
    });
  }

  getMatchDetails(accountId, id){
    var self = this;
    axios({
      method:'get',
      url:formUrl(matchApi.byMatchId, id)
    })
      .then(function(response) {
        var pid = self.getParticipantId(accountId, response.data.participantIdentities);
        var participant = response.data.participants[pid-1];        
        var details = {
          matchId: id,
          duration: response.data.gameDuration,
          outcome: self.getMatchOutcome(participant.teamId, response.data),
          summoner : self.state.name,
          accountId : accountId,
          championName : self.champions[participant.championId],
          items: self.getItems(participant.stats),
          runes: self.getRunes(participant.stats),
          spells: [self.spells[participant.spell1Id], self.spells[participant.spell2Id]],
          kDA : (participant.stats.kills + participant.stats.assists)/participant.stats.deaths,
          cs: participant.stats.totalMinionsKilled,
          cspm : participant.stats.totalMinionsKilled/response.data.gameDuration*60,
          level : participant.stats.champLevel
        };
       let moreMatches = [...self.state.matches];
       moreMatches.push(details);
       self.setState({ matches: moreMatches });
    });
  }

  matchRow(accountId, data){
    for (var d of data){
      this.getMatchDetails(accountId, d.gameId);
    }    
  }

  getParticipantId(accountId, data){
    for (var d of data){
      if (d.player.accountId === accountId) 
        return d.participantId;
    }
  }

  getMatchOutcome(teamId, data){
    for (var t of data.teams){
      if (t.teamId === teamId) return t.win;
    }
  }

  getItems(data){
    return [
      this.items[data.item0],
      this.items[data.item1],
      this.items[data.item2],
      this.items[data.item3],
      this.items[data.item4],
      this.items[data.item5],
      this.items[data.item6],
    ]          
  }

  getRunes(data){
    return [
      this.runes[data.perk0],
      this.runes[data.perk1],
      this.runes[data.perk2],
      this.runes[data.perk3],
      this.runes[data.perk4],
      this.runes[data.perk5]
    ]
  }

  getSpells(ids){

  }

  createTable(){
    return (<Table>
      <TableHead>
        <TableRow>
          <TableCell>Outcome</TableCell>
          <TableCell align="right">Summoner Name</TableCell>
          <TableCell align="right">Champion</TableCell>
          <TableCell align="right">Duration</TableCell>
          <TableCell align="right">Items</TableCell>
          <TableCell align="right">Runes</TableCell>
          <TableCell align="right">Summoner Spells</TableCell>
          <TableCell align="right">KDA</TableCell>
          <TableCell align="right">CS</TableCell>
          <TableCell align="right">CS Per Min</TableCell>
          <TableCell align="right">Level</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {this.state.matches.map(function(value) {
          return <TableRow>
              <TableCell>{value.outcome}</TableCell>
              <TableCell align="right">{value.summoner}</TableCell>
              <TableCell align="right">{value.championName}</TableCell>
              <TableCell align="right">{value.duration} seconds</TableCell>
              <TableCell align="right">{value.items.join(' | ')}</TableCell>
              <TableCell align="right">{value.runes.join(' | ')}</TableCell>
              <TableCell align="right">{value.spells.join(', ')}</TableCell>
              <TableCell align="right">{Math.round(value.kDA*100)/100}</TableCell>
              <TableCell align="right">{value.cs}</TableCell>
              <TableCell align="right">{Math.round(value.cspm*100)/100}</TableCell>
              <TableCell align="right">{value.level}</TableCell>
            </TableRow>
        })}
      </TableBody>
    </Table>);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            League Stats
        </header>
          <div>
            <input
              type="text"
              title="Full Name"
              name="name"
              value={this.state.name}
              placeholder="Enter your name"
              onChange={this.handleInput}
            />
            <button onClick={this.getAccountId}>Click!</button>
          </div>    
          {this.createTable()}      
      </div>   
    );
  }
}

export default App;
