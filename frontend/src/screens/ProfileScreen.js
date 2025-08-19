import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { API_BASE_URL, getCurrentUserId } from '../../auth';
import axios from 'axios';

import HomeIcon from '../svg/HomeIcon.svg';
import SearchIcon from '../svg/SearchIcon.svg';
import AddIcon from '../svg/AddIcon.svg';
import NotificationsIcon from '../svg/NotificationsIcon.svg';
import ProfileIcon from '../svg/ProfileIcon.svg';
import SvgSettings from '../svg/Asseta.svg';
import SvgAvatar from '../svg/ProfileIcon.svg';
import SvgEditProfile from '../svg/editprofile.svg';
import SvgProfilePage1 from '../svg/profilepage1.svg';
import SvgProfilePage2 from '../svg/BookmarkIcon.svg';
import colors from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı + etkinlik sayısı çek
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          console.error("Kullanıcı ID bulunamadı");
          return;
        }

        // Kullanıcı bilgilerini çek
        const userRes = await axios.get(`${API_BASE_URL}/users/${userId}`);
        const userData = userRes.data;

        // Kullanıcının etkinlik sayısını çek
        const eventsRes = await axios.get(`${API_BASE_URL}/events?creatorId=${userId}`);
        const eventCount = eventsRes.data.length;

        setCurrentUser({
          username: userData.name, // ✅ backend "name" döndürüyor
          followingCount: userData.followingCount || 0,
          followerCount: userData.followerCount || 0,
          eventCount: eventCount,
          bio: userData.bio || ""
        });
      } catch (error) {
        console.error("Profil verisi çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8FA0D8" />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: colors.text }}>Kullanıcı verisi yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Settings Icon */}
      <TouchableOpacity 
        style={styles.settingsIcon}
        onPress={() => navigation.navigate('Settings')}
      >
        <SvgSettings width={26} height={26} />
      </TouchableOpacity>

      {/* Main content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <SvgAvatar width={90} height={90} />
          </View>
        </View>

        {/* Username and Edit */}
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>@{currentUser.username}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <SvgEditProfile width={18} height={18} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.followingCount}</Text>
            <Text style={styles.statLabel}>Takipte</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.followerCount}</Text>
            <Text style={styles.statLabel}>Takipçi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser.eventCount}</Text>
            <Text style={styles.statLabel}>Etkinlik</Text>
          </View>
        </View>

        {/* Bio Button */}
        <TouchableOpacity
          style={styles.bioButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.bioText}>
            {currentUser.bio ? currentUser.bio : "+ Biyografi ekle"}
          </Text>
        </TouchableOpacity>

        {/* Profile Tabs */}
        <View style={styles.profileTabs}>
          <TouchableOpacity style={styles.profileTab}>
            <SvgProfilePage1 width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileTab}>
            <SvgProfilePage2 width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {currentUser.eventCount === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Henüz etkinlik oluşturmadın!</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => navigation.navigate('Home')}
          >
            <HomeIcon width={24} height={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => navigation.navigate('Search')}
          >
            <SearchIcon width={24} height={24} />
          </TouchableOpacity>

          <View style={styles.addButtonWrapper}>
            <TouchableOpacity 
              style={styles.addButtonContainer}
              onPress={() => navigation.navigate('Create')}
            >
              <View style={styles.whiteCircle} />
              <AddIcon width={20} height={20} style={styles.addIcon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <NotificationsIcon width={24} height={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <ProfileIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  settingsIcon: {
    position: 'absolute',
    top: 35,
    right: 20,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  avatarCircle: {
    backgroundColor: colors.primary,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  usernameText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: colors.text,
  },
  editButton: {
    backgroundColor: colors.third,
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: colors.text,
  },
  bioButton: {
    backgroundColor: colors.third,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: colors.text,
  },
  profileTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.fifth,
    marginHorizontal: 60,
    paddingBottom: 10,
  },
  profileTab: {
    marginHorizontal: 30,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: colors.fifth,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
  },
  tabBar: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  addButtonWrapper: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    zIndex: 10,
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
