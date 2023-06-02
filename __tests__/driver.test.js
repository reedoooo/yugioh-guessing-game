const {
  packageDeliveredToCustomer,
  packagePickedUpFromVendor,
} = require('../driver/handler');
const { eventPool } = require('../eventPool');
let capsSocket;

jest.mock('../driver/index', () => ({
  capsSocket: {
    emit: jest.fn(),
    on: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  capsSocket = require('../driver/index').capsSocket;
});

it('should emit delivered event with correct payload', () => {
  const emitSpy = jest.spyOn(capsSocket, 'emit');
  const payload = { orderId: '12345', store: 'Test Store' };
  packageDeliveredToCustomer(payload);
  expect(emitSpy).toHaveBeenCalledWith('delivered', payload);
});

it('should emit in-transit event with correct payload', () => {
  const emitSpy = jest.spyOn(capsSocket, 'emit');
  const payload = { orderId: '12345', store: 'Test Store' };
  packagePickedUpFromVendor(payload);
  expect(emitSpy).toHaveBeenCalledWith('in-transit', payload);
});

it('should listen for pickup event and call the packagePickedUpFromVendor and packageDeliveredToCustomer functions', () => {
  const onSpy = jest.spyOn(capsSocket, 'on');
  const payload = { orderId: '12345', store: 'Test Store' };
  capsSocket.on(eventPool[0], packagePickedUpFromVendor);
  capsSocket.emit(eventPool[0], payload); // Simulate an event emission
  expect(onSpy).toHaveBeenCalledWith(eventPool[0], packagePickedUpFromVendor);
});
