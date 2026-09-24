import React, { useState } from 'react';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/state/AppProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SplashScreen, OnboardingScreen } from './src/screens/WelcomeScreen';
import { Button, Screen } from './src/components/UI';
import { colors, styles } from './src/theme';
function Content() {
  const [splashDone, setSplashDone] = useState(false);
  const { data, ready, error, retry } = useApp();
  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }
  if (!ready) {
    return (
      <Screen>
        <Text style={styles.title}>Your stay, together</Text>
        <Text style={styles.text}>{error || 'Loading your preferences…'}</Text>
        {error && <Button title="RETRY" onPress={retry} />}
      </Screen>
    );
  }
  return (
    <View style={localStyles.container}>
      {data.onboarded ? <AppNavigator /> : <OnboardingScreen />}
      {error && (
        <View style={localStyles.storageError}>
          <Text style={styles.text}>{error}</Text>
          <Button title="RETRY SAVING" onPress={retry} />
        </View>
      )}
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppProvider>
        <Content />
      </AppProvider>
    </SafeAreaProvider>
  );
}
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storageError: {
    backgroundColor: colors.navy,
    padding: 16,
    gap: 8,
  },
});
