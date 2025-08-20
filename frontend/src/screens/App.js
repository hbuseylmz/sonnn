import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';
import { useFonts } from 'expo-font';

// MainScreen
import MainScreen from '../MainScreen';

// Auth screens
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import EventsScreen from './EventsScreen'; 
import CreateEventScreen from './CreateEventScreen';

import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import CreateIndividualEventScreen from './CreateIndividualEventScreen';
import CreateClubEventScreen from './CreateClubEventScreen';
import CreateClubScreen from './CreateClubScreen';
import EventDetailScreen from './EventDetailScreen';
import ClubDetailScreen from './ClubDetailScreen';

const Stack = createNativeStackNavigator();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': require('../fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../fonts/Nunito-Bold.ttf'),
    'Nunito-Variable': require('../fonts/Nunito-VariableFont_wght.ttf'),
    'Inter-Variable': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
    'Fredoka-Variable': require('../fonts/Fredoka-VariableFont_wdth,wght.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Load any resources here (fonts, async storage, etc.)
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    // Set global default font when loaded
    if (fontsLoaded) {
      if (Text.defaultProps == null) Text.defaultProps = {};
      if (Text.defaultProps.style == null) Text.defaultProps.style = {};
      Text.defaultProps.style.fontFamily = 'Nunito-Regular';
      if (TextInput.defaultProps == null) TextInput.defaultProps = {};
      if (TextInput.defaultProps.style == null) TextInput.defaultProps.style = {};
      TextInput.defaultProps.style.fontFamily = 'Nunito-Regular';
    }
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null; // Show nothing while loading
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login" 
            screenOptions={{ headerBackTitle: 'Geri' }}
          >
            {/* Auth Screens */}
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Kayıt Ol' }} 
            />

            {/* Main Tab Navigator */}
            <Stack.Screen 
              name="Home" 
              component={MainScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}  
            options={{ title: 'Profil' }} 
            />

            {/* Other Screens */}
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen} 
              options={{ title: 'Profilimi Düzenle' }} 
            />
            <Stack.Screen 
              name="CreateIndividualEvent" 
              component={CreateIndividualEventScreen} 
              options={{ title: 'Bireysel Etkinlik Oluştur' }} 
            />
            <Stack.Screen 
            name="Events" 
            component={EventsScreen} 
            options={{ title: 'Etkinlikler' }} 
            />
            <Stack.Screen 
            name="CreateEventScreen" 
            component={CreateEventScreen} 
            options={{ headerShown: false }} 
            />
            <Stack.Screen 
            name="CreateClubScreen" 
            component={CreateClubScreen} 
            options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="CreateClubEvent" 
              component={CreateClubEventScreen} 
              options={{ title: 'Kulüp Etkinliği Oluştur' }} 
            />
            <Stack.Screen 
              name="CreateClub" 
              component={CreateClubScreen} 
              options={{ title: 'Kulüp Oluştur' }} 
            />
            <Stack.Screen 
              name="EventDetail" 
              component={EventDetailScreen} 
              options={{ title: 'Etkinlik Detayı' }} 
            />
            <Stack.Screen 
              name="ClubDetail" 
              component={ClubDetailScreen} 
              options={{ title: 'Kulüp Detayı' }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </View>
  );
}