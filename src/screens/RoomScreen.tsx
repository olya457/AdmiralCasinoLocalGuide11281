import React, { useState } from 'react';
import { Alert, Pressable, Switch, Text, View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams, Room } from '../types';
import { useApp } from '../state/AppProvider';
import {
  Button,
  Choice,
  Heading,
  Screen,
  Stepper,
  Tabs,
} from '../components/UI';
import { colors, styles } from '../theme';
import { syncRoom } from '../services/hotel';
const scenes: Record<string, Partial<Room>> = {
  Morning: {
    temperature: 22,
    fan: 2,
    mode: 'Auto',
    brightness: 90,
    warmth: 'Neutral',
    color: '#ffffff',
    main: true,
    bedside: false,
    bathroom: true,
  },
  Evening: {
    temperature: 23,
    fan: 1,
    mode: 'Auto',
    brightness: 55,
    warmth: 'Warm',
    color: '#ffdc96',
    main: true,
    bedside: true,
    bathroom: false,
  },
  Relax: {
    temperature: 23,
    fan: 1,
    mode: 'Cooling',
    brightness: 30,
    warmth: 'Warm',
    color: '#ffdc96',
    main: false,
    bedside: true,
    bathroom: false,
  },
  Sleep: {
    temperature: 21,
    fan: 1,
    mode: 'Sleep',
    brightness: 5,
    warmth: 'Warm',
    color: '#ffdc96',
    main: false,
    bedside: false,
    bathroom: false,
  },
};
export function RoomScreen() {
  const [tab, setTab] = useState('Air Conditioning');
  const [scene, setScene] = useState('');
  const [busy, setBusy] = useState(false);
  const { data, update } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const room = data.room;
  const change = (patch: Partial<Room>) => {
    setScene('');
    update(current => ({
      ...current,
      room: {
        ...current.room,
        ...patch,
      },
    }));
  };
  const apply = async () => {
    if (!data.settings.apiUrl || !data.booking) {
      navigation.navigate('Settings');
      return;
    }
    setBusy(true);
    try {
      await syncRoom(data.settings, room, data.booking, data.dnd);
      Alert.alert(
        'Settings applied',
        'Your hotel confirmed the room settings.',
      );
    } catch (error) {
      Alert.alert('Settings not applied', (error as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen animationKey={tab}>
      <Heading title="Room Controls" />
      <Tabs
        values={['Air Conditioning', 'Lighting']}
        selected={tab}
        onSelect={setTab}
      />
      {tab === 'Air Conditioning' ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>TEMPERATURE</Text>
            <Stepper
              value={`${room.temperature}°C`}
              label="temperature"
              min={room.temperature <= 16}
              max={room.temperature >= 30}
              decrease={() =>
                change({
                  temperature: Math.max(16, room.temperature - 1),
                })
              }
              increase={() =>
                change({
                  temperature: Math.min(30, room.temperature + 1),
                })
              }
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>FAN SPEED</Text>
            <Stepper
              value={room.fan}
              label="fan speed"
              min={room.fan <= 1}
              max={room.fan >= 5}
              decrease={() =>
                change({
                  fan: Math.max(1, room.fan - 1),
                })
              }
              increase={() =>
                change({
                  fan: Math.min(5, room.fan + 1),
                })
              }
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>MODE</Text>
            <View style={localStyles.modeGrid}>
              {(['Cooling', 'Heating', 'Auto', 'Sleep'] as const).map(mode => (
                <View key={mode} style={localStyles.modeCell}>
                  <Choice
                    title={mode}
                    active={room.mode === mode}
                    onPress={() =>
                      change({
                        mode,
                      })
                    }
                  />
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.card}>
            <View style={styles.between}>
              <Text style={styles.label}>BRIGHTNESS</Text>
              <Text style={localStyles.brightnessValue}>
                {room.brightness}%
              </Text>
            </View>
            <Slider
              accessibilityLabel="Light brightness"
              accessibilityValue={{
                min: 0,
                max: 100,
                now: room.brightness,
              }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={room.brightness}
              onValueChange={brightness =>
                change({
                  brightness,
                })
              }
              minimumTrackTintColor={colors.gold}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.gold}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>LIGHT TEMPERATURE</Text>
            <View style={[styles.row, localStyles.temperatureChoices]}>
              {(['Warm', 'Neutral', 'Cool'] as const).map(warmth => (
                <Choice
                  key={warmth}
                  title={warmth}
                  active={room.warmth === warmth}
                  onPress={() =>
                    change({
                      warmth,
                    })
                  }
                />
              ))}
            </View>
            <Text style={styles.label}>LIGHT COLOUR</Text>
            <View style={[styles.row, localStyles.colorChoices]}>
              {[
                '#ffdc96',
                '#ffffff',
                '#a9d5ff',
                '#faa8c8',
                '#bda8ff',
                '#a6e8c2',
              ].map(color => (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`Light colour ${color}`}
                  accessibilityState={{
                    selected: room.color === color,
                  }}
                  onPress={() =>
                    change({
                      color,
                    })
                  }
                  style={{
                    width: 44,
                    height: 44,
                    borderWidth: 2,
                    borderColor:
                      room.color === color ? colors.gold : 'transparent',
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 29,
                      height: 29,
                      borderRadius: 15,
                      backgroundColor: color,
                    }}
                  />
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>ZONES</Text>
            {(['main', 'bedside', 'bathroom'] as const).map(zone => (
              <View key={zone} style={[styles.between, localStyles.zoneRow]}>
                <Text style={styles.text}>
                  {zone[0].toUpperCase() + zone.slice(1)} Light
                </Text>
                <Switch
                  accessibilityLabel={`${zone} light`}
                  value={room[zone]}
                  onValueChange={value =>
                    change({
                      [zone]: value,
                    })
                  }
                  trackColor={{
                    false: colors.border,
                    true: colors.gold,
                  }}
                  thumbColor={room[zone] ? colors.background : colors.muted}
                />
              </View>
            ))}
          </View>
        </>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>ROOM SCENES</Text>
        <View style={localStyles.sceneGrid}>
          {Object.keys(scenes).map(name => (
            <Choice
              key={name}
              title={name}
              active={scene === name}
              onPress={() => {
                change(scenes[name]);
                setScene(name);
              }}
            />
          ))}
        </View>
      </View>
      <Text style={styles.muted}>
        Preferences are saved on this device. Apply them to send to your
        connected hotel room.
      </Text>
      <Button
        title={
          data.settings.apiUrl && data.booking
            ? 'APPLY TO ROOM'
            : 'CONNECT YOUR ROOM'
        }
        loading={busy}
        onPress={apply}
      />
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeCell: {
    width: '48%',
    flexGrow: 1,
  },
  brightnessValue: {
    color: colors.gold,
  },
  temperatureChoices: {
    flexWrap: 'wrap',
    gap: 8,
  },
  colorChoices: {
    flexWrap: 'wrap',
  },
  zoneRow: {
    minHeight: 46,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
