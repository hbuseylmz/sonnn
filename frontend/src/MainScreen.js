// MainScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Screens
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateIndividualEventScreen from './screens/CreateIndividualEventScreen';
import CreateClubScreen from './screens/CreateClubScreen';

// Components
import BottomBar from './components/BottomBar';

const MainScreen = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState('Home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Events':
        return <EventsScreen showBottomBar={true} navigation={navigation} />;
      case 'Notifications':
        return <NotificationsScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      case 'CreateIndividualEvent':
        return <CreateIndividualEventScreen navigation={navigation} />;
      case 'CreateClub':
        return <CreateClubScreen navigation={navigation} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>{renderScreen()}</View>
      <BottomBar 
        activeTab={activeScreen} 
        onTabChange={setActiveScreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  contentContainer: { 
    flex: 1,
    marginBottom: 60 // BottomBar yüksekliği kadar boşluk bırak
  },
});

export default MainScreen;