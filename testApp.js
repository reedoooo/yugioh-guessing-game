// testApplication.js
const VendorClientApplication = require('./vendor/index.js');
const DriverClientApplication = require('./driver/index.js');
const payload = { orderId: '123', customer: 'Test Customer' };

// Initialize clients
new DriverClientApplication();
const vendor = new VendorClientApplication('Test Store');

// Simulate the pickup event
vendor.simulatePickup(payload);
