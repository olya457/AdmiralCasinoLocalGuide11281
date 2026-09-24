import {
  hotelCoordinates,
  parseBooking,
  validRoom,
} from '../src/utils/validation';
import { menu } from '../src/data/menu';
import { nearby, venues } from '../src/data/places';
it('rejects non-booking QR codes and untrusted verification flags', () => {
  expect(() => parseBooking('https://example.com')).toThrow();
  expect(() => parseBooking('{"guest":"Guest"}')).toThrow();
  expect(parseBooking('{"room":125,"verified":true}')).toEqual({
    room: '125',
    verified: false,
  });
});
it('accepts a booking without fabricating missing guest details', () => {
  expect(parseBooking('{"room":"A-12","code":"reservation-token"}')).toEqual({
    room: 'A-12',
    code: 'reservation-token',
    verified: false,
  });
  expect(validRoom('')).toBe(false);
  expect(validRoom('A-12')).toBe(true);
  expect(validRoom('a'.repeat(17))).toBe(false);
});
it('requires explicit valid hotel coordinates including valid zero coordinates', () => {
  const settings = { phone: '', apiUrl: '', latitude: '', longitude: '' };
  expect(hotelCoordinates(settings)).toBeNull();
  expect(
    hotelCoordinates({ ...settings, latitude: '91', longitude: '19' }),
  ).toBeNull();
  expect(
    hotelCoordinates({ ...settings, latitude: '0', longitude: '0' }),
  ).toEqual({ latitude: 0, longitude: 0 });
});
it('contains all requested menu categories and locations', () => {
  for (const category of ['Regular', 'Vegetarian', 'Vegan']) {
    for (const kind of ['Dishes', 'Drinks']) {
      expect(
        menu.filter(item => item.category === category && item.kind === kind),
      ).toHaveLength(4);
    }
  }
  expect(venues).toHaveLength(8);
  expect(nearby).toHaveLength(8);
  expect(new Set(menu.map(item => item.id)).size).toBe(24);
});
