import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL, getCurrentUserId } from '../../auth';

import BookmarkIcon from '../svg/BookmarkIcon.svg';
import BookmarkFilledIcon from '../svg/BookmarkFilledIcon.svg';
import BottomBar from '../components/BottomBar';
import colors from '../theme/colors';

// Filter options
const FILTER_OPTIONS = [
  { label: 'Tüm Şehirler', value: 'all' },
  { label: 'Adana', value: 'Adana' },
  { label: 'Adıyaman', value: 'Adıyaman' }, 
  { label: 'Afyonkarahisar', value: 'Afyonkarahisar' }, 
  { label: 'Ağrı', value: 'Ağrı' }, 
  { label: 'Aksaray', value: 'Aksaray' }, 
  { label: 'Amasya', value: 'Amasya' }, 
  { label: 'Ankara', value: 'Ankara' }, 
  { label: 'Antalya', value: 'Antalya' }, 
  { label: 'Ardahan', value: 'Ardahan' }, 
  { label: 'Artvin', value: 'Artvin' }, 
  { label: 'Aydın', value: 'Aydın' }, 
  { label: 'Balıkesir', value: 'Balıkesir' }, 
  { label: 'Bartın', value: 'Bartın' }, 
  { label: 'Batman', value: 'Batman' }, 
  { label: 'Bayburt', value: 'Bayburt' }, 
  { label: 'Bilecik', value: 'Bilecik' }, 
  { label: 'Bingöl', value: 'Bingöl' }, 
  { label: 'Bitlis', value: 'Bitlis' }, 
  { label: 'Bolu', value: 'Bolu' }, 
  { label: 'Burdur', value: 'Burdur' }, 
  { label: 'Bursa', value: 'Bursa' }, 
  { label: 'Çanakkale', value: 'Çanakkale' }, 
  { label: 'Çankırı', value: 'Çankırı' }, 
  { label: 'Çorum', value: 'Çorum' }, 
  { label: 'Denizli', value: 'Denizli' }, 
  { label: 'Diyarbakır', value: 'Diyarbakır' }, 
  { label: 'Düzce', value: 'Düzce' }, 
  { label: 'Edirne', value: 'Edirne' }, 
  { label: 'Elazığ', value: 'Elazığ' }, 
  { label: 'Erzincan', value: 'Erzincan' }, 
  { label: 'Erzurum', value: 'Erzurum' }, 
  { label: 'Eskişehir', value: 'Eskişehir' }, 
  { label: 'Gaziantep', value: 'Gaziantep' }, 
  { label: 'Giresun', value: 'Giresun' }, 
  { label: 'Gümüşhane', value: 'Gümüşhane' }, 
  { label: 'Hakkari', value: 'Hakkari' }, 
  { label: 'Hatay', value: 'Hatay' }, 
  { label: 'Iğdır', value: 'Iğdır' }, 
  { label: 'Isparta', value: 'Isparta' }, 
  { label: 'İstanbul', value: 'İstanbul' }, 
  { label: 'İzmir', value: 'İzmir' }, 
  { label: 'Kahramanmaraş', value: 'Kahramanmaraş' }, 
  { label: 'Karabük', value: 'Karabük' },
  { label: 'Karaman', value: 'Karaman' }, 
  { label: 'Kars', value: 'Kars' }, 
  { label: 'Kastamonu', value: 'Kastamonu' },
  { label: 'Kayseri', value: 'Kayseri' },
  { label: 'Kırıkkale', value: 'Kırıkkale' },
  { label: 'Kırklareli', value: 'Kırklareli' }, 
  { label: 'Kırşehir', value: 'Kırşehir' }, 
  { label: 'Kilis', value: 'Kilis' }, 
  { label: 'Kocaeli', value: 'Kocaeli' },
  { label: 'Konya', value: 'Konya' },
  { label: 'Kütahya', value: 'Kütahya' },
  { label: 'Malatya', value: 'Malatya' },
  { label: 'Manisa', value: 'Manisa' }, 
  { label: 'Mardin', value: 'Mardin' },
  { label: 'Mersin', value: 'Mersin' },
  { label: 'Muğla', value: 'Muğla' }, 
  { label: 'Muş', value: 'Muş' }, 
  { label: 'Nevşehir', value: 'Nevşehir' }, 
  { label: 'Niğde', value: 'Niğde' },
  { label: 'Ordu', value: 'Ordu' },
  { label: 'Osmaniye', value: 'Osmaniye' },
  { label: 'Rize', value: 'Rize' },
  { label: 'Sakarya', value: 'Sakarya' },
  { label: 'Samsun', value: 'Samsun' }, 
  { label: 'Siirt', value: 'Siirt' }, 
  { label: 'Sinop', value: 'Sinop' },
  { label: 'Sivas', value: 'Sivas' },
  { label: 'Şanlıurfa', value: 'Şanlıurfa' },
  { label: 'Şırnak', value: 'Şırnak' }, 
  { label: 'Tekirdağ', value: 'Tekirdağ' }, 
  { label: 'Tokat', value: 'Tokat' }, 
  { label: 'Trabzon', value: 'Trabzon' }, 
  { label: 'Tunceli', value: 'Tunceli' }, 
  { label: 'Uşak', value: 'Uşak' }, 
  { label: 'Van', value: 'Van' }, 
  { label: 'Yalova', value: 'Yalova' }, 
  { label: 'Yozgat', value: 'Yozgat' }, 
  { label: 'Zonguldak', value: 'Zonguldak' },

];

const STATUS_OPTIONS = [
  { label: 'Tüm Etkinlikler', value: 'all' },
  { label: 'Katıldıklarım', value: 'joined' },
  { label: 'Katılmadıklarım', value: 'not-joined' },
];

const CATEGORIES = [
  { label: '🎨 Sanat', value: 'Sanat' }, 
  { label: '💻 Yazılım', value: 'Yazılım' }, 
  { label: '⚽ Spor', value: 'Spor' }, 
  { label: '📚 Kitap', value: 'Kitap' }, 
  { label: '🎮 Oyun', value: 'Oyun' }, 
  { label: '🎵 Müzik', value: 'Müzik' }, 
  { label: '🌱 Doğa', value: 'Doğa' }, 
  { label: '✈ Seyahat', value: 'Seyahat' }, 
  { label: '🍳 Yemek', value: 'Yemek' }, 
  { label: '🧘 Kişisel Gelişim', value: 'Kişisel Gelişim' }, 
  { label: '🧪 Bilim', value: 'Bilim' }, 
  { label: '🗣 Tartışma', value: 'Tartışma' }, 
  { label: '📚 Eğitim', value: 'Eğitim' }, 
  { label: '💻 Teknoloji', value: 'Teknoloji' },
  
];

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Son Yüklenen');
  const [savedEventIds, setSavedEventIds] = useState(new Set());
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);
        await fetchData();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clubsRes, eventsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clubs`),
        axios.get(`${API_BASE_URL}/events`),
      ]);
      setClubs(clubsRes.data);
      setEvents(eventsRes.data);
      
      if (currentUserId) {
        const savedRes = await axios.get(`${API_BASE_URL}/events/saved`, {
          params: { user_id: currentUserId }
        });
        setSavedEventIds(new Set(savedRes.data.map(ev => ev.id)));
        
        const joinedRes = await axios.get(`${API_BASE_URL}/events/joined`, {
          params: { user_id: currentUserId }
        });
        setJoinedEventIds(new Set(joinedRes.data.map(ev => ev.id)));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleSave = async (eventId) => {
    try {
      if (!currentUserId) {
        Alert.alert('Hata', 'Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.');
        return;
      }
      
      if (savedEventIds.has(eventId)) {
        await axios.delete(`${API_BASE_URL}/events/${eventId}/save`, { 
          data: { user_id: currentUserId } 
        });
        setSavedEventIds(prev => {
          const newSet = new Set([...prev]);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await axios.post(`${API_BASE_URL}/events/${eventId}/save`, { 
          user_id: currentUserId 
        });
        setSavedEventIds(prev => new Set([...prev, eventId]));
      }
    } catch (err) {
      Alert.alert('Kaydetme işlemi başarısız', err.response?.data?.error || err.message || 'İşlem başarısız.');
    }
  };

  const toggleJoin = async (eventId) => {
    try {
      if (!currentUserId) {
        Alert.alert('Hata', 'Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.');
        return;
      }
      
      if (joinedEventIds.has(eventId)) {
        await axios.delete(`${API_BASE_URL}/events/${eventId}/join`, { 
          data: { user_id: currentUserId } 
        });
        setJoinedEventIds(prev => {
          const newSet = new Set([...prev]);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await axios.post(`${API_BASE_URL}/events/${eventId}/join`, { 
          user_id: currentUserId 
        });
        setJoinedEventIds(prev => new Set([...prev, eventId]));
      }
      fetchData(); // Refresh data after join/leave
    } catch (err) {
      Alert.alert('Katılım işlemi başarısız', err.response?.data?.error || err.message || 'İşlem başarısız.');
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedStatus('all');
    setSelectedCategories([]);
    setCitySearchQuery('');
  };

  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const haystack = `${event.title} ${event.description} ${event.category || ''} ${event.location?.city || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    
    // City filter
    if (selectedCity !== 'all') {
      const city = event.location?.city || '';
      if (city !== selectedCity) return false;
    }
    
    // Status filter
    if (selectedStatus !== 'all') {
      const isJoined = joinedEventIds.has(event.id);
      if (selectedStatus === 'joined' && !isJoined) return false;
      if (selectedStatus === 'not-joined' && isJoined) return false;
    }
    
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(event.category)) {
      return false;
    }
    
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (activeCategory === 'Son Yüklenen') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (activeCategory === 'Yeni') {
      return new Date(b.date) - new Date(a.date);
    }
    if (activeCategory === 'Popüler') {
      return (b.participants?.length || 0) - (a.participants?.length || 0);
    }
    return 0;
  });

  const filteredClubs = clubs.filter(club => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const haystack = `${club.name} ${club.description} ${club.category || ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Akış yüklenemedi: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIconWrapper}>
          <Ionicons name="search" size={14} color={colors.text} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Etkinlik, kulüp, şehir ara..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.filterIconWrapper}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Category Buttons */}
      <View style={styles.categoryContainer}>
        {['Son Yüklenen', 'Yeni', 'Popüler', 'Hepsi'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              activeCategory === cat && styles.activeCategory
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === cat && styles.activeCategoryText
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Events Section */}
        {sortedEvents.map(event => (
          <View key={event.id} style={styles.eventCard}>
            <Image 
              source={{ uri: event.image_url || "https://placehold.co/400x200/23234B/fff?text=Etkinlik" }} 
              style={styles.eventImage} 
            />
            <View style={styles.eventOverlayTop}>
              <View style={styles.eventHeaderLeft}>
                <View style={styles.eventAvatar}>
                  <Ionicons name="person" size={14} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventLocation}>
                    {event.location?.city || '-'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.bookmarkBadgeLight}
                onPress={() => toggleSave(event.id)}
              >
                {savedEventIds.has(event.id) ? (
                  <BookmarkFilledIcon width={16} height={20} fill={colors.primary} />
                ) : (
                  <BookmarkIcon width={16} height={20} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.eventOverlayBottom}>
              <Text style={styles.eventDate}>
                {event.date ? new Date(event.date).toLocaleString("tr-TR", { 
                  dateStyle: "short", 
                  timeStyle: "short" 
                }) : ""}
              </Text>
              <TouchableOpacity 
                style={[
                  styles.joinButton,
                  joinedEventIds.has(event.id) && styles.joinedButton
                ]}
                onPress={() => toggleJoin(event.id)}
              >
                <Text style={styles.joinButtonText}>
                  {joinedEventIds.has(event.id) ? "Katıldın" : "Katıl"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Clubs Section */}
        {filteredClubs.length > 0 && (
          <Text style={styles.sectionTitle}>Kulüpler</Text>
        )}
        {filteredClubs.map(club => (
          <View key={club.id} style={styles.clubCard}>
            <View style={styles.clubHeader}>
              <Text style={styles.clubName}>{club.name}</Text>
              <Text style={styles.clubLocation}>{club.category || 'Genel'}</Text>
            </View>
            <View style={styles.clubDetails}>
              <Text style={styles.clubMeta}>{club.member_count || 0} üye</Text>
              <Text style={styles.clubMeta}>
                {events.filter(e => e.club_id === club.id).length} Etkinlik
              </Text>
            </View>
            <Text style={styles.clubDescription}>{club.description}</Text>
            <TouchableOpacity 
              style={styles.clubButton}
              onPress={() => navigation.navigate('ClubDetail', { clubId: club.id })}
            >
              <Text style={styles.clubButtonText}>Kulübe Git</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      const FilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtreler</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* City Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Şehir</Text>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={16} color={colors.text} style={styles.searchIcon} />
                <TextInput
                  style={styles.citySearchInput}
                  placeholder="Şehir ara..."
                  placeholderTextColor="#999"
                  value={citySearchQuery}
                  onChangeText={setCitySearchQuery}
                />
                {citySearchQuery !== '' && (
                  <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                    <Ionicons name="close-circle" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              <ScrollView 
                style={styles.cityScrollView}
                contentContainerStyle={styles.cityContainer}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                {FILTER_OPTIONS.filter(city => 
                  citySearchQuery === '' || 
                  city.label.toLowerCase().includes(citySearchQuery.toLowerCase())
                ).map(city => (
                  <TouchableOpacity
                    key={city.value}
                    style={[
                      styles.filterButton,
                      selectedCity === city.value && styles.filterButtonActive
                    ]}
                    onPress={() => setSelectedCity(city.value)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedCity === city.value && styles.filterButtonTextActive
                    ]}>
                      {city.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Durum</Text>
              <View style={styles.filterRow}>
                {STATUS_OPTIONS.map(status => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.filterButton,
                      selectedStatus === status.value && styles.filterButtonActive
                    ]}
                    onPress={() => setSelectedStatus(status.value)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedStatus === status.value && styles.filterButtonTextActive
                    ]}>
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Kategoriler</Text>
              <View style={styles.filterRow}>
                {CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.filterButton,
                      selectedCategories.includes(category.value) && styles.filterButtonActive
                    ]}
                    onPress={() => toggleCategory(category.value)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedCategories.includes(category.value) && styles.filterButtonTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.resetButton]}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Sıfırla</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.applyButton]}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 22,
    height: 44,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.text,
  },
  searchIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Nunito-Regular',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'Nunito-Bold',
  },
  activeCategoryText: {
    color: colors.white,
    fontFamily: 'Nunito-Bold',
  },
  scrollView: {
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  // Event card styles
  eventCard: {
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: colors.black,
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
    gap: 8,
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
  eventTitle: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  eventLocation: {
    color: colors.white,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
    fontFamily: 'Nunito-Bold',
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
  eventDate: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.9,
    fontFamily: 'Nunito-Bold',
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
    backgroundColor: colors.gray,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  // Club card styles
  clubCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
  },
  clubHeader: {
    marginBottom: 8,
  },
  clubName: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  clubLocation: {
    fontSize: 12,
    color: colors.gray,
    fontFamily: 'Nunito-Regular',
  },
  clubDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  clubMeta: {
    fontSize: 12,
    color: colors.text,
    marginRight: 16,
    fontFamily: 'Nunito-Regular',
  },
  clubDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Nunito-Regular',
  },
  clubButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  clubButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalScrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.text,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  citySearchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.text,
  },
  cityScrollView: {
    maxHeight: 150,
  },
  cityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.lightGray,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  resetButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  applyButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});