import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import ProfileIcon from '../svg/ProfileIcon.svg';
import BookmarkOutline from '../svg/BookmarkIcon.svg';
import BookmarkFilledIcon from '../svg/BookmarkFilledIcon.svg';

const colors = {
  primary: '#FF8C00',
  white: '#FFFFFF',
};

export default function EventCard({
  title,
  location,
  date,
  imageUri,
  category,
  participantsCount,
  description,
  onJoinPress,
  onBookmarkPress,
  onPress,
  saved = false,
  joined = false,
  canJoin = true,
}) {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.9} onPress={onPress}>
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
          {saved ? (
            <BookmarkFilledIcon width={16} height={20} />
          ) : (
            <BookmarkOutline width={16} height={20} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.eventOverlayBottom}>
        <Text style={styles.eventDate}>{date}</Text>
        {canJoin && (
          <TouchableOpacity style={[styles.joinButton, joined && styles.joinedButton]} onPress={onJoinPress} disabled={joined}>
            <Text style={styles.joinButtonText}>{joined ? 'Katıldın' : 'Katıl'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Meta content below image, HomeScreen-like but extended */}
      <View style={styles.metaContainer}>
        {!!category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        <View style={styles.metaChipsRow}>
          {!!location && (
            <View style={styles.metaChip}>
              <Ionicons name="location" size={14} color="#0A0827" />
              <Text style={styles.metaChipText}>{location}</Text>
            </View>
          )}
          {!!date && (
            <View style={styles.metaChip}>
              <Ionicons name="calendar" size={14} color="#0A0827" />
              <Text style={styles.metaChipText}>{date}</Text>
            </View>
          )}
        </View>
        {!!description && (
          <Text style={styles.descriptionText} numberOfLines={2}>
            {description}
          </Text>
        )}
        <View style={styles.metaFooterRow}>
          <View style={styles.participantBox}>
            <Text style={styles.participantText}>{participantsCount ?? 0} kişi</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  joinedButton: {
    backgroundColor: '#707070',
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Nunito-Bold', // Font eklendi
  },
  metaContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  metaChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  metaChipText: {
    marginLeft: 6,
    color: '#0A0827',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
  descriptionText: {
    color: '#444',
    fontSize: 13,
    marginBottom: 8,
    fontFamily: 'Nunito-Regular',
  },
  metaFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  participantBox: {
    backgroundColor: '#EFEFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  participantText: {
    color: '#333',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
});