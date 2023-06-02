'use strict';

class PlayerQueue {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    player.id = this.players.length + 1;
    this.players.push(player);
    return player;
  }

  read(turnId) {
    this.players.forEach(player => {
      if (player.id === turnId) {
        return true;
      }
    });
  }
}
module.exports = PlayerQueue;
