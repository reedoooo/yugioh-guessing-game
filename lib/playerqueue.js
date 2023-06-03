const { v4: uuidv4 } = require('uuid');

class PlayerQueue {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    player.id = uuidv4();
    this.players.push(player);
    return player;
  }

  removePlayer(playerId) {
    this.players = this.players.filter(player => player.id !== playerId);
  }

  read(turnId) {
    return this.players.find(player => player.id === turnId);
  }
}

module.exports = PlayerQueue;
