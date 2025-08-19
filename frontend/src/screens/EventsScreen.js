import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Dimensions, 
  Animated, 
  Image,
  ScrollView,
  RefreshControl
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL, getCurrentUserId } from '../../auth';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/tr';
import BottomBar from '../components/BottomBar';

const colors = {
  primary: '#FF8502',
  secondary: '#0A0827',
  third: '#8FA0D8',
  background: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  text: '#333',
  gray: '#707070',
  lightGray: '#f5f5f5',
  darkGray: '#333333',
  overlay: 'rgba(0,0,0,0.5)',
  transparent: 'transparent'
};

const { width } = Dimensions.get('window');


export default function EventsScreen({ navigation, route }) {
  const [tab, setTab] = useState('created');
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabAnim] = useState(new Animated.Value(0));
  const [activeTab, setActiveTab] = useState('Events');

  const navRoute = useRoute();

  const fetchEvents = async () => {
    try {
      const currentUserId = await getCurrentUserId();
      const allRes = await axios.get(`${API_BASE_URL}/events`);

      const myCreatedEvents = allRes.data.filter(ev =>
        ev.creator_id && currentUserId && ev.creator_id.toString().trim() === currentUserId.toString().trim()
      );
      
      const myJoinedEvents = allRes.data.filter(ev => 
        ev.participants && ev.participants.some(p => p.user_id.toString().trim() === currentUserId.toString().trim())
      );

      setCreatedEvents(myCreatedEvents);
      setJoinedEvents(myJoinedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  useFocusEffect(
    React.useCallback(() => {
      if (navRoute.params && navRoute.params.refresh) {
        fetchEvents();
        navigation.setParams({ refresh: false });
      } else {
        fetchEvents();
      }
    }, [navRoute.params?.refresh])
  );

  useEffect(() => {
    if (route.params?.tab) {
      setTab(route.params.tab);
    }
  }, [route.params]);

  useEffect(() => {
    Animated.spring(tabAnim, {
      toValue: tab === 'created' ? 0 : 1,
      useNativeDriver: false,
      friction: 7,
    }).start();
  }, [tab]);

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCardModern}
      activeOpacity={0.92}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={styles.eventImageWrapper}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.eventImageModern} />
        ) : (
          <View style={styles.eventImagePlaceholderModern}>
            <MaterialCommunityIcons name="calendar-star" size={38} color="#ea4c89" />
          </View>
        )}
      </View>
      <View style={styles.eventContentModern}>
        <Text style={styles.eventTitleModern} numberOfLines={1}>{item.title}</Text>
        <View style={styles.metaRowModern}>
          <Ionicons name="location-sharp" size={16} color="#6c757d" />
          <Text style={styles.eventMetaModern}>{item.city} / {item.district}</Text>
        </View>
        <View style={styles.metaRowModern}>
          <Ionicons name="calendar-sharp" size={16} color="#6c757d" />
          <Text style={styles.eventMetaModern}>{moment(item.date).locale('tr').format('DD MMMM YYYY')} • {item.time}</Text>
        </View>
        
        {item.category && (
          <View style={styles.categoryBadgeModern}>
            <Text style={styles.categoryTextModern}>{item.category}</Text>
          </View>
        )}
        {item.description ? (
          <Text style={styles.eventDescModern} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <View style={styles.eventFooterModern}>
          <View style={styles.participantBoxModern}>
            <MaterialCommunityIcons name="groups" size={18} color="#a1c9ff" />
            <Text style={styles.participantCountModern}>{item.participants ? item.participants.length : 1} kişi</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const indicatorTranslate = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.5],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.tabIndicator,
            { transform: [{ translateX: indicatorTranslate }] },
          ]}
        />
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTab('created')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="create-outline" 
            size={20} 
            color={tab === 'created' ? '#6c5ce7' : '#adb5bd'} 
          />
          <Text style={[styles.tabText, tab === 'created' && styles.activeTabText]}>
            Oluşturduklarım
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTab('joined')}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="people-outline" 
            size={20} 
            color={tab === 'joined' ? '#6c5ce7' : '#adb5bd'} 
          />
          <Text style={[styles.tabText, tab === 'joined' && styles.activeTabText]}>
            Katıldıklarım
          </Text>
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6c5ce7']}
            tintColor="#6c5ce7"
          />
        }
      >
        {tab === 'created' ? (
          createdEvents.length > 0 ? (
            <FlatList
              data={createdEvents}
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
              renderItem={renderEventItem}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <Text style={styles.sectionHeader}>
                  Oluşturduğunuz Etkinlikler ({createdEvents.length})
                </Text>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="calendar-remove" 
                size={60} 
                color="#dee2e6" 
              />
              <Text style={styles.emptyText}>Henüz etkinlik oluşturmadınız</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateIndividualEvent')}
              >
                <Text style={styles.createButtonText}>Etkinlik Oluştur</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          joinedEvents.length > 0 ? (
            <FlatList
              data={joinedEvents}
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
              renderItem={renderEventItem}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                <Text style={styles.sectionHeader}>
                  Katıldığınız Etkinlikler ({joinedEvents.length})
                </Text>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="people-outline" 
                size={60} 
                color="#dee2e6" 
              />
              <Text style={styles.emptyText}>Henüz bir etkinliğe katılmadınız</Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.exploreButtonText}>Etkinlikleri Keşfet</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomBar 
        activeTab={activeTab}
        onTabChange={(screen) => {
          setActiveTab(screen);
          navigation.navigate(screen);
        }}
      />
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 20,
    margin: 24,
    marginBottom: 12,
    padding: 4,
    overflow: 'hidden',
    position: 'relative',
    height: 44,
    
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 2,
  },
  tabText: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '700',
    marginLeft: 8,
  },
  activeTabText: {
    color: colors.white,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: width * 0.5 - 28,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 18,
    zIndex: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 120,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 14,
    marginBottom: 14,
    fontWeight: '500',
    lineHeight: 24,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  exploreButton: {
    backgroundColor: colors.third,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  exploreButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  eventCardModern: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  eventImageWrapper: {
    width: '100%',
    height: 110,
    backgroundColor: colors.lightGray,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  eventImageModern: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventImagePlaceholderModern: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContentModern: {
    padding: 12,
  },
  eventTitleModern: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  metaRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  eventMetaModern: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: 5,
  },
  categoryBadgeModern: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  categoryTextModern: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  eventDescModern: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
    fontStyle: 'italic',
  },
  eventFooterModern: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  participantBoxModern: {
    flexDirection: 'row',
    backgroundColor: colors.third,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  participantCountModern: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});