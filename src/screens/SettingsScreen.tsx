import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParams } from '../types';
import { useApp } from '../state/AppProvider';
import { Button, Field, Heading, Screen } from '../components/UI';
import { styles } from '../theme';
import { hotelCoordinates, validRoom } from '../utils/validation';
export function SettingsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Settings'>) {
  const { data, update } = useApp();
  const [settings, setSettings] = useState(data.settings);
  const [room, setRoom] = useState(data.booking?.room || '');
  const [guest, setGuest] = useState(data.booking?.guest || '');
  const save = () => {
    const clean = {
      phone: settings.phone.trim(),
      latitude: settings.latitude.trim(),
      longitude: settings.longitude.trim(),
      apiUrl: settings.apiUrl.trim().replace(/\/$/, ''),
    };
    if (room.trim() && !validRoom(room)) {
      Alert.alert(
        'Check room number',
        'Use up to 16 letters, numbers, spaces or hyphens.',
      );
      return;
    }
    if (
      clean.phone &&
      !/^\+?[0-9]{3,15}$/.test(clean.phone.replace(/[\s()-]/g, ''))
    ) {
      Alert.alert(
        'Check phone number',
        'Enter a valid concierge telephone number.',
      );
      return;
    }
    if ((clean.latitude || clean.longitude) && !hotelCoordinates(clean)) {
      Alert.alert(
        'Check coordinates',
        'Enter latitude from −90 to 90 and longitude from −180 to 180.',
      );
      return;
    }
    if (
      clean.apiUrl &&
      !/^https:\/\/[^\s/?#]+(?::\d+)?(?:\/[^\s?#]*)?$/.test(clean.apiUrl)
    ) {
      Alert.alert(
        'Check service URL',
        'Enter an HTTPS service address supplied by your hotel.',
      );
      return;
    }
    const sameRoom = data.booking?.room === room.trim();
    update({
      settings: clean,
      booking: room.trim()
        ? {
            ...(sameRoom ? data.booking : {}),
            room: room.trim(),
            guest: guest.trim() || undefined,
          }
        : null,
    });
    navigation.goBack();
  };
  return (
    <Screen>
      <Heading title="Your Stay" onAction={() => navigation.goBack()} />
      <View style={styles.card}>
        <Text style={styles.subtitle}>Reservation</Text>
        <Field
          label="Room number"
          value={room}
          onChangeText={setRoom}
          placeholder="Your room number"
          maxLength={16}
        />
        <Field
          label="Guest name · optional"
          value={guest}
          onChangeText={setGuest}
          placeholder="Your name"
          maxLength={100}
        />
        <Button
          title="SCAN BOOKING CODE"
          variant="teal"
          icon="qr"
          onPress={() => navigation.replace('Scanner')}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Hotel connection</Text>
        <Text style={styles.muted}>
          Enter the contact and connection details supplied by reception.
        </Text>
        <Field
          label="Concierge phone"
          value={settings.phone}
          onChangeText={phone => setSettings({ ...settings, phone })}
          keyboardType="phone-pad"
          placeholder="Phone number"
        />
        <Field
          label="Hotel latitude"
          value={settings.latitude}
          onChangeText={latitude => setSettings({ ...settings, latitude })}
          keyboardType="numbers-and-punctuation"
          placeholder="Latitude"
        />
        <Field
          label="Hotel longitude"
          value={settings.longitude}
          onChangeText={longitude => setSettings({ ...settings, longitude })}
          keyboardType="numbers-and-punctuation"
          placeholder="Longitude"
        />
        <Field
          label="Hotel service URL · optional"
          value={settings.apiUrl}
          onChangeText={apiUrl => setSettings({ ...settings, apiUrl })}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="https://"
        />
        <Text style={styles.muted}>
          Orders, booking verification and room controls require a compatible
          hotel service. Without it, your choices stay on this device.
        </Text>
      </View>
      <Button title="SAVE DETAILS" onPress={save} />
      <Button
        title="VIEW MY ORDERS"
        variant="outline"
        onPress={() => navigation.navigate('Orders')}
      />
      {data.booking && (
        <Button
          title="REMOVE RESERVATION"
          variant="outline"
          onPress={() =>
            Alert.alert(
              'Remove reservation?',
              'Your booking details will be removed from this device. Your order history will remain.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Remove',
                  style: 'destructive',
                  onPress: () => {
                    update({ booking: null });
                    setRoom('');
                    setGuest('');
                  },
                },
              ],
            )
          }
        />
      )}
    </Screen>
  );
}
