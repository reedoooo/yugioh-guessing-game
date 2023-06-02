'use strict';

const { eventEmitter, eventPool } = require('../eventPool');
const Chance = require('chance');
const chance = new Chance();

const storeName = chance.company();

const packageReadyForPickup = () => {
  return {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address(),
  };
};

const packageDeliveredAlert = (payload) => {
  console.log(
    `Thank you ${payload.customer} for shopping with ${payload.store}`,
  );
};

// packageReadyForPickup(chance.company());

module.exports = {
  packageReadyForPickup,
  packageDeliveredAlert,
};
