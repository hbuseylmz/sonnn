import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventsScreen from '../screens/EventsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName="Home"
       screenOptions={{
       animationTypeForReplace: 'push',  // 'push' veya 'pop' deneyin
       headerShown: false,
     }}
>
       <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="Events" component={EventsScreen} />
       <Stack.Screen name="EventDetail" component={EventDetailScreen} />
       <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

