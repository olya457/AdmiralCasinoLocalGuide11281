import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from '../types';
import { menu } from '../data/menu';
const key = '@admiral/guest/v1';
export const initialData: AppData = {
  onboarded: false,
  dnd: false,
  booking: null,
  cart: {},
  orders: [],
  settings: { phone: '', latitude: '', longitude: '', apiUrl: '' },
  room: {
    temperature: 22,
    fan: 2,
    mode: 'Cooling',
    brightness: 70,
    warmth: 'Warm',
    color: '#ffdc96',
    main: true,
    bedside: true,
    bathroom: false,
  },
};
type Store = {
  data: AppData;
  ready: boolean;
  error: string | null;
  update: (change: Partial<AppData> | ((current: AppData) => AppData)) => void;
  quantity: (id: string, delta: number) => void;
  retry: () => void;
};
const Context = createContext<Store | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef(Promise.resolve());
  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw);
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
          throw new Error('Invalid saved data');
        }
        const cart = Object.fromEntries(
          Object.entries(saved.cart || {}).filter(
            ([id, count]) =>
              menu.some(item => item.id === id) &&
              Number.isInteger(count) &&
              Number(count) > 0 &&
              Number(count) <= 99,
          ),
        );
        setData({
          ...initialData,
          ...saved,
          cart,
          settings: { ...initialData.settings, ...saved.settings },
          room: { ...initialData.room, ...saved.room },
          orders: Array.isArray(saved.orders) ? saved.orders : [],
        });
      }
      setReady(true);
      setError(null);
    } catch {
      setError('Your saved data could not be loaded. Please retry.');
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (!ready) {
      return;
    }
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(data));
          setError(null);
        } catch {
          setError('Changes could not be saved on this device. Please retry.');
        }
      });
  }, [data, ready]);
  const update: Store['update'] = useCallback(
    change =>
      setData(current =>
        typeof change === 'function'
          ? change(current)
          : { ...current, ...change },
      ),
    [],
  );
  const quantity = useCallback(
    (id: string, delta: number) =>
      update(current => {
        const cart = { ...current.cart };
        const count = Math.min(99, Math.max(0, (cart[id] || 0) + delta));
        if (count) {
          cart[id] = count;
        } else {
          delete cart[id];
        }
        return { ...current, cart };
      }),
    [update],
  );
  return (
    <Context.Provider
      value={{
        data,
        ready,
        error,
        update,
        quantity,
        retry: () => (ready ? setData(current => ({ ...current })) : load()),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const store = useContext(Context);
  if (!store) {
    throw new Error('Missing AppProvider');
  }
  return store;
}
