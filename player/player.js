'use strict';

require('dotenv').config();

const chalk = require('chalk');

const prompt = require('prompt-sync')();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL;
const eventPool = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const socket = io(SERVER_URL);

let player = {
  name: chance.animal(),
  id: 1,
  score: 0,
};

socket.on(eventPool.eventPool.PLAYER_TURN, payload => {
  if (payload.previousPlayer) {
    console.log(`${payload.previousPlayer} guessed '${payload.guessLetter}'`);
  }

  console.log(payload.revealedWord.join(''));

  if (payload.turnId === player.id) {
    console.log(chalk.green('YOUR TURN!\n'));
    const guessLetter = prompt('Guess a letter: ');
    socket.emit(eventPool.eventPool.PLAYER_GUESS, guessLetter);
  }
});

socket.on(eventPool.eventPool.PLAYER_SCORE, payload => {
  console.log(payload.revealedWord.join(''));
  player.score += payload.addedScore;
  console.log(chalk.green(`Player earned ${payload.addedScore} points!`));
  console.log(`You have ${player.score} points in total!`);
  console.log('Waiting for other player\'s turn...');
});

socket.on(eventPool.eventPool.UPDATE_PLAYER, updatedPlayer => {
  player = updatedPlayer;
});

socket.on(eventPool.eventPool.PLAYER_JOIN, player => {
  console.log(`${player.name} HAS JOINED THE GAME`);
});

socket.on(eventPool.eventPool.PLAYER_GUESS, message => {
  console.log(message);
});

const username = prompt('Choose a username: ');
if (username !== '') {
  player.name = username;
  socket.emit(eventPool.eventPool.PLAYER_JOIN, player);
} else {
  socket.emit(eventPool.eventPool.PLAYER_JOIN, player);
}
