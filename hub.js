'use strict';

require('dotenv').config();
const colors = require('colors');

// const { Server } = require('socket.io');
const PlayerQueue = require('./lib/playerqueue');
const { eventPool } = require('./eventPool');

// const io = new Server(parseInt(process.env.PORT), {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

const playerQueue = new PlayerQueue();

const wordPool = [
  'darkmagician',
  'blueeyes',
  'busterblader',
  'kuriboh',
  'exodia',
  'slifer',
  'obelisk',
  'ra',
  'summonedskull',
  'wingedkuriboh',
];

let secretWord = wordPool[Math.floor(Math.random() * wordPool.length)];
let revealedWord = Array(secretWord.length).fill('_');
let turnId = 1;

console.log(secretWord);

io.on('connection', socket => {
  console.log('CLIENT CONNECTED TO SERVER: '.green + socket.id.yellow);
  console.log('Listening for PLAYER_JOIN event');

  socket.on(eventPool.PLAYER_JOIN, player => {
    console.log('Received PLAYER_JOIN event:', player);

    const updatedPlayer = { ...player, score: 0 }; // Initialize score property to 0
    const addedPlayer = playerQueue.addPlayer(updatedPlayer);
    socket.emit(eventPool.UPDATE_PLAYER, addedPlayer);
    console.log('Sent UPDATE_PLAYER event:', addedPlayer);

    socket.join('gameRoom');
    console.log(`Player ${player.name} joined the game`);

    io.emit(eventPool.PLAYER_JOIN, playerQueue.players);

    const clientsInRoom = socket.adapter.rooms.get('gameRoom');

    if (clientsInRoom.size >= 2) {
      const payload = {
        turnId: turnId,
        revealedWord: revealedWord,
      };

      socket.to('gameRoom').emit(eventPool.GAME_START, payload);
    }
  });

  socket.on(eventPool.PLAYER_LEAVE, playerId => {
    console.log('Received PLAYER_LEAVE event:', playerId);

    playerQueue.removePlayer(playerId);
    console.log(`Player with id ${playerId} left the game`);

    io.emit(eventPool.PLAYER_LEAVE, playerQueue.players);
  });

  // Handle the 'PLAYER_GUESS' event when a player makes a letter guess
  socket.on(eventPool.PLAYER_GUESS, guessLetter => {
    // Initialize the addedScore variable to keep track of the score increase
    let addedScore = 0;

    // Iterate over the secret word to check for matches with the guessed letter
    for (let idx = 0; idx < secretWord.length; idx++) {
      if (
        guessLetter.toLowerCase() === secretWord[idx].toLowerCase() &&
        revealedWord[idx] === '_'
      ) {
        // If there is a match and the letter is not yet revealed, update the revealed word
        revealedWord[idx] = secretWord[idx];

        // Increase the score of the current player if it exists
        if (playerQueue.players[turnId - 1]) {
          playerQueue.players[turnId - 1].score++;
          socket.emit(eventPool.UPDATE_PLAYER, playerQueue.players[turnId - 1]);
        }

        // Increase the addedScore count
        addedScore++;
      }
    }

    // Prepare the payload for the 'PLAYER_SCORE' event
    const payload = {
      addedScore: addedScore,
      revealedWord: revealedWord,
    };

    // If the addedScore is greater than 0, emit the 'PLAYER_SCORE' event to all sockets in the 'gameRoom'
    if (addedScore > 0) {
      io.to('gameRoom').emit(eventPool.PLAYER_SCORE, payload);
    }

    // Check if the guessed letter does not match any letter in the secret word
    const noLetterMatch = !secretWord
      .toLowerCase()
      .includes(guessLetter.toLowerCase());

    // If there is no match, emit the 'PLAYER_GUESS' event to the current socket with a message
    if (noLetterMatch) {
      socket.emit(
        eventPool.PLAYER_GUESS,
        `No ${guessLetter}'s!`.red +
          `\nWaiting for other player's turn...`.yellow,
      );
    }

    // Check if the game is over (all letters of the secret word are revealed)
    const isGameOver = revealedWord.every(letter => letter !== '_');

    if (isGameOver) {
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

      const winnerNames = winners.map(winner => winner.name).join(', ');

      io.to('gameRoom').emit(
        eventPool.PLAYER_GUESS,
        `GAME OVER!! Winners are ${winnerNames} with ${highscore} points!`
          .green,
      );

      // Emit GAME_OVER event
      const gameOverPayload = {
        winners: winnerNames,
        highscore: highscore,
      };

      console.log('Emitting GAME_OVER event');
      io.to('gameRoom').emit(eventPool.GAME_OVER, gameOverPayload);

      return;
    }

    // Increment the turn ID for the next player's turn
    turnId++;

    // If the turn ID exceeds the number of players, reset it to 1
    if (turnId > playerQueue.players.length) {
      turnId = 1;
    }

    // Log whose turn it is
    if (playerQueue.players[turnId - 1]) {
      console.log(`Now it's ${playerQueue.players[turnId - 1].name}'s turn`);
    } else {
      console.log("Player's turn not available");
    }

    // Prepare the payload for the 'PLAYER_TURN' event
    const previousPlayer =
      playerQueue.players[turnId - 2] && playerQueue.players[turnId - 2].name
        ? playerQueue.players[turnId - 2].name
        : playerQueue.players[0] && playerQueue.players[0].name;

    const playerTurnPayload = {
      revealedWord: revealedWord,
      guessLetter: guessLetter,
      previousPlayer: previousPlayer,
      turnId: turnId,
    };

    // Send the 'PLAYER_TURN' event to all sockets in the 'gameRoom' except the current socket
    socket.to('gameRoom').emit(eventPool.PLAYER_TURN, playerTurnPayload);
  });

  socket.on(eventPool.START_NEW_GAME, () => {
    console.log('Received START_NEW_GAME event');

    // Generate a new secret word
    const newSecretWord = wordPool[Math.floor(Math.random() * wordPool.length)];

    // Update the secretWord variable
    secretWord = newSecretWord;

    // Reset game state
    revealedWord.length = secretWord.length;
    revealedWord.fill('_');
    turnId = 1;

    // Clear scores of all players
    playerQueue.players.forEach(player => {
      player.score = 0;
      socket.emit(eventPool.UPDATE_PLAYER, player);
    });

    // Emit event to start a new game
    const payload = {
      turnId: turnId,
      revealedWord: revealedWord,
    };
    console.log('newSecretWord: ', newSecretWord);

    io.to('gameRoom').emit(eventPool.GAME_START, payload);
  });

  // Handle the 'disconnect' event when a client disconnects from the server
  socket.on('disconnect', () => {
    // Print a message indicating that a client has disconnected, with the socket ID
    console.log('CLIENT DISCONNECTED FROM SERVER: '.red + socket.id.yellow);
  });
});

// Print a message indicating that the server is running
console.log(`Server is running... on ${process.env.PORT}`);
