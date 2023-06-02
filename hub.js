'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3001;

const { eventEmitter, eventPool } = require('./eventPool');

const io = new Server(PORT);
const capsServer = io.of('/caps');

const logEvent = eventName => payload => {
  console.log(
    `
    EVENT: {
      event: ${eventName},
      time: ${new Date()},
      payload:`,
    payload,
  );
};

capsServer.on('connection', socket => {
  console.log(`CLIENT CONNECTED TO CAPS SERVER \n SOCKET: `, socket.id);

  socket.on('join', payload => {
    socket.join(payload.store);
  });

  // logs 'PICKUP' event to server console when vendor has package ready for pickup
  socket.on(eventPool[0], logEvent(eventPool[0]));

  // sends a 'PICKUP' alert to the drivers, letting them know that a package is ready for pickup
  socket.on(eventPool[0], payload => {
    console.log('Package ready for pickup; Notifying driver.');

    // capsServer.emit(eventPool[0], payload);
    socket.broadcast.emit(eventPool[0], payload);
  });

  // logs 'IN-TRANSIT' event to server console when driver is en route to delivery address
  socket.on(eventPool[1], logEvent(eventPool[1]));

  // logs 'DELIVERED' event to server console when driver successfully delivers package
  socket.on(eventPool[2], logEvent(eventPool[2]));

  socket.on(eventPool[2], payload => {
    console.log('Notifying vendor that package was delivered.');

    // only sends notification to correct vendor
    socket.to(payload.store).emit(eventPool[2], payload);
  });
});

// eventEmitter.on(eventPool[0], logEvent(eventPool[0]))
// eventEmitter.on(eventPool[1], logEvent(eventPool[1]))
// eventEmitter.on(eventPool[2], logEvent(eventPool[2]))

// require('./driver/index')
// require('./vendor/index')
