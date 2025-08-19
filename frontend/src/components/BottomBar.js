// BottomBar.js
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeIcon from '../svg/HomeIcon.svg';
import SearchIcon from '../svg/SearchIcon.svg';
import AddIcon from '../svg/AddIcon.svg';
import NotificationsIcon from '../svg/NotificationsIcon.svg';
import ProfileIcon from '../svg/ProfileIcon.svg';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function BottomBar({ activeTab }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation();

  const handleTabPress = (screenName) => {
    setMenuOpen(false);
    navigation.navigate(screenName);
  };

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      
      {/* Menü açıkken arkaya karartma */}
      {menuOpen && (
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={() => setMenuOpen(false)} 
          activeOpacity={1}
        />
      )}

      {/* Menü içeriği */}
      {menuOpen && (
        <View style={styles.actionMenuContainer}>
          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => {
              setMenuOpen(false);
              navigation.navigate('CreateEventScreen');
            }}
          >
            <Ionicons name="calendar" size={20} color={colors.background} style={{marginRight: 10}} />
            <Text style={styles.actionText}>Etkinlik Oluştur</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionRow}
            onPress={() => {
              setMenuOpen(false);
              navigation.navigate('CreateClubScreen');
            }}
          >
            <Ionicons name="people" size={20} color={colors.background} style={{marginRight: 10}} />
            <Text style={styles.actionText}>Kulüp Oluştur</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {/* Home Button */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => handleTabPress('Home')}
          >
            <HomeIcon width={20} height={20} />
            {activeTab === 'Home' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {/* Events Button */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => handleTabPress('Events')}
          >
            <SearchIcon width={24} height={24} />
            {activeTab === 'Events' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {/* Add Button */}
          <View style={styles.addButtonWrapper}>
            <TouchableOpacity 
              style={styles.addButtonContainer} 
              onPress={() => setMenuOpen((v) => !v)}
            >
              <View style={styles.whiteCircle} />
              <AddIcon width={20} height={20} style={styles.addIcon} />
            </TouchableOpacity>
          </View>

          {/* Notifications Button */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => handleTabPress('Notifications')}
          >
            <NotificationsIcon width={20} height={20} />
            {activeTab === 'Notifications' && <View style={styles.activeDot} />}
          </TouchableOpacity>

          {/* Profile Button */}
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => handleTabPress('Profile')}
          >
            <ProfileIcon width={24} height={24} />
            {activeTab === 'Profile' && <View style={styles.activeDot} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -1000,
    bottom: 80,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  actionMenuContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 100,
    backgroundColor: colors.fourth || '#0B0827',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    color: colors.background,
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
  },
  tabBar: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16,
  },
  tabItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 8,
    paddingBottom: 6,
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  addButtonWrapper: {
    position: 'absolute',
    top: -24,
    left: '50%',
    marginLeft: -15,
  },
  addButtonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 4,
    position: 'relative',
  },
  whiteCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  addIcon: {
    zIndex: 2,
  },
});
