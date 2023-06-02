'use strict';

// Load environment variables from .env file
require('dotenv').config();

// Import chalk for styling console output
const chalk = require('chalk');

// Import necessary modules
const { Server } = require('socket.io');
const io = new Server(process.env.PORT);
const PlayerQueue = require('./lib/playerqueue');
const eventPool = require('./eventPool');

// Create a player queue and word pool for the game
let playerQueue = new PlayerQueue();
let wordPool = [
  'dark magician',
  'blue eyes',
  'buster blader',
  'kuriboh',
  'exodia',
  'slifer',
  'obelisk',
  'ra',
  'summoned skull',
  'winged kuriboh',
];

// Randomly select a secret word from the word pool
let secretWord = wordPool[Math.round(Math.random() * (wordPool.length - 1))];

// Create an array to represent the revealed word with underscores
let revealedWord = Array(secretWord.length).fill('_');

// Initialize the turn ID to 1
let turnId = 1;

// Log the secret word to the console (for debugging purposes)
console.log(secretWord);

// Event listener for client connections
io.on('connection', socket => {
  console.log('CLIENT CONNECTED TO SERVER: ', socket.id);

  // Event handler for the 'PLAYER_JOIN' event
  socket.on(eventPool.eventPool.PLAYER_JOIN, player => {
    // Add the player to the queue and get the updated player object
    let updatedPlayer = playerQueue.addPlayer(player);

    // Emit the updated player object to the joining player
    io.to(socket.id).emit(eventPool.eventPool.UPDATE_PLAYER, updatedPlayer);

    // Join the 'gameRoom' and log the player's name
    socket.join('gameRoom');
    console.log(`${player.name} HAS JOINED THE GAME ROOM`);

    // Emit the 'PLAYER_JOIN' event to the joining player
    socket.emit(eventPool.eventPool.PLAYER_JOIN, player);

    // Check the number of clients in the room
    const clientsInRoom = socket.adapter.rooms.get('gameRoom');
    if (clientsInRoom.size >= 2) {
      // Prepare the payload for the game start event
      let payload = {
        turnId: turnId,
        revealedWord: revealedWord,
      };

      // Emit the 'GAME_START' event to all players in the room except the joining player
      socket.to('gameRoom').emit(eventPool.eventPool.GAME_START, payload);
    }
  });

  // Event handler for the 'PLAYER_GUESS' event
  socket.on(eventPool.eventPool.PLAYER_GUESS, guessLetter => {
    let addedScore = 0;

    // Iterate over the secret word to check for matches with the guessed letter
    for (let idx = 0; idx < secretWord.length; idx++) {
      if (guessLetter.toLowerCase() === secretWord[idx].toLowerCase()) {
        // Update the revealed word and increase the player's score
        revealedWord[idx] = secretWord[idx];
        playerQueue.players[turnId - 1].score++;
        addedScore++;
      }
    }

    // Prepare the payload for the 'PLAYER_SCORE' event
    let payload = {
      addedScore: addedScore,
      revealedWord: revealedWord,
    };

    if (addedScore > 0) {
      // Emit the 'PLAYER_SCORE' event to the guessing player if they earned points
      socket.emit(eventPool.eventPool.PLAYER_SCORE, payload);
    }

    // Check if the guessed letter does not match any letters in the secret word
    let noLetterMatch = !secretWord.some(
      letter => letter.toLowerCase() === guessLetter.toLowerCase(),
    );

    if (noLetterMatch) {
      // Emit a message to the guessing player if there was no match
      socket.emit(
        eventPool.eventPool.PLAYER_GUESS,
        chalk.red(`No ${guessLetter}'s!`) +
          `\nWaiting for other player's turn...`,
      );
    }

    // Check if the game is over (all letters have been revealed)
    let isGameOver = revealedWord.every(letter => letter !== '_');

    if (isGameOver) {
      // Determine the highscore and the winners of the game
      let highscore = 0;
      let winners = [];

      playerQueue.players.forEach(player => {
        if (player.score > highscore) {
          highscore = player.score;
          winners = [player];
        } else if (player.score === highscore) {
          winners.push(player);
        }
      });

      // Create a comma-separated string of winner names
      let winnerNames = winners.map(winner => winner.name).join(', ');

      // Emit the game over message to the guessing player
      socket.emit(
        eventPool.eventPool.PLAYER_GUESS,
        `GAME OVER!! Winners are ${winnerNames} with ${highscore} points!`,
      );

      // Broadcast the game over message to all players in the room
      socket
        .to(`gameRoom`)
        .emit(
          eventPool.eventPool.PLAYER_GUESS,
          `GAME OVER!! Winners are ${winnerNames} with ${highscore} points!`,
        );
      return;
    }

    // Update the turn ID for the next player's turn
    turnId++;
    if (turnId > playerQueue.players.length) {
      turnId = 1;
    }

    // Prepare the payload for the 'PLAYER_TURN' event
    payload = {
      revealedWord: revealedWord,
      guessLetter: guessLetter,
      previousPlayer: playerQueue.players[turnId - 1].name,
      turnId: turnId,
    };

    // Emit the 'PLAYER_TURN' event to all players in the room except the guessing player
    socket.to('gameRoom').emit(eventPool.eventPool.PLAYER_TURN, payload);
  });
});
