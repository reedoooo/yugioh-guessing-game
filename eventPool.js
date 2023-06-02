'use strict';

const Events = require('events');
const eventEmitter = new Events();

const eventPool = ['pickup', 'transit', 'delivered'];

module.exports = {
  eventPool,
  eventEmitter,
};
