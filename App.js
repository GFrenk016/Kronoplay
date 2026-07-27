// -----------------------------------------------------------------------------
// Entry point dell'app Kronoplay.
// Compone i provider globali (safe area + libreria) attorno alla navigazione.
// -----------------------------------------------------------------------------

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LibraryProvider } from './src/context/LibraryContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LibraryProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </LibraryProvider>
    </SafeAreaProvider>
  );
}
