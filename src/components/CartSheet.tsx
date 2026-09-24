import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../state/AppProvider';
import { menu } from '../data/menu';
import { Order, RootStackParams } from '../types';
import { money, validRoom } from '../utils/validation';
import { submitOrder } from '../services/hotel';
import { Button, Field, Heading, Sheet, Stepper } from './UI';
import { colors, styles } from '../theme';
export function CartSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { data, update, quantity } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [room, setRoom] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<'saved' | 'confirmed' | null>(null);
  const items = menu.filter(item => data.cart[item.id]);
  const total =
    items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * data.cart[item.id],
      0,
    ) / 100;
  const roomNumber = room.trim() || data.booking?.room || '';
  const close = () => {
    if (!busy) {
      setResult(null);
      onClose();
    }
  };
  const place = async () => {
    if (busy || !validRoom(roomNumber) || !items.length) {
      return;
    }
    setBusy(true);
    const order: Order = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        id: item.id,
        quantity: data.cart[item.id],
      })),
      total,
      room: roomNumber,
      status: 'saved',
    };
    const booking =
      data.booking?.room === roomNumber
        ? data.booking
        : {
            room: roomNumber,
          };
    update(current => ({
      ...current,
      orders: [order, ...current.orders],
      cart: {},
      booking,
    }));
    try {
      if (data.settings.apiUrl) {
        const reference = await submitOrder(data.settings, order, booking);
        update(current => ({
          ...current,
          orders: current.orders.map(item =>
            item.id === order.id
              ? {
                  ...item,
                  status: 'confirmed',
                  reference,
                }
              : item,
          ),
        }));
        setResult('confirmed');
      } else {
        setResult('saved');
      }
    } catch (error) {
      setResult('saved');
      Alert.alert(
        'Order not confirmed',
        `${(error as Error).message} Your order is saved in My Orders.`,
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Sheet visible={visible} onClose={close}>
      {result ? (
        <View style={localStyles.result}>
          <Text style={localStyles.resultIcon}>
            {result === 'confirmed' ? '✓' : '◇'}
          </Text>
          <Text style={[styles.title, localStyles.resultTitle]}>
            {result === 'confirmed' ? 'Order Confirmed' : 'Order Saved'}
          </Text>
          <Text style={[styles.muted, localStyles.resultDescription]}>
            {result === 'confirmed'
              ? 'Your hotel has accepted your order.'
              : 'Saved on this device. Connect your hotel service and send it from My Orders.'}
          </Text>
          <Button title="CLOSE" variant="outline" onPress={close} />
        </View>
      ) : (
        <>
          <Heading title="Your Order" onAction={close} />
          {items.length ? (
            items.map(item => (
              <View key={item.id} style={localStyles.orderRow}>
                <View style={styles.between}>
                  <Text style={[styles.text, localStyles.itemName]}>
                    {item.name}
                  </Text>
                  <Text style={styles.text}>
                    {money(item.price * data.cart[item.id])}
                  </Text>
                </View>
                <Stepper
                  value={data.cart[item.id]}
                  label={item.name}
                  decrease={() => quantity(item.id, -1)}
                  increase={() => quantity(item.id, 1)}
                  max={data.cart[item.id] >= 99}
                />
                <View style={styles.divider} />
              </View>
            ))
          ) : (
            <Text style={styles.muted}>
              Your basket is empty. Add dishes or drinks from the menu.
            </Text>
          )}
          {!!items.length && (
            <>
              <View style={styles.between}>
                <Text style={styles.text}>Total</Text>
                <Text style={[styles.subtitle, localStyles.total]}>
                  {money(total)}
                </Text>
              </View>
              <Text style={styles.subtitle}>Confirm your room number</Text>
              <Field
                label="Room number"
                placeholder={data.booking?.room || 'Enter your room'}
                value={room}
                onChangeText={setRoom}
                autoCapitalize="characters"
                maxLength={16}
              />
              <Button
                title={
                  data.booking
                    ? `ROOM ${data.booking.room} · SCAN ANOTHER CODE`
                    : 'SCAN BOOKING CODE'
                }
                icon="qr"
                variant="teal"
                onPress={() => {
                  onClose();
                  navigation.navigate('Scanner');
                }}
              />
              {!data.settings.apiUrl && (
                <Text style={styles.muted}>
                  Hotel service is not connected. This order will be saved
                  locally until you send it.
                </Text>
              )}
              <Button
                title={data.settings.apiUrl ? 'PLACE ORDER' : 'SAVE ORDER'}
                disabled={!validRoom(roomNumber)}
                loading={busy}
                onPress={place}
              />
            </>
          )}
          <Button
            title="CANCEL"
            variant="outline"
            disabled={busy}
            onPress={close}
          />
        </>
      )}
    </Sheet>
  );
}
const localStyles = StyleSheet.create({
  result: {
    gap: 22,
    paddingVertical: 24,
  },
  resultIcon: {
    fontSize: 44,
    color: colors.gold,
    textAlign: 'center',
  },
  resultTitle: {
    textAlign: 'center',
  },
  resultDescription: {
    textAlign: 'center',
  },
  orderRow: {
    gap: 12,
  },
  itemName: {
    flex: 1,
  },
  total: {
    color: colors.gold,
  },
});
