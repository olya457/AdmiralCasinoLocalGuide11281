import React, { useRef, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { RootStackParams } from '../types';
import { Button, Field, Heading, Screen } from '../components/UI';
import { colors, styles } from '../theme';
import { useApp } from '../state/AppProvider';
import { parseBooking, validRoom } from '../utils/validation';
import { verifyBooking } from '../services/hotel';
export function ScannerScreen({
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Scanner'>) {
  const { data, update } = useApp();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const focused = useIsFocused();
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [room, setRoom] = useState('');
  const accept = async (value: string) => {
    if (lock.current) {
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      let booking = parseBooking(value);
      if (data.settings.apiUrl) {
        booking = await verifyBooking(data.settings, booking);
      }
      update({
        booking,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Booking not confirmed', (error as Error).message, [
        {
          text: 'Try again',
          onPress: () => {
            lock.current = false;
            setBusy(false);
          },
        },
      ]);
    }
  };
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      const value = codes.find(code => code.value)?.value;
      if (value) {
        accept(value);
      }
    },
  });
  const permission = async () => {
    const allowed = await requestPermission();
    if (!allowed) {
      Alert.alert(
        'Camera access needed',
        'Enable camera access in Settings or enter your room number below.',
        [
          {
            text: 'Cancel',
          },
          {
            text: 'Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  };
  return (
    <Screen>
      <Heading title="Scan Booking Code" onAction={() => navigation.goBack()} />
      <Text style={styles.muted}>
        Point your camera at the booking QR supplied by reception.
      </Text>
      <View
        style={{
          height: 320,
          backgroundColor: colors.navy,
          borderRadius: 12,
          overflow: 'hidden',
          justifyContent: 'center',
          padding: hasPermission && device && !cameraError ? 0 : 20,
        }}
      >
        {hasPermission && device && !cameraError ? (
          <>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={focused && !busy}
              codeScanner={codeScanner}
              onError={() => setCameraError(true)}
            />
            <View pointerEvents="none" style={localStyles.scanFrame} />
          </>
        ) : (
          <View style={localStyles.permissionMessage}>
            <Text style={styles.text}>
              {cameraError
                ? 'Camera unavailable. Enter your room number below.'
                : hasPermission
                ? 'No camera found. You can enter your room below.'
                : 'Camera access is required to scan a booking QR.'}
            </Text>
            {!hasPermission && (
              <Button title="ALLOW CAMERA" onPress={permission} />
            )}
          </View>
        )}
      </View>
      {busy && <Text style={styles.muted}>Checking booking…</Text>}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Enter room manually</Text>
        <Field
          label="Room number"
          value={room}
          onChangeText={setRoom}
          maxLength={16}
          placeholder="Your room number"
        />
        <Button
          title="SAVE ROOM"
          disabled={!validRoom(room) || busy}
          onPress={() => {
            update({
              booking: {
                room: room.trim(),
                verified: false,
              },
            });
            navigation.goBack();
          }}
        />
      </View>
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  scanFrame: {
    width: 210,
    height: 210,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 15,
    alignSelf: 'center',
  },
  permissionMessage: {
    gap: 16,
  },
});
