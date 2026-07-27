// -----------------------------------------------------------------------------
// Navigazione principale: bottom tab bar con le 4 schermate del prototipo.
// -----------------------------------------------------------------------------

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors } from '../constants/theme';
import SearchScreen from '../screens/SearchScreen';
import StatsScreen from '../screens/StatsScreen';
import WatchedScreen from '../screens/WatchedScreen';
import WatchlistScreen from '../screens/WatchlistScreen';

const Tab = createBottomTabNavigator();

// Tema di navigazione allineato ai colori dell'app (evita flash bianchi).
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.text,
    primary: colors.primary,
  },
};

// Icone emoji per tab: zero dipendenze da font-icon per il prototipo.
const ICONS = {
  Cerca: '🔍',
  Visti: '🍿',
  Watchlist: '🔖',
  Statistiche: '📊',
};

function tabIcon(routeName, focused) {
  return (
    <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.5 }]}>
      {ICONS[routeName]}
    </Text>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => tabIcon(route.name, focused),
        })}
      >
        <Tab.Screen name="Cerca" component={SearchScreen} />
        <Tab.Screen name="Visti" component={WatchedScreen} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        <Tab.Screen name="Statistiche" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
  },
});
