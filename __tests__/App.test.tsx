import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from '../src/state/AppProvider';
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
  },
}));
let state: ReturnType<typeof useApp>;
function Probe() {
  state = useApp();
  return null;
}
beforeEach(() => jest.clearAllMocks());
it('starts without invented personal data and restores cart and preferences', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
  expect(state.ready).toBe(true);
  expect(state.data.booking).toBeNull();
  expect(state.data.orders).toEqual([]);
  await act(async () => {
    state.quantity('ClassicMojito', 1);
    state.update({ dnd: true });
  });
  expect(state.data.cart.ClassicMojito).toBe(1);
  const saved = JSON.stringify(state.data);
  expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(
    '@admiral/guest/v1',
    saved,
  );
  await act(async () => tree!.unmount());
  (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(saved);
  await act(async () => {
    tree = ReactTestRenderer.create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
  expect(state.data.cart.ClassicMojito).toBe(1);
  expect(state.data.dnd).toBe(true);
  await act(async () => state.quantity('ClassicMojito', -1));
  expect(state.data.cart).toEqual({});
  await act(async () => tree!.unmount());
});
it('does not overwrite data when storage cannot be read', async () => {
  (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
    new Error('storage unavailable'),
  );
  let tree: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    tree = ReactTestRenderer.create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
  expect(state.ready).toBe(false);
  expect(state.error).toBeTruthy();
  expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  await act(async () => tree!.unmount());
});
