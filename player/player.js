'use strict';

require('dotenv').config();
const colors = require('colors');
const prompt = require('prompt-sync')();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL;
const eventPool = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const socket = io(SERVER_URL);

let player = {
  name: chance.animal(),
  id: 2,
  score: 0,
};

socket.on(eventPool.eventPool.PLAYER_TURN, payload => {
  if (payload.previousPlayer) {
    console.log(
      `${payload.previousPlayer} guessed '${payload.guessLetter}'`.cyan,
    );
  }

  console.log(payload.revealedWord.join('').cyan);

  if (payload.turnId === player.id) {
    console.log('YOUR TURN!'.green);
    const guessLetter = prompt('Guess a letter: '.yellow);
    socket.emit(eventPool.eventPool.PLAYER_GUESS, guessLetter);
  }
});

socket.on(eventPool.eventPool.PLAYER_SCORE, payload => {
  console.log(payload.revealedWord.join('').cyan);
  player.score += payload.addedScore;
  console.log(`Player earned ${payload.addedScore} points!`.green);
  console.log(`You have ${player.score} points in total!`.green);
  // console.log('Waiting for other player\'s turn...'.yellow);
});

socket.on(eventPool.eventPool.PLAYER_LEAVE, removedPlayerId => {
  if (removedPlayerId === player.id) {
    console.log('You have been removed from the game.');
    player = null;
  } else {
    console.log(`Player ${removedPlayerId} has been removed from the game.`);
  }
});

socket.on(eventPool.eventPool.UPDATE_PLAYER, updatedPlayer => {
  if (updatedPlayer.id === player.id) {
    player = updatedPlayer;
  }
});

socket.on(eventPool.eventPool.PLAYER_JOIN, player => {
  console.log(`Player ${player.id} HAS JOINED THE GAME`.magenta);
});

socket.on(eventPool.eventPool.PLAYER_GUESS, message => {
  console.log(message);
});

const username = prompt('Choose a username: '.yellow);
if (username !== '') {
  player.name = username;
}
// Emit the PLAYER_JOIN event after setting up all event listeners
socket.emit(eventPool.eventPool.PLAYER_JOIN, player);

const shouldLeaveGame = prompt(
  'Would you like to leave the game? (Y/N): '.yellow,
);
if (shouldLeaveGame.toUpperCase() === 'Y') {
  socket.emit(eventPool.eventPool.PLAYER_LEAVE, player.id);
  console.log('You have left the game.');
}
