import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { nearby, venues } from '../data/places';
import { RootStackParams } from '../types';
import { Button, Heading, Screen } from '../components/UI';
import { colors, styles } from '../theme';
export function NearbyScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  return (
    <Screen>
      <Heading title="Nearby Locations" />
      {nearby.map(place => (
        <View key={place.id} style={[styles.card, localStyles.placeCard]}>
          <Image source={place.image} style={localStyles.placeImage} />
          <View style={localStyles.placeContent}>
            <Text style={styles.subtitle}>{place.name}</Text>
            <Text style={styles.muted}>{place.short}</Text>
            <Button
              title="VIEW DETAILS"
              variant="outline"
              onPress={() =>
                navigation.navigate('Details', {
                  id: place.id,
                  kind: 'nearby',
                })
              }
            />
          </View>
        </View>
      ))}
    </Screen>
  );
}
export function DetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParams, 'Details'>) {
  const place = (route.params.kind === 'venue' ? venues : nearby).find(
    item => item.id === route.params.id,
  );
  if (!place) {
    return (
      <Screen>
        <Heading
          title="Location unavailable"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }
  return (
    <Screen>
      <Heading title={place.name} onAction={() => navigation.goBack()} />
      <Image
        source={place.image}
        style={[styles.image, localStyles.detailImage]}
      />
      {place.hours && (
        <View style={localStyles.metadata}>
          <Text style={styles.label}>OPENING HOURS</Text>
          <Text style={styles.text}>{place.hours}</Text>
        </View>
      )}
      <View style={styles.divider} />
      {place.paragraphs.map((paragraph, i) => (
        <Text
          key={paragraph}
          style={[
            styles.text,
            {
              lineHeight: 25,
              color: i ? colors.muted : colors.text,
              marginBottom: 6,
            },
          ]}
        >
          {paragraph}
        </Text>
      ))}
      {place.offer && (
        <View style={styles.card}>
          <Text style={styles.label}>SPECIAL OFFER</Text>
          <Text style={[styles.subtitle, localStyles.offerTitle]}>
            {place.offer.title}
          </Text>
          <Text style={styles.text}>{place.offer.text}</Text>
        </View>
      )}
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  placeCard: {
    padding: 0,
    overflow: 'hidden',
  },
  placeImage: {
    width: '100%',
    height: 205,
  },
  placeContent: {
    padding: 16,
    gap: 12,
  },
  detailImage: {
    height: 225,
  },
  metadata: {
    gap: 6,
    marginVertical: 10,
  },
  offerTitle: {
    color: colors.gold,
  },
});
