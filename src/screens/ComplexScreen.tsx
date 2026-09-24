import React, { useState } from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Place, RootStackParams } from '../types';
import { venues } from '../data/places';
import { colors, styles } from '../theme';
import { Button, Heading, Screen, Sheet } from '../components/UI';
export function ComplexScreen() {
  const [selected, setSelected] = useState<Place | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  return (
    <Screen>
      <Heading title="Complex Map" />
      <View style={localStyles.plan}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 360 644"
          preserveAspectRatio="none"
        >
          <Rect x="146" y="0" width="68" height="590" fill="#766b43" />
          <Path
            d="M180 0v580M0 150h360M0 278h360M0 408h360M0 535h360"
            stroke="#c9b66e"
            strokeWidth="4"
          />
          {[70, 215, 345, 473].map(y => (
            <React.Fragment key={y}>
              <Rect
                x="163"
                y={y - 30}
                width="34"
                height="60"
                rx="15"
                fill="#006078"
                stroke="#bfac6a"
                strokeWidth="3"
              />
              {[135, 224].map(x => (
                <React.Fragment key={x}>
                  <Circle cx={x} cy={y - 25} r="8" fill="#36552e" />
                  <Circle cx={x} cy={y + 25} r="8" fill="#36552e" />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          <Circle
            cx="180"
            cy="590"
            r="39"
            fill="#273b47"
            stroke="#dcc382"
            strokeWidth="6"
          />
          <Circle
            cx="180"
            cy="590"
            r="21"
            fill="#15758a"
            stroke="#bca269"
            strokeWidth="3"
          />
        </Svg>
        {venues.map(place => (
          <Pressable
            key={place.id}
            accessibilityRole="button"
            accessibilityLabel={`Open ${place.name}`}
            onPress={() => setSelected(place)}
            style={{
              position: 'absolute',
              left: `${place.marker!.x - 17}%`,
              top: `${place.marker!.y - 10}%`,
              width: '34%',
              height: '18%',
              borderWidth: 1,
              borderColor: '#8b794c',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <Image source={place.image} style={localStyles.venueImage} />
            <View style={localStyles.venueLabelContainer}>
              <Text style={localStyles.venueLabel}>{place.name}</Text>
            </View>
            <View style={localStyles.marker}>
              <Text
                style={{
                  color: colors.gold,
                  fontSize: place.id === 'Casino' ? 39 : 32,
                }}
              >
                {place.id === 'Casino' ? '★' : '●'}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text style={styles.muted}>
        Tap a marker to explore · Schematic venue layout
      </Text>
      <Sheet visible={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <Heading title={selected.name} onAction={() => setSelected(null)} />
            <View style={styles.row}>
              <Image source={selected.image} style={localStyles.previewImage} />
              <View style={localStyles.previewText}>
                <Text style={styles.text}>{selected.hours}</Text>
                <Text style={styles.muted}>{selected.short}</Text>
              </View>
            </View>
            <Button
              title="VIEW DETAILS"
              onPress={() => {
                navigation.navigate('Details', {
                  id: selected.id,
                  kind: 'venue',
                });
                setSelected(null);
              }}
            />
          </>
        )}
      </Sheet>
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  plan: {
    width: '100%',
    aspectRatio: 0.56,
    backgroundColor: '#081d24',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#80734a',
  },
  venueImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  venueLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#030a14b0',
    padding: 5,
  },
  venueLabel: {
    color: colors.text,
    fontSize: 10,
    textAlign: 'center',
  },
  marker: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  previewText: {
    flex: 1,
    gap: 6,
  },
});
