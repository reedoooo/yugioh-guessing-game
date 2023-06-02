'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';

const { eventEmitter, eventPool } = require('../eventPool');
const { packageReadyForPickup, packageDeliveredAlert } = require('./handler');

const capsSocket = io(SERVER_URL + '/caps');

capsSocket.on(eventPool[2], packageDeliveredAlert);

// capsSocket.emit(eventPool[0], packageReadyForPickup())

const placeOrder = () => {
  let payload = packageReadyForPickup();
  capsSocket.emit('join', payload);
  console.log('Vendor package ready for pickup');
  capsSocket.emit(eventPool[0], payload);
};

setInterval(placeOrder, 12000);

// eventEmitter.on(eventPool[2], packageDeliveredAlert);

// eventEmitter.emit(eventPool[0], packageReadyForPickup())
