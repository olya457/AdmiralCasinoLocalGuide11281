import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button } from './UI';
import { styles } from '../theme';
export function MapPreview({
  coordinates,
  onRoute,
}: {
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  onRoute: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  if (!coordinates) {
    return (
      <View style={styles.card}>
        <Text style={styles.muted}>
          Add the hotel location to see the map and directions.
        </Text>
        <Button
          title="SET HOTEL LOCATION"
          variant="outline"
          onPress={onRoute}
        />
      </View>
    );
  }
  const { latitude: lat, longitude: lon } = coordinates;
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lon - 0.012
  },${lat - 0.005},${lon + 0.012},${
    lat + 0.005
  }&layer=mapnik&marker=${lat},${lon}`;
  return (
    <View style={localStyles.container}>
      {failed ? (
        <View style={styles.card}>
          <Text style={styles.muted}>
            Map unavailable. You can still open directions.
          </Text>
          <Button
            title="RETRY MAP"
            variant="outline"
            onPress={() => {
              setFailed(false);
              setRetry(v => v + 1);
            }}
          />
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open map directions"
          onPress={onRoute}
          style={localStyles.preview}
        >
          <View pointerEvents="none" style={{ flex: 1 }}>
            <WebView
              key={retry}
              source={{
                uri: url,
              }}
              onError={() => setFailed(true)}
              onHttpError={() => setFailed(true)}
              javaScriptEnabled
              startInLoadingState
              setSupportMultipleWindows={false}
            />
          </View>
        </Pressable>
      )}
      <Button
        title="OPEN DIRECTIONS"
        variant="outline"
        icon="pin"
        onPress={onRoute}
      />
    </View>
  );
}
const localStyles = StyleSheet.create({
  container: {
    gap: 8,
  },
  preview: {
    height: 125,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
