import { Linking, Platform } from 'react-native';
import { Booking, Order, Room, Settings } from '../types';
import { hotelCoordinates } from '../utils/validation';
async function request(
  settings: Settings,
  path: string,
  body: unknown,
  requestId?: string,
) {
  if (!/^https:\/\/[^\s]+$/.test(settings.apiUrl)) {
    throw new Error('Add your hotel service URL in Connection settings first.');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(
      `${settings.apiUrl.replace(/\/$/, '')}${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(requestId ? { 'Idempotency-Key': requestId } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      throw new Error(
        'The hotel could not accept this request. Please try again or contact reception.',
      );
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
export async function submitOrder(
  settings: Settings,
  order: Order,
  booking: Booking | null,
) {
  const result = await request(
    settings,
    '/orders',
    { order, bookingCode: booking?.code },
    order.id,
  );
  if (result.status !== 'confirmed' || typeof result.id !== 'string') {
    throw new Error(
      'No confirmation received. Your order remains saved. Contact reception before retrying.',
    );
  }
  return result.id as string;
}
export async function syncRoom(
  settings: Settings,
  room: Room,
  booking: Booking | null,
  dnd: boolean,
) {
  if (!booking) {
    throw new Error('Enter your room number first.');
  }
  const result = await request(settings, '/room-controls', {
    roomNumber: booking.room,
    bookingCode: booking.code,
    controls: room,
    doNotDisturb: dnd,
  });
  if (result.status !== 'applied') {
    throw new Error('The hotel has not confirmed these settings.');
  }
}
export async function verifyBooking(
  settings: Settings,
  booking: Booking,
): Promise<Booking> {
  const result = await request(settings, '/bookings/verify', {
    room: booking.room,
    code: booking.code,
  });
  if (result.valid !== true) {
    throw new Error('Reception could not verify this booking.');
  }
  return { ...booking, verified: true };
}
export async function directions(
  settings: Settings,
  destination?: { latitude: number; longitude: number },
) {
  const hotel = hotelCoordinates(settings);
  if (!hotel) {
    throw new Error(
      'Add the hotel coordinates in Connection settings to build a route.',
    );
  }
  const end = destination || hotel;
  const origin = destination ? `${hotel.latitude},${hotel.longitude}` : '';
  const target = `${end.latitude},${end.longitude}`;
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?${
          origin ? `saddr=${origin}&` : ''
        }daddr=${target}`
      : `https://www.google.com/maps/dir/?api=1&${
          origin ? `origin=${origin}&` : ''
        }destination=${target}`;
  await Linking.openURL(url);
}
export async function callConcierge(phone: string) {
  const cleaned = phone.replace(/[\s()-]/g, '');
  if (!/^\+?[0-9]{3,15}$/.test(cleaned)) {
    throw new Error(
      'Add the concierge phone number in Connection settings first.',
    );
  }
  await Linking.openURL(`tel:${cleaned}`);
}
