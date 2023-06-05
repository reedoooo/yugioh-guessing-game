'use strict';

const { expect } = require('chai');
// let eventEmitter = require('../eventPool');
const PlayerQueue = require('../lib/playerqueue');

jest.mock('../eventPool.js', () => {
  return {
    on: jest.fn(),
    emit: jest.fn(),
  };
});

console.log = jest.fn();

describe('Testing Functions', () => {
  test('proof of life', () => {
    expect(true).equal(true);
  });

  test('add function', () => {
    const playerQueue = new PlayerQueue();

    let player = {
      name: 'spot',
    };
    expect(playerQueue.addPlayer(player)).equal(player);
  });

  test('read function', () => {
    const playerQueue = new PlayerQueue();

    let player = {
      name: 'spot',
    };
    playerQueue.addPlayer(player);
    expect(playerQueue.read(player.id)).equal(player);
  });

  test('delete function', () => {
    const playerQueue = new PlayerQueue();

    let redPlayer = {
      name: 'red',
    };
    let bluePlayer = {
      name: 'blue',
    };
    playerQueue.addPlayer(redPlayer);
    playerQueue.addPlayer(bluePlayer);
    playerQueue.removePlayer(redPlayer.id);

    expect(playerQueue.players[0]).equal(bluePlayer);
  });
});
