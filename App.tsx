import './global.css';

import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import { QueryProvider } from './src/context/QueryProvider';
import { View, StatusBar } from 'react-native';

// Keep the native splash screen visible while fonts load.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#F5F3FF' }}
        className="flex-1 bg-surface"
        edges={['top']}
      >
        <View style={{ flex: 1, paddingTop: 12 }}>
          <QueryProvider>
            <AuthProvider>
              <UserProvider>
                <NavigationContainer>
                  <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
                  <RootNavigator />
                </NavigationContainer>
              </UserProvider>
            </AuthProvider>
          </QueryProvider>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}