import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const ClubCard = ({ club, onPress, eventsCount = 0 }) => {
  const memberCount = club.member_count || club.memberCount || 0;
  const category = club.category || 'Genel';
  const cover = club.cover_image || club.image_url || null;
  return (
    <TouchableOpacity 
      style={styles.clubCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {cover ? (
        <Image source={{ uri: cover }} style={styles.coverImage} />
      ) : (
        <View style={styles.clubIconContainer}>
          <Ionicons name="people" size={22} color={colors.white} />
        </View>
      )}
      <View style={styles.clubTextContainer}>
        <Text style={styles.clubTitle}>{club.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <Text style={styles.metaText}>{memberCount} üye</Text>
          <Text style={styles.metaText}>{eventsCount} etkinlik</Text>
        </View>
        {!!club.description && (
          <Text style={styles.clubDescription} numberOfLines={2}>{club.description}</Text>
        )}
      </View>
      <View style={styles.rightCol}>
        <Ionicons name="chevron-forward" size={20} color={colors.white} />
        <TouchableOpacity style={styles.clubButton} onPress={onPress}>
          <Text style={styles.clubButtonText}>Kulübe Git</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
  },
  coverImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#e9ecef',
  },
  clubIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clubTextContainer: {
    flex: 1,
  },
  clubTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: '#8FA0D8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
  },
  metaText: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 12,
    marginRight: 8,
    fontFamily: 'Nunito-Regular',
  },
  clubDescription: {
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.95,
    fontFamily: 'Nunito-Regular',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  clubButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  clubButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
});

export default ClubCard;