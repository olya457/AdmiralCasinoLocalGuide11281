import { ImageSourcePropType } from 'react-native';
export type Category = 'Regular' | 'Vegetarian' | 'Vegan';
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  ingredients: string;
  minutes: number;
  category: Category;
  kind: 'Dishes' | 'Drinks';
  image: ImageSourcePropType;
};
export type Place = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  short: string;
  paragraphs: string[];
  hours?: string;
  coordinates?: { latitude: number; longitude: number };
  marker?: { x: number; y: number };
  offer?: { title: string; text: string };
};
export type Booking = {
  room: string;
  guest?: string;
  code?: string;
  checkIn?: string;
  checkOut?: string;
  verified?: boolean;
};
export type Room = {
  temperature: number;
  fan: number;
  mode: 'Cooling' | 'Heating' | 'Auto' | 'Sleep';
  brightness: number;
  warmth: 'Warm' | 'Neutral' | 'Cool';
  color: string;
  main: boolean;
  bedside: boolean;
  bathroom: boolean;
};
export type Settings = {
  phone: string;
  latitude: string;
  longitude: string;
  apiUrl: string;
};
export type Order = {
  id: string;
  createdAt: string;
  items: { id: string; quantity: number }[];
  total: number;
  room: string;
  status: 'saved' | 'confirmed';
  reference?: string;
};
export type AppData = {
  onboarded: boolean;
  dnd: boolean;
  booking: Booking | null;
  cart: Record<string, number>;
  room: Room;
  settings: Settings;
  orders: Order[];
};
export type RootStackParams = {
  Main: undefined;
  Details: { id: string; kind: 'venue' | 'nearby' };
  Scanner: undefined;
  Settings: undefined;
  Orders: undefined;
};
