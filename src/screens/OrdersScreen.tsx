import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Order, RootStackParams } from '../types';
import { useApp } from '../state/AppProvider';
import { Button, Heading, Screen } from '../components/UI';
import { colors, styles } from '../theme';
import { menu } from '../data/menu';
import { money } from '../utils/validation';
import { submitOrder } from '../services/hotel';
export function OrdersScreen({
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Orders'>) {
  const { data, update } = useApp();
  const [sending, setSending] = useState<string | null>(null);
  const send = async (order: Order) => {
    if (sending) {
      return;
    }
    if (!data.settings.apiUrl) {
      navigation.navigate('Settings');
      return;
    }
    setSending(order.id);
    try {
      const reference = await submitOrder(
        data.settings,
        order,
        data.booking?.room === order.room ? data.booking : null,
      );
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
      Alert.alert('Order confirmed', 'Your hotel has accepted your order.');
    } catch (error) {
      Alert.alert('Order not confirmed', (error as Error).message);
    } finally {
      setSending(null);
    }
  };
  return (
    <Screen>
      <Heading title="My Orders" onAction={() => navigation.goBack()} />
      {!data.orders.length && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>No orders yet</Text>
          <Text style={styles.muted}>
            Your saved and confirmed restaurant orders will appear here.
          </Text>
        </View>
      )}
      {data.orders.map(order => (
        <View key={order.id} style={styles.card}>
          <View style={styles.between}>
            <Text style={styles.subtitle}>Room {order.room}</Text>
            <Text style={localStyles.total}>{money(order.total)}</Text>
          </View>
          <Text style={styles.muted}>
            {new Date(order.createdAt).toLocaleString()}
          </Text>
          {order.items.map(item => (
            <Text key={item.id} style={styles.text}>
              {item.quantity} ×{' '}
              {menu.find(dish => dish.id === item.id)?.name || item.id}
            </Text>
          ))}
          <Text
            style={{
              color: order.status === 'confirmed' ? '#81dbc6' : colors.gold,
            }}
          >
            {order.status === 'confirmed'
              ? `Confirmed · ${order.reference}`
              : 'Saved locally · not confirmed'}
          </Text>
          {order.status === 'saved' && (
            <Button
              title={
                data.settings.apiUrl ? 'SEND TO HOTEL' : 'CONNECT HOTEL SERVICE'
              }
              disabled={!!sending}
              loading={sending === order.id}
              onPress={() => send(order)}
            />
          )}
        </View>
      ))}
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  total: {
    color: colors.gold,
  },
});
