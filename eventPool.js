'use strict';

const Events = require('events');
const eventEmitter = new Events();

const eventPool = {
  PLAYER_JOIN: 'playerJoin',
  GAME_START: 'gameStart',
  UPDATE_PLAYER: 'updatePlayer',
  PLAYER_GUESS: 'playerGuess',
  PLAYER_SCORE: 'playerScore',
  PLAYER_TURN: 'playerTurn',
  GAME_OVER: 'gameOver',
  PLAYER_LEAVE: 'playerLeave',
  START_NEW_GAME: 'startNewGame',
};

module.exports = {
  eventPool,
  eventEmitter,
};
