import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const ClubCard = ({ club, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.clubCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.clubIconContainer}>
        <Ionicons name="musical-notes" size={22} color={colors.white} />
      </View>
      <View style={styles.clubTextContainer}>
        <Text style={[styles.clubTitle, {fontFamily: 'Nunito-Bold'}]}>{club.name}</Text>
        <View style={styles.clubMeta}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{club.category}</Text>
          </View>
          <Text style={styles.clubMetaText}>{club.members}</Text>
          <Text style={styles.clubMetaText}>{club.events}</Text>
        </View>
        <Text style={styles.clubDescription}>{club.description}</Text>
      </View>
      <TouchableOpacity style={styles.clubButton}>
        <Text style={styles.clubButtonText}>Kulübe Git</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 12,
  },
  clubIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clubTextContainer: {
    flex: 1,
  },
  clubTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
  clubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#8FA0D8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
  },
  clubMetaText: {
    color: '#FFFFFF',
    opacity: 0.85,
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
  clubButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clubButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
});

export default ClubCard;