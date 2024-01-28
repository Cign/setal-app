import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from './src/Util/AuthContext';
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabs } from "./src/Navigation/navigation";
import '@tamagui/core/reset.css'

import { TamaguiProvider, createTamagui } from 'tamagui'

// some nice defaults:
import { config } from '@tamagui/config/v2'

const tamaguiConfig = createTamagui(config)

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <TamaguiProvider config={tamaguiConfig}>
        <NavigationContainer>
          <AuthProvider>
            <BottomTabs />
          </AuthProvider>
        </NavigationContainer>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
