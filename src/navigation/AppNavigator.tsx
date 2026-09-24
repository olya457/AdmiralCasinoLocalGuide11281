import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParams } from '../types';
import { Icon, IconName } from '../components/Icon';
import { HomeScreen } from '../screens/HomeScreen';
import { ComplexScreen } from '../screens/ComplexScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { NearbyScreen, DetailsScreen } from '../screens/PlacesScreens';
import { RoomScreen } from '../screens/RoomScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { colors } from '../theme';
const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator();
const icons: Record<string, IconName> = {
  Home: 'home',
  Complex: 'map',
  Menu: 'menu',
  Nearby: 'pin',
  Room: 'controls',
};
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarAccessibilityLabel: route.name,
        tabBarStyle: {
          backgroundColor: colors.navy,
          borderTopColor: colors.border,
          height: 62 + insets.bottom,
          paddingTop: 10,
          paddingBottom: Math.max(10, insets.bottom),
        },
        tabBarIcon: ({ color }) => (
          <Icon name={icons[route.name]} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Complex" component={ComplexScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Nearby" component={NearbyScreen} />
      <Tab.Screen name="Room" component={RoomScreen} />
    </Tab.Navigator>
  );
}
export function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.navy,
          primary: colors.gold,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
