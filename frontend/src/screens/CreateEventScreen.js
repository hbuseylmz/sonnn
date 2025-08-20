import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, FlatList, Dimensions, Modal, ActivityIndicator, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE_URL, getCurrentUserId } from '../../auth';
import colors from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

// Kategoriler ve alt kategoriler
const CATEGORIES = [
  { name: 'Genel', icon: '🌟', color: '#FFD700' },
  { name: 'Sanat', icon: '🎨', color: '#FF6347' },
  { name: 'Yazılım', icon: '💻', color: '#4682B4' },
  { name: 'Spor', icon: '⚽', color: '#32CD32' },
  { name: 'Kitap', icon: '📚', color: '#8B4513' },
  { name: 'Oyun', icon: '🎮', color: '#9370DB' },
  { name: 'Müzik', icon: '🎵', color: '#FF69B4' },
  { name: 'Doğa', icon: '🌿', color: '#228B22' },
  { name: 'Seyahat', icon: '✈️', color: '#4169E1' },
  { name: 'Yemek', icon: '🍳', color: '#CD853F' },
  { name: 'Kişisel Gelişim', icon: '🧠', color: '#9932CC' },
  { name: 'Bilim', icon: '🔬', color: '#20B2AA' },
  { name: 'Tartışma', icon: '💬', color: '#778899' },
  { name: 'Diğer', icon: '🔮', color: '#BA55D3' },
];

const SUBCATEGORIES = {
  genel: ['Duyuru', 'Toplantı', 'Sosyal Buluşma', 'Yardımlaşma', 'Tanışma', 'Diğer'],
  sanat: ['Resim', 'Heykel', 'Fotoğraf', 'Tiyatro', 'Sinema', 'Edebiyat', 'El Sanatları', 'Sergi', 'Workshop', 'Diğer'],
  yazilim: ['Frontend', 'Backend', 'Mobil', 'Oyun', 'Yapay Zeka', 'Veri Bilimi', 'Web', 'Siber Güvenlik', 'Diğer'],
  spor: ['Futbol', 'Basketbol', 'Voleybol', 'Tenis', 'Yüzme', 'Koşu', 'Fitness', 'Yoga', 'Doğa Sporları', 'E-Spor', 'Diğer'],
  kitap: ['Roman', 'Şiir', 'Kişisel Gelişim', 'Felsefe', 'Bilim Kurgu', 'Tartışma', 'Okuma Grubu', 'Yazar Buluşması', 'Diğer'],
  oyun: ['Bilgisayar', 'Konsol', 'Masaüstü', 'Mobil', 'Turnuva', 'Satranç', 'Zeka Oyunları', 'Diğer'],
  muzik: ['Rock', 'Pop', 'Caz', 'Klasik', 'Rap', 'Elektronik', 'Türk Halk', 'Enstrümantal', 'Konser', 'Jam Session', 'Diğer'],
  doga: ['Kamp', 'Doğa Yürüyüşü', 'Çevre Temizliği', 'Bahçe', 'Ekoloji', 'Hayvanlar', 'Gönüllülük', 'Diğer'],
  seyahat: ['Kültür Turu', 'Doğa Gezisi', 'Yurtdışı', 'Şehir Turu', 'Kamp', 'Gezi Planlama', 'Diğer'],
  yemek: ['Dünya Mutfağı', 'Tatlı', 'Vegan', 'Deniz Ürünleri', 'Hamur İşi', 'Mutfak Atölyesi', 'Yemek Yarışması', 'Diğer'],
  kisiselgelisim: ['Motivasyon', 'Psikoloji', 'Kariyer', 'Sağlık', 'Zihin Haritalama', 'Meditasyon', 'Workshop', 'Diğer'],
  bilim: ['Fizik', 'Kimya', 'Biyoloji', 'Matematik', 'Teknoloji', 'Astronomi', 'Bilim Sohbeti', 'Deney', 'Diğer'],
  tartisma: ['Güncel', 'Felsefe', 'Politika', 'Tarih', 'Toplumsal', 'Forum', 'Panel', 'Diğer'],
  diger: ['Gönüllülük', 'Topluluk Etkinliği', 'Karma Etkinlik', 'Açık Mikrofon', 'Networking', 'Mentorluk', 'Lansman', 'Workshop', 'Hobi', 'Eğlence', 'Sürpriz Etkinlik', 'Yılbaşı/Bayram'],
};

const CreateEventScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    district: '',
    place: '',
    date: new Date(),
    time: new Date(),
    category: null,
    subcategory: null,
    image: null,
    quota: '',
    price: '',
    isOnline: false,
    onlineLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtsByCity, setDistrictsByCity] = useState({});
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // Şehir ve ilçe verilerini yükle (şehirler ve ilçe haritası)

  // Kullanıcının kurucusu olduğu kulüpleri yükle
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const userId = await getCurrentUserId();
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/clubs`);
        setClubs(response.data);
      } catch (error) {
        console.error('Kulüpler yüklenirken hata:', error);
      }
    };
    loadClubs();
  }, []);

  // Seçilen şehre göre ilçeleri yükle
  useEffect(() => {
    const loadCitiesAndDistricts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations`);
        setCities(response.data.cities);
        setDistrictsByCity(response.data.districtsByCity || {});
      } catch (error) {
        setCities([
          "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan",
          "Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis",
          "Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce",
          "Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane",
          "Hakkari","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük",
          "Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir","Kilis",
          "Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş",
          "Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop",
          "Sivas","Şanlıurfa","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak",
          "Van","Yalova","Yozgat","Zonguldak"
        ]);
        setDistrictsByCity({
          "Adana": ["Aladağ","Ceyhan","Çukurova","Feke","İmamoğlu","Karaisalı","Saimbeyli","Sarıçam","Seyhan","Tufanbeyli","Yumurtalık","Yüreğir"].sort(), "Adıyaman": ["Besni","Çelikhan","Gerger","Gölbaşı","Kahta","Samsat","Sincik","Tut"].sort(), "Afyonkarahisar": ["Başmakçı","Bayat","Bolvadin","Çay","Çobanlar","Dazkırı","Dinar","Emirdağ","Evciler","Hocalar","İhsaniye","İscehisar","Kızılören","Sandıklı","Sinanpaşa","Sultandağı","Şuhut"].sort(), "Ağrı": ["Diyadin","Doğubayazıt","Eleşkirt","Hamur","Patnos","Taşlıçay","Tutak"].sort(), "Aksaray": ["Ağaçören","Eskil","Gülağaç","Güzelyurt","Ortaköy","Sarıyahşi"].sort(), "Amasya": ["Göynücek","Gümüşhacıköy","Hamamözü","Merzifon","Suluova","Taşova"].sort(), "Ankara": ["Akyurt","Altındağ","Ayaş","Bala","Çamlıdere","Çankaya","Çubuk","Elmadağ","Etimesgut","Gölbaşı","Güdül","Haymana","Kazan","Kalecik","Keçiören","Kızılcahamam","Mamak","Nallıhan","Polatlı","Sincan","Şereflikoçhisar","Yenimahalle"].sort(), "Antalya": ["Akseki","Alanya","Döşemealtı","Elmalı","Finike","Gazipaşa","Gündoğmuş","İbradı","Kaş","Kemer","Konyaaltı","Korkuteli","Kumluca","Manavgat","Serik"].sort(), "Ardahan": ["Çıldır","Damal","Göle","Hanak","Posof"].sort(), "Artvin": ["Ardanuç","Arhavi","Borçka","Hopa","Murgul","Şavşat","Yusufeli"].sort(), "Aydın": ["Bozdoğan","Buharkent","Çine","Didim","Efeler","Germencik","İncirliova","Karacasu","Karpuzlu","Koçarlı","Kuşadası","Kuyucak","Nazilli","Söke","Sultanhisar","Yenipazar"].sort(), "Balıkesir": ["Altıeylül","Ayvalık","Balya","Bandırma","Bigadiç","Burhaniye","Dursunbey","Edremit","Erdek","Gömeç","Gönen","Havran","İvrindi","Karesi","Kepsut","Manyas","Marmara","Savaştepe","Sındırgı"].sort(), "Bartın": ["Amasra","Kurucaşile","Ulus"].sort(), "Batman": ["Beşiri","Gercüş","Hasankeyf","Kozluk","Sason"].sort(), "Bayburt": ["Aydıntepe","Demirözü"].sort(), "Bilecik": ["Bozüyük","Gölpazarı","Osmaneli","Pazaryeri","Söğüt","Yenipazar"].sort(), "Bingöl": ["Adaklı","Genç","Karlıova","Kiğı","Solhan","Yayladere","Yedisu"].sort(), "Bitlis": ["Adilcevaz","Ahlat","Güroymak","Hizan","Mutki","Tatvan"].sort(), "Bolu": ["Dörtdivan","Gerede","Göynük","Kıbrıscık","Mengen","Mudurnu","Seben","Yeniçağa"].sort(), "Burdur": ["Ağlasun","Bucak","Çavdır","Çeltikçi","Gölhisar","Karamanlı","Kemer","Tefenni","Yeşilova"].sort(), "Bursa": ["Gemlik","İnegöl","İznik","Karacabey","Keles","Mudanya","Mustafakemalpaşa","Nilüfer","Orhaneli","Orhangazi","Osmangazi","Yenişehir","Yıldırım"].sort(), "Çanakkale": ["Ayvacık","Bayramiç","Biga","Bozcaada","Çan","Eceabat","Ezine","Gelibolu","Gökçeada","Lapseki","Yenice"].sort(), "Çankırı": ["Atkaracalar","Bayramören","Çerkeş","Eldivan","Ilgaz","Kızılırmak","Korgun","Kurşunlu","Orta","Şabanözü","Yapraklı"].sort(), "Çorum": ["Alaca","Bayat","Boğazkale","Dodurga","İskilip","Kargı","Laçin","Mecitözü","Ortaköy","Osmancık","Sungurlu","Uğurludağ"].sort(), "Denizli": ["Acıpayam","Babadağ","Baklan","Bekilli","Buldan","Çal","Çameli","Çardak","Çivril","Güney","Honaz","Kale","Sarayköy","Serinhisar","Tavas"].sort(), "Diyarbakır": ["Bağlar","Bismil","Çermik","Çınar","Çüngüş","Dicle","Eğil","Ergani","Hani","Hazro","Kulp","Lice","Silvan","Sur"].sort(), "Düzce": ["Akçakoca","Cumayeri","Çilimli","Gölyaka","Gümüşova","Kaynaşlı","Yığılca"].sort(), "Edirne": ["Enez","Havsa","İpsala","Lalapaşa","Meriç","Süloğlu","Uzunköprü"].sort(), "Elazığ": ["Ağın","Alacakaya","Arıcak","Baskil","Karakoçan","Keban","Maden","Palu","Sivrice"].sort(), "Erzincan": ["Çayırlı","İliç","Kemah","Kemaliye","Refahiye","Tercan","Üzümlü"].sort(), "Erzurum": ["Aşkale","Aziziye","Çat","Hınıs","Horasan","İspir","Karayazı","Karaçoban","Narman","Olur","Pasinler","Şenkaya","Tekman","Tortum","Uzundere"].sort(), "Eskişehir": ["Alpu","Beylikova","Çifteler","Günyüzü","Han","İnönü","Mahmudiye","Mihalgazi","Mihalıççık","Odunpazarı","Sarıcakaya","Tepebaşı"].sort(), "Gaziantep": ["Araban","İslahiye","Nizip","Oğuzeli","Yavuzeli"].sort(), "Giresun": ["Alucra","Bulancak","Çamoluk","Çanakçı","Dereli","Doğankent","Espiye","Eynesil","Görele","Güce","Keşap","Piraziz","Şebinkarahisar","Tirebolu","Yağlıdere"].sort(), "Gümüşhane": ["Kelkit","Köse","Şiran","Torul"].sort(), "Hakkari": ["Çukurca","Şemdinli","Yüksekova"].sort(), "Hatay": ["Altınözü","Arsuz","Defne","Dörtyol","Erzin","Hassa","İskenderun","Kırıkhan","Payas","Reyhanlı","Samandağ","Yayladağı"].sort(), "Iğdır": ["Aralık","Karakoyunlu","Tuzluca"].sort(), "Isparta": ["Aksu","Atabey","Eğirdir","Gelendost","Gönen","Senirkent","Sütçüler","Şarkikaraağaç","Uluborlu","Yalvaç","Yenişarbademli"].sort(), "İstanbul": ["Adalar","Arnavutköy","Ataşehir","Avcılar","Bağcılar","Bahçelievler","Bakırköy","Başakşehir","Bayrampaşa","Beşiktaş","Beykoz","Beylikdüzü","Beyoğlu","Büyükçekmece","Çatalca","Çekmeköy","Esenler","Esenyurt","Eyüpsultan","Fatih","Gaziosmanpaşa","Güngören","Kadıköy","Kağıthane","Kartal","Küçükçekmece","Maltepe","Pendik","Sancaktepe","Sarıyer","Silivri","Sultanbeyli","Sultangazi","Şile","Şişli","Tuzla","Ümraniye","Üsküdar","Zeytinburnu"].sort(), "İzmir": ["Aliağa","Balçova","Bayındır","Bayraklı","Bergama","Beydağ","Bornova","Buca","Çeşme","Çiğli","Dikili","Foça","Gaziemir","Güzelbahçe","Karabağlar","Karşıyaka","Kınık","Kiraz","Konak","Menderes","Menemen","Narlıdere","Ödemiş","Seferihisar","Selçuk","Tire","Torbalı","Urla"].sort(), "Kahramanmaraş": ["Afşin","Andırın","Çağlayancerit","Dulkadiroğlu","Ekinözü","Elbistan","Göksun","Onikişubat","Pazarcık","Türkoğlu"].sort(), "Karabük": ["Eflani","Eskipazar","Ovacık","Safranbolu","Yenice"].sort(), "Karaman": ["Ayrancı","Başyayla","Ermenek","Kazımkarabekir"].sort(), "Kars": ["Akyaka","Arpaçay","Digor","Kağızman","Sarıkamış","Selim","Susuz"].sort(), "Kastamonu": ["Abana","Ağlı","Araç","Azdavay","Bozkurt","Cide","Çatalzeytin","Daday","Devrekani","Doğanyurt","Hanönü","İnebolu","İhsangazi","Küre","Pınarbaşı","Şenpazar","Taşköprü","Tosya"].sort(), "Kayseri": ["Akkışla","Bünyan","Develi","Felahiye","İncesu","Kocasinan","Melikgazi","Özvatan","Sarıoğlan","Sarız","Talas","Tomarza","Yahyalı","Yeşilhisar"].sort(), "Kırıkkale": ["Bahşili","Balışeyh","Çelebi","Delice","Karakeçili","Sulakyurt","Yahşihan"].sort(), "Kırklareli": ["Babaeski","Demirköy","Kofçaz","Lüleburgaz","Pehlivanköy","Pınarhisar","Vize"].sort(), "Kırşehir": ["Akçakent","Akpınar","Boztepe","Çiçekdağı","Kaman","Mucur"].sort(), "Kilis": ["Elbeyli","Musabeyli","Polateli"].sort(), "Kocaeli": ["Başiskele","Çayırova","Darıca","Derince","Dilovası","Gebze","Gölcük","Kandıra","Kartepe","Körfez"].sort(), "Konya": ["Akşehir","Beyşehir","Bozkır","Cihanbeyli","Çumra","Derbent","Derebucak","Doğanhisar","Emirgazi","Ereğli","Güneysınır","Hadim","Ilgın","Kadınhanı","Karatay","Kulu","Meram","Sarayönü","Selçuklu","Seydişehir","Taşkent","Yalıhüyük","Yunak"].sort(), "Kütahya": ["Altıntaş","Aslanapa","Çavdarhisar","Domaniç","Emet","Gediz","Hisarcık","Pazarlar","Şaphane","Simav","Tavşanlı"].sort(), "Malatya": ["Akçadağ","Arapgir","Arguvan","Battalgazi","Darende","Doğanşehir","Hekimhan","Kale","Kuluncak","Pütürge","Yazıhan","Yeşilyurt"].sort(), "Manisa": ["Ahmetli","Akhisar","Alaşehir","Demirci","Gördes","Kırkağaç","Kula","Salihli","Sarıgöl","Saruhanlı","Selendi","Soma","Turgutlu","Yunusemre"].sort(), "Mardin": ["Dargeçit","Derik","Kızıltepe","Mazıdağı","Midyat","Nusaybin","Ömerli","Savur"].sort(), "Mersin": ["Akdeniz","Anamur","Aydıncık","Bozyazı","Çamlıyayla","Erdemli","Gülnar","Mezitli","Mut","Silifke","Tarsus","Toroslar","Yenişehir"].sort(), "Muğla": ["Bodrum","Dalaman","Datça","Fethiye","Kavaklıdere","Marmaris","Menteşe","Ortaca","Ula","Yatağan"].sort(), "Muş": ["Bulanık","Hasköy","Korkut","Malazgirt","Varto"].sort(), "Nevşehir": ["Acıgöl","Avanos","Derinkuyu","Gülşehir","Hacıbektaş","Kozaklı","Nevşehir"].sort(), "Niğde": ["Altunhisar","Bor","Çamardı","Niğde"].sort(), "Ordu": ["Akkuş","Altınordu","Aybastı","Fatsa","Gölköy","Gülyalı","Gürgentepe","İkizce","Kabadüz","Kabataş","Korgan","Kumru","Mesudiye","Perşembe","Ulubey","Ünye"].sort(), "Osmaniye": ["Bahçe","Düziçi","Hasanbeyli","Kadirli","Sumbas","Toprakkale"].sort(), "Rize": ["Ardeşen","Çamlıhemşin","Çayeli","Derepazarı","Fındıklı","Güneysu","İkizdere","Kalkandere","Pazar"].sort(), "Sakarya": ["Adapazarı","Akyazı","Arifiye","Erenler","Ferizli","Geyve","Hendek","Karapürçek","Karasu","Kaynarca","Kocaali","Pamukova","Sapanca","Serdivan","Söğütlü","Taraklı"].sort(), "Samsun": ["Alaçam","Asarcık","Atakum","Ayvacık","Bafra","Çarşamba","Havza","Kavak","Ladik","Ondokuzmayıs","Salıpazarı","Tekkeköy","Terme","Vezirköprü","Yakakent"].sort(), "Siirt": ["Baykan","Eruh","Kurtalan","Pervari","Şirvan"].sort(), "Sinop": ["Ayancık","Boyabat","Dikmen","Durağan","Erfelek","Gerze","Saraydüzü"].sort(), "Sivas": ["Akıncılar","Altınyayla","Divriği","Doğanşar","Gölova","Gürün","Hafik","İmranlı","Kangal","Koyulhisar","Suşehri","Şarkışla","Ulaş","Yıldızeli","Zara"].sort(), "Şanlıurfa": ["Akçakale","Birecik","Bozova","Ceylanpınar","Halfeti","Haliliye","Harran","Hilvan","Siverek","Suruç","Viranşehir"].sort(), "Şırnak": ["Beytüşşebap","Cizre","Güçlükonak","İdil","Silopi","Uludere"].sort(), "Tekirdağ": ["Çerkezköy","Çorlu","Hayrabolu","Malkara","Marmaraereğlisi","Muratlı","Saray","Şarköy"].sort(), "Tokat": ["Almus","Artova","Başçiftlik","Erbaa","Niksar","Pazar","Reşadiye","Sulusaray","Turhal","Yeşilyurt","Zile"].sort(), "Trabzon": ["Akçaabat","Araklı","Arsin","Çarşıbaşı","Çaykara","Dernekpazarı","Düzköy","Hayrat","Köprübaşı","Maçka","Of","Ortahisar","Şalpazarı","Sürmene","Tonya","Vakfıkebir","Yomra"].sort(), "Tunceli": ["Çemişgezek","Hozat","Mazgirt","Nazımiye","Ovacık","Pertek","Pülümür"].sort(), "Uşak": ["Banaz","Eşme","Karahallı","Sivaslı","Ulubey"].sort(), "Van": ["Başkale","Çaldıran","Çatak","Edremit","Erciş","Gevaş","Gürpınar","İpekyolu","Muradiye","Özalp","Tuşba"].sort(), "Yalova": ["Altınova","Armutlu","Çınarcık","Çiftlikköy","Termal"].sort(), "Yozgat": ["Akdağmadeni","Aydıncık","Boğazlıyan","Çandır","Çayıralan","Çekerek","Sarıkaya","Saraykent","Sorgun","Şefaatli","Yerköy"].sort(), "Zonguldak": ["Alaplı","Çaycuma","Devrek","Ereğli","Gökçebey"].sort(),
        });
      }
    };
    loadCitiesAndDistricts();
  }, []);

  // Şehir seçildiğinde ilçeleri güncelle ve ilçe seçimini sıfırla
  useEffect(() => {
    if (formData.city) {
      const availableDistricts = districtsByCity[formData.city] || [];
      setDistricts(availableDistricts);
      if (!availableDistricts.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: '' }));
      }
    } else {
      setDistricts([]);
      if (formData.district) {
        setFormData(prev => ({ ...prev, district: '' }));
      }
    }
  }, [formData.city, districtsByCity]);

  const handleCityChange = (value) => {
    handleInputChange('city', value);
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('date', selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      handleInputChange('time', selectedTime);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin gerekli', 'Fotoğraf seçmek için galeri izni gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleInputChange('image', result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload image if it is a local file URI
      let imageUrl = formData.image || '';
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        // Convert to base64 using fetch
        const resp = await fetch(imageUrl);
        const blob = await resp.blob();
        const reader = new FileReader();
        const base64Data = await new Promise((resolve, reject) => {
          reader.onerror = reject;
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        const uploadRes = await axios.post(`${API_BASE_URL}/media/upload`, { dataUri: base64Data });
        // Store relative path from backend
        imageUrl = uploadRes.data?.url || uploadRes.data?.path || '';
      }
      const userId = await getCurrentUserId();
      const eventData = {
        club_id: selectedClub?.id,
        title: formData.title?.trim(),
        description: formData.description?.trim() || '',
        date: formData.date.toISOString().split('T')[0],
        time: formData.time.toTimeString().slice(0, 5),
        location_name: formData.place?.trim(),
        location_map: null,
        quota: formData.quota ? Number(formData.quota) : 1,
        city: formData.city,
        district: formData.district,
        category: formData.category?.name,
        image_url: imageUrl,
        creator_id: userId,
      };

      await axios.post(`${API_BASE_URL}/events`, eventData);
      Alert.alert('Başarılı', 'Etkinlik başarıyla oluşturuldu!');
      navigation.goBack();
    } catch (error) {
      console.error('Etkinlik oluşturulurken hata:', error);
      Alert.alert('Hata', 'Etkinlik oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'title', 'city', 'district', 'place', 'date', 'time', 
      'category', 'subcategory', 'image'
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (field === 'category' || field === 'subcategory') {
        return !formData[field];
      }
      return !formData[field]?.toString().trim();
    });

    if (missingFields.length > 0) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
      return false;
    }

    if (!selectedClub) {
      Alert.alert('Kulüp Seçimi', 'Lütfen bu etkinlik için bir kulüp seçin.');
      return false;
    }

    return true;
  };

  const cleanCategoryName = (name) => {
    return name.toLowerCase()
      .replace(/i̇/g, 'i')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s/g, '');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni Etkinlik Oluştur</Text>
      </View>

      {/* Resim Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Etkinlik Resmi</Text>
        {formData.image ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: formData.image }} style={styles.eventImage} />
            <View style={styles.imageOverlay}>
              <MaterialIcons name="edit" size={24} color="white" />
              <Text style={styles.editText}>Resmi Değiştir</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.imageUploadButton} 
            onPress={pickImage}
          >
            <MaterialIcons name="add-a-photo" size={32} color={colors.primary} />
            <Text style={styles.uploadText}>Kapak Resmi Ekle</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Temel Bilgiler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Etkinlik Bilgileri</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Etkinlik Başlığı *</Text>
          <TextInput
            style={styles.input}
            placeholder="Etkinlik başlığını girin"
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Etkinlik açıklaması..."
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>
      </View>

      {/* Kategori Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategori *</Text>
        
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryButton,
                formData.category?.name === category.name && {
                  backgroundColor: category.color,
                  borderColor: category.color
                }
              ]}
              onPress={() => handleInputChange('category', category)}
            >
              <Text style={[
                styles.categoryText,
                formData.category?.name === category.name && styles.selectedCategoryText
              ]}>
                {category.icon} {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {formData.category && (
          <>
            <Text style={[styles.label, { marginTop: 15 }]}>Alt Kategori *</Text>
            <View style={styles.subcategoryContainer}>
              {SUBCATEGORIES[cleanCategoryName(formData.category.name)].map(sub => (
                <TouchableOpacity
                  key={sub}
                  style={[
                    styles.subcategoryButton,
                    formData.subcategory === sub && {
                      backgroundColor: formData.category.color
                    }
                  ]}
                  onPress={() => handleInputChange('subcategory', sub)}
                >
                  <Text style={[
                    styles.subcategoryText,
                    formData.subcategory === sub && styles.selectedSubcategoryText
                  ]}>
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Konum Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Konum</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Şehir *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.city}
                onValueChange={(value) => handleCityChange(value)}
              >
                <Picker.Item label="Şehir seçin" value="" />
                {cities.map(city => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>İlçe *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.district}
                onValueChange={(value) => handleInputChange('district', value)}
                enabled={!!formData.city}
              >
                <Picker.Item label="İlçe seçin" value="" />
                {districts.map(district => (
                  <Picker.Item key={district} label={district} value={district} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mekan Adı *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mekan adını girin"
            value={formData.place}
            onChangeText={(text) => handleInputChange('place', text)}
          />
        </View>

        <TouchableOpacity 
          style={styles.onlineToggle}
          onPress={() => handleInputChange('isOnline', !formData.isOnline)}
        >
          <MaterialIcons 
            name={formData.isOnline ? 'toggle-on' : 'toggle-off'} 
            size={40} 
            color={formData.isOnline ? colors.primary : colors.gray} 
          />
          <Text style={styles.onlineLabel}>Online Etkinlik</Text>
        </TouchableOpacity>

        {formData.isOnline && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Online Bağlantı Linki *</Text>
            <TextInput
              style={styles.input}
              placeholder="https://meet.google.com/..."
              value={formData.onlineLink}
              onChangeText={(text) => handleInputChange('onlineLink', text)}
            />
          </View>
        )}
      </View>

      {/* Tarih & Saat Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tarih & Saat *</Text>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.dateTimeButton, { flex: 1, marginRight: 10 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Tarih</Text>
            <View style={styles.dateTimeValue}>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>
                {formData.date.toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.dateTimeButton, { flex: 1 }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.label}>Saat</Text>
            <View style={styles.dateTimeValue}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.dateTimeText}>
                {formData.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={formData.time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>

      {/* Kulüp Seçimi */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kulüp *</Text>
        <TouchableOpacity 
          style={styles.clubSelectButton}
          onPress={() => setClubModalVisible(true)}
        >
          {selectedClub ? (
            <View style={styles.selectedClub}>
              <Text style={styles.clubEmoji}>🏛</Text>
              <Text style={styles.clubName}>{selectedClub.name}</Text>
            </View>
          ) : (
            <Text style={styles.selectClubText}>Kulüp seçin</Text>
          )}
          <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Ek Seçenekler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ek Seçenekler</Text>
        
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Katılımcı Limiti</Text>
            <TextInput
              style={styles.input}
              placeholder="Boş bırakılırsa sınırsız"
              value={formData.quota}
              onChangeText={(text) => handleInputChange('quota', text)}
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Bilet Fiyatı (₺)</Text>
            <TextInput
              style={styles.input}
              placeholder="Boş bırakılırsa ücretsiz"
              value={formData.price}
              onChangeText={(text) => handleInputChange('price', text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Gönder Butonu */}
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Etkinlik Oluştur</Text>
        )}
      </TouchableOpacity>

      {/* Kulüp Seçim Modalı */}
      <Modal
        visible={clubModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setClubModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Kulüp Seçin</Text>
            <TouchableOpacity onPress={() => setClubModalVisible(false)}>
              <MaterialIcons name="close" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>
          
          {clubs.length > 0 ? (
            <FlatList
              data={clubs}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.clubItem}
                  onPress={() => {
                    setSelectedClub(item);
                    setClubModalVisible(false);
                  }}
                >
                  <Text style={styles.clubEmoji}>🏛</Text>
                  <View style={styles.clubInfo}>
                    <Text style={styles.clubName}>{item.name}</Text>
                    <Text style={styles.clubCategory}>{item.category}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <View style={styles.noClubsContainer}>
              <Text style={styles.noClubsText}>Henüz bir kulübünüz yok.</Text>
              <TouchableOpacity 
                style={styles.createClubButton}
                onPress={() => {
                  setClubModalVisible(false);
                  navigation.navigate('CreateClub');
                }}
              >
                <Text style={styles.createClubButtonText}>Yeni Kulüp Oluştur</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  editText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  imageUploadButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: '500',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subcategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subcategoryButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  subcategoryText: {
    fontSize: 13,
    color: colors.text,
  },
  selectedSubcategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dateTimeButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  onlineLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  clubSelectButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedClub: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clubEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  clubName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  selectClubText: {
    fontSize: 16,
    color: colors.gray,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  clubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  clubInfo: {
    marginLeft: 12,
  },
  clubCategory: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
  },
  noClubsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noClubsText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
  },
  createClubButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
  },
  createClubButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;