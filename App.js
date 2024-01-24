import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from './src/Util/AuthContext';
import { NavigationContainer } from "@react-navigation/native";
import { BottomTabs } from "./src/Navigation/navigation";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <NavigationContainer>
        <AuthProvider>
          <BottomTabs />
        </AuthProvider>
      </NavigationContainer>
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
