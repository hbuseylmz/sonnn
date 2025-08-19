import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';

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

  useEffect(() => {
    async function prepare() {
      try {
        // Load any resources here (fonts, async storage, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
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