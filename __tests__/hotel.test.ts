import { submitOrder } from '../src/services/hotel';
import { Order } from '../src/types';
const order: Order = {
  id: 'order-id',
  room: 'A-12',
  createdAt: '2026-09-24',
  items: [{ id: 'ClassicMojito', quantity: 2 }],
  total: 24,
  status: 'saved',
};
const settings = {
  apiUrl: 'https://hotel.example/api',
  phone: '',
  latitude: '',
  longitude: '',
};
it('requires explicit confirmation and reuses an idempotency key on retry', async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'pending' }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'confirmed', id: 'hotel-id' }),
    });
  globalThis.fetch = fetchMock;
  await expect(submitOrder(settings, order, null)).rejects.toThrow(
    'No confirmation',
  );
  await expect(submitOrder(settings, order, null)).resolves.toBe('hotel-id');
  expect(fetchMock.mock.calls[0][1].headers['Idempotency-Key']).toBe(
    'order-id',
  );
  expect(fetchMock.mock.calls[1][1].headers['Idempotency-Key']).toBe(
    'order-id',
  );
});
it('does not send orders without a configured hotel service', async () => {
  globalThis.fetch = jest.fn();
  await expect(
    submitOrder({ ...settings, apiUrl: '' }, order, null),
  ).rejects.toThrow('service URL');
  expect(globalThis.fetch).not.toHaveBeenCalled();
});
