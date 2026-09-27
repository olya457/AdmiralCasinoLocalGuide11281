import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  Switch,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../types';
import { useApp } from '../state/AppProvider';
import { Button, IconButton, Screen } from '../components/UI';
import { MapPreview } from '../components/MapPreview';
import { colors, styles } from '../theme';
import { images } from '../data/images';
import { venues } from '../data/places';
import { callConcierge, directions, syncRoom } from '../services/hotel';
import { hotelCoordinates } from '../utils/validation';
export function HomeScreen() {
  const { data, update } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const hour = new Date().getHours();
  const showError = (error: unknown) =>
    Alert.alert('Hotel service', (error as Error).message, [
      {
        text: 'Close',
      },
      {
        text: 'Settings',
        onPress: () => navigation.navigate('Settings'),
      },
    ]);
  const toggleDnd = async (dnd: boolean) => {
    update({
      dnd,
    });
    if (data.settings.apiUrl && data.booking) {
      try {
        await syncRoom(data.settings, data.room, data.booking, dnd);
      } catch (error) {
        showError(error);
      }
    }
  };
  return (
    <Screen>
      <View style={styles.between}>
        <View style={localStyles.greeting}>
          <Text style={styles.label}>
            GOOD {hour < 12 ? 'MORNING' : hour < 18 ? 'AFTERNOON' : 'EVENING'}
          </Text>
          <Text style={styles.title}>Admiral Resort Hub</Text>
        </View>
        <IconButton
          name="settings"
          label="Connection settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
      <Image
        source={images.hotel}
        style={localStyles.hero}
        resizeMode="cover"
      />
      <MapPreview
        coordinates={hotelCoordinates(data.settings)}
        onRoute={() =>
          hotelCoordinates(data.settings)
            ? directions(data.settings).catch(showError)
            : navigation.navigate('Settings')
        }
      />
      <View style={[styles.row, localStyles.quickActions]}>
        <View style={[styles.card, localStyles.dndCard]}>
          <Text style={localStyles.dndLabel}>DO NOT{'\n'}DISTURB</Text>
          <Switch
            accessibilityLabel="Do not disturb"
            value={data.dnd}
            onValueChange={toggleDnd}
            trackColor={{
              false: colors.border,
              true: colors.gold,
            }}
            thumbColor={data.dnd ? colors.background : colors.muted}
          />
        </View>
        <View style={localStyles.concierge}>
          <Button
            title="CALL CONCIERGE"
            onPress={() => callConcierge(data.settings.phone).catch(showError)}
          />
        </View>
      </View>
      {(!data.settings.apiUrl || !data.booking) && data.dnd && (
        <Text style={styles.muted}>
          Do not disturb is saved on this device. Connect your hotel service to
          notify reception.
        </Text>
      )}
      {data.booking ? (
        <View style={styles.card}>
          <View style={styles.between}>
            <Text style={styles.subtitle}>Reservation Details</Text>
            <IconButton
              name="qr"
              label="Scan another booking"
              onPress={() => navigation.navigate('Scanner')}
            />
          </View>
          <View style={styles.divider} />
          <Text style={styles.label}>ROOM</Text>
          <Text style={[styles.title, localStyles.roomNumber]}>
            {data.booking.room}
          </Text>
          {data.booking.guest && (
            <Text style={styles.text}>{data.booking.guest}</Text>
          )}
          {data.booking.checkIn && (
            <Text style={styles.muted}>Check-in: {data.booking.checkIn}</Text>
          )}
          {data.booking.checkOut && (
            <Text style={styles.muted}>Check-out: {data.booking.checkOut}</Text>
          )}
          <Text style={styles.muted}>
            {data.booking.verified
              ? 'Verified by your hotel'
              : 'Saved on device · not verified by reception'}
          </Text>
          <Button
            title="EDIT RESERVATION"
            variant="outline"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      ) : (
        <>
          <Button
            title="SCAN BOOKING CODE"
            variant="teal"
            icon="qr"
            onPress={() => navigation.navigate('Scanner')}
          />
          <Button
            title="ENTER ROOM NUMBER"
            variant="outline"
            onPress={() => navigation.navigate('Settings')}
          />
        </>
      )}
      <Text style={[styles.label, localStyles.sectionLabel]}>
        TODAY’S OFFER
      </Text>
      {[venues[1], venues[2]].map(place => (
        <Pressable
          key={place.id}
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('Details', {
              id: place.id,
              kind: 'venue',
            })
          }
          style={[styles.card, styles.row]}
        >
          <Image source={place.image} style={localStyles.offerImage} />
          <View style={localStyles.offerContent}>
            <Text style={localStyles.offerLabel}>
              {place.name.toUpperCase()} — {place.offer?.title.toUpperCase()}
            </Text>
            <Text style={styles.subtitle}>{place.offer?.title}</Text>
            <Text style={styles.muted}>{place.offer?.text}</Text>
          </View>
        </Pressable>
      ))}
      <Button
        title="MY ORDERS"
        variant="outline"
        onPress={() => navigation.navigate('Orders')}
      />
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  greeting: {
    flex: 1,
    gap: 8,
  },
  hero: {
    width: '100%',
    height: 260,
    borderRadius: 6,
  },
  quickActions: {
    alignItems: 'stretch',
  },
  dndCard: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 3,
  },
  dndLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.text,
    flexShrink: 1,
  },
  concierge: {
    flex: 1,
    justifyContent: 'center',
  },
  roomNumber: {
    color: colors.gold,
  },
  sectionLabel: {
    marginTop: 8,
  },
  offerImage: {
    width: 70,
    height: 78,
    borderRadius: 3,
  },
  offerContent: {
    flex: 1,
    gap: 5,
  },
  offerLabel: {
    fontSize: 10,
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
