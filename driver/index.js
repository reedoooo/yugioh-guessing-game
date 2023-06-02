'use strict';

const { eventEmitter, eventPool } = require('../eventPool');
const {
  packageDeliveredToCustomer,
  packagePickedUpFromVendor,
  capsSocket,
} = require('./handler');

capsSocket.on(eventPool[0], (payload) => {
  console.log(
    'Driver has been notified, en route to pick up package from Vendor.',
  );
  capsSocket.emit('join', payload);
  packagePickedUpFromVendor(payload);
  packageDeliveredToCustomer(payload);
});

// eventEmitter.on(eventPool[0], (payload) => {
//   packagePickedUpFromVendor(payload);
//   packageDeliveredToCustomer(payload);
// });
