import { Booking, Settings } from '../types';
export const validRoom = (room: string) =>
  /^[A-Za-z0-9][A-Za-z0-9 -]{0,15}$/.test(room.trim());
export function hotelCoordinates(settings: Settings) {
  if (!settings.latitude.trim() || !settings.longitude.trim()) {
    return null;
  }
  const latitude = Number(settings.latitude);
  const longitude = Number(settings.longitude);
  return Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
    ? { latitude, longitude }
    : null;
}
export function parseBooking(value: string): Booking {
  let raw: unknown;
  try {
    raw = JSON.parse(value);
  } catch {
    throw new Error(
      'This QR code is not a booking. Ask reception for a booking QR, or enter your room manually.',
    );
  }
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid booking code.');
  }
  const data = raw as Record<string, unknown>;
  const room = typeof data.room === 'number' ? String(data.room) : data.room;
  if (typeof room !== 'string' || !validRoom(room)) {
    throw new Error('The booking QR must contain a valid room number.');
  }
  const optional = (key: string) =>
    typeof data[key] === 'string' ? String(data[key]).slice(0, 200) : undefined;
  return {
    room: room.trim(),
    guest: optional('guest'),
    code: optional('code'),
    checkIn: optional('checkIn'),
    checkOut: optional('checkOut'),
    verified: false,
  };
}
export const money = (value: number) => `$${value.toFixed(2)}`;
