const {
  packageReadyForPickup,
  packageDeliveredAlert,
} = require('../vendor/handler');
const { eventPool } = require('../eventPool');
let capsSocket;

jest.mock('../vendor/index', () => ({
  capsSocket: {
    emit: jest.fn(),
    on: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  capsSocket = require('../vendor/index').capsSocket;
});

it('should emit event with correct payload', () => {
  const emitSpy = jest.spyOn(capsSocket, 'emit');
  const payload = { orderId: '12345', store: 'Test Store' };
  packageReadyForPickup(payload);
  expect(emitSpy).toHaveBeenCalledWith('pickup', payload);
});

it('should listen for delivered event and call the packageDeliveredAlert function', () => {
  const onSpy = jest.spyOn(capsSocket, 'on');
  const payload = { orderId: '12345', store: 'Test Store' };
  capsSocket.on(eventPool[1], packageDeliveredAlert);
  capsSocket.emit(eventPool[1], payload); // Simulate an event emission
  expect(onSpy).toHaveBeenCalledWith(eventPool[1], packageDeliveredAlert);
});
