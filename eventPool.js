'use strict';

const Events = require('events');
const eventEmitter = new Events();

const eventPool = {
  PLAYER_JOIN: 'playerJoin',
  GAME_START: 'gameStart',
  UPDATE_PLAYER: 'updatePlayer',
  PLAYER_GUESS: 'playerGuess',
  PLAYER_SCORE: 'playerScore',
  NEW_CARD: 'newCard',
  PLAYER_TURN: 'playerTurn',
};

module.exports = {
  eventPool,
  eventEmitter,
};
