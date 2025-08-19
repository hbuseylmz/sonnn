import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import ProfileIcon from '../svg/ProfileIcon.svg';
import BookmarkOutline from '../svg/BookmarkIcon.svg';

const colors = {
  primary: '#FF8C00',
  white: '#FFFFFF',
};

export default function EventCard({ title, location, date, imageUri, onJoinPress, onBookmarkPress }) {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.eventCard}>
      <Image source={{ uri: imageUri }} style={styles.eventImage} />

      <View style={styles.eventOverlayTop}>
        <View style={styles.eventHeaderLeft}>
          <View style={styles.eventAvatar}>
            <ProfileIcon width={14} height={14} />
          </View>
          <View>
            <Text style={styles.eventTitle}>{title}</Text>
            <Text style={styles.eventLocation}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookmarkBadgeLight} onPress={onBookmarkPress}>
          <BookmarkOutline width={16} height={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.eventOverlayBottom}>
        <Text style={styles.eventDate}>{date}</Text>
        <TouchableOpacity style={styles.joinButton} onPress={onJoinPress}>
          <Text style={styles.joinButtonText}>Katıl</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  eventImage: {
    width: '100%',
    height: 210,
  },
  eventOverlayTop: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  eventOverlayBottom: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Nunito-Bold', // Font eklendi
  },
  eventLocation: {
    color: colors.white,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
    fontFamily: 'Nunito-Regular', // Font eklendi
  },
  eventDate: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.9,
    fontFamily: 'Nunito-Regular', // Font eklendi
  },
  bookmarkBadgeLight: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Nunito-Bold', // Font eklendi
  },
});