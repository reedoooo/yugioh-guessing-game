'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const { eventEmitter, eventPool } = require('../eventPool');

const capsSocket = io(SERVER_URL + '/caps');

const packageDeliveredToCustomer = (payload) => {
  console.log(`DRIVER: Successfully delivered package #${payload.orderId}`);

  capsSocket.emit(eventPool[2], payload);
  // eventEmitter.emit(eventPool[2], payload)
};

const packagePickedUpFromVendor = (payload) => {
  console.log(
    `DRIVER: Package #${payload.orderId} picked up from ${payload.store}`,
  );

  capsSocket.emit(eventPool[1], payload);
  // eventEmitter.emit(eventPool[1], payload)
};

module.exports = {
  packageDeliveredToCustomer,
  packagePickedUpFromVendor,
  capsSocket,
};
