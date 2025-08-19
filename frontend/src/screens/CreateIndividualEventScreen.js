import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, FlatList, Dimensions, Modal, ActivityIndicator, Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, getCurrentUserId } from '../../auth';
import colors from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const cleanCategoryName = (name) => {
  const cleaned = name.toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s/g, '');
  return cleaned;
};

const SUBCATEGORIES = {
  genel: ['Duyuru', 'Toplantı', 'Sosyal Buluşma', 'Yardımlaşma', 'Tanışma', 'Diğer'],
  sanat: ['Resim', 'Heykel', 'Fotoğraf', 'Tiyatro', 'Sinema', 'Edebiyat', 'El Sanatları', 'Sergi', 'Workshop', 'Diğer'],
  yazilim: ['Frontend', 'Backend', 'Mobil Geliştirme', 'Oyun Programlama', 'Yapay Zeka', 'Veri Bilimi', 'Web Geliştirme', 'Siber Güvenlik', 'Diğer'],
  spor: ['Futbol', 'Basketbol', 'Voleybol', 'Tenis', 'Yüzme', 'Koşu', 'Fitness', 'Yoga', 'Doğa Sporları', 'E-Spor', 'Diğer'],
  kitap: ['Roman', 'Şiir', 'Kişisel Gelişim', 'Felsefe', 'Bilim Kurgu', 'Tartışma', 'Okuma Grubu', 'Yazar Buluşması', 'Diğer'],
  oyun: ['Bilgisayar Oyunları', 'Konsol Oyunları', 'Masaüstü Oyunlar', 'Mobil Oyunlar', 'Turnuva', 'Satranç', 'Zeka Oyunları', 'Diğer'],
  muzik: ['Rock', 'Pop', 'Caz', 'Klasik', 'Rap', 'Elektronik', 'Türk Halk', 'Enstrümantal', 'Konser', 'Jam Session', 'Diğer'],
  doga: ['Kamp', 'Doğa Yürüyüşü', 'Çevre Temizliği', 'Bahçe', 'Ekoloji', 'Hayvanlar', 'Gönüllülük', 'Diğer'],
  seyahat: ['Kültür Turu', 'Doğa Gezisi', 'Yurtdışı', 'Şehir Turu', 'Kamp', 'Gezi Planlama', 'Diğer'],
  yemek: ['Dünya Mutfağı', 'Tatlı', 'Vegan', 'Deniz Ürünleri', 'Hamur İşi', 'Mutfak Atölyesi', 'Yemek Yarışması', 'Diğer'],
  kisiselgelisim: ['Motivasyon', 'Psikoloji', 'Kariyer', 'Sağlık', 'Zihin Haritalama', 'Meditasyon', 'Workshop', 'Diğer'],
  bilim: ['Fizik', 'Kimya', 'Biyoloji', 'Matematik', 'Teknoloji', 'Astronomi', 'Bilim Sohbeti', 'Deney', 'Diğer'],
  tartisma: ['Güncel', 'Felsefe', 'Politika', 'Tarih', 'Toplumsal', 'Forum', 'Panel', 'Diğer'],
  diger: ['Diğer','Gönüllülük','Topluluk Etkinliği', 'Karma Etkinlik','Açık Mikrofon','Networking','Mentorluk','Lansman','Karma Workshop','Hobi','Eğlence','Sürpriz Etkinlik','Yılbaşı / Bayram',],
};

const CATEGORIES = [
  { name: ' Genel', icon: '🌟' },
  { name: ' Sanat', icon: '🎨' },
  { name: ' Yazılım', icon: '💻' },
  { name: ' Spor', icon: '⚽' },
  { name: ' Kitap', icon: '📚' },
  { name: ' Oyun', icon: '🎮' },
  { name: ' Müzik', icon: '🎵' },
  { name: ' Doğa', icon: '🌿' },
  { name: ' Seyahat', icon: '✈' },
  { name: ' Yemek', icon: '🍳' },
  { name: ' Kişisel Gelişim', icon: '🧘' },
  { name: ' Bilim', icon: '🧪' },
  { name: ' Tartışma', icon: '🗣' },
  { name: ' Diğer', icon: '🔗' },
];

export default function CreateIndividualEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cities, setCities] = useState([]);
  const [districtsByCity, setDistrictsByCity] = useState({});
  const [createdEvents, setCreatedEvents] = useState([]);
  const [userId, setUserId] = useState('');
  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    const loadCitiesAndDistricts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations`);
        setCities(response.data.cities);
        setDistrictsByCity(response.data.districtsByCity);
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

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await axios.get(`${API_BASE_URL}/events`);
      setCreatedEvents(response.data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const userId = await getCurrentUserId();
        const res = await axios.get(`${API_BASE_URL}/clubs`);
        setClubs(res.data.filter(club => String(club.creator_id) === String(userId)));
      } catch (e) {
        setClubs([]);
      }
    };
    loadClubs();
  }, []);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    const userId = await getCurrentUserId();
    if (!userId) {
      Alert.alert('Hata', 'Etkinlik oluşturmak için giriş yapmalısınız!');
      return;
    }
    if (!title.trim() || !city.trim() || !district.trim() || !place.trim() || !date || !time || !selectedCategory || !selectedSubcategory || !selectedClub) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun ve kategori ile kulüp seçin!');
      return;
    }
    setLoading(true);
    try {
      const eventData = {
        title,
        description,
        date: date.toISOString().slice(0, 10),
        time: time.toISOString().slice(11, 16),
        location_name: place,
        location_map: null,
        quota: 1,
        city,
        district,
        category: selectedCategory.name,
        subcategory: selectedSubcategory,
        image_url: image || '',
        creator_id: userId,
        club_id: selectedClub.id,
      };
      await axios.post(`${API_BASE_URL}/events`, eventData);
      Alert.alert('Başarılı', 'Etkinlik başarıyla oluşturuldu!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Etkinlik oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeriye erişmek için izin vermeniz gerekiyor.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const districts = city ? districtsByCity[city] || [] : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yeni Etkinlik Oluştur</Text>
      </View>

      {/* Image Upload */}
      <View style={styles.imageUploadContainer}>
        {image ? (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <View style={styles.imageOverlay}>
              <MaterialIcons name="edit" size={24} color={colors.white} />
              <Text style={styles.editImageText}>Fotoğrafı Değiştir</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
            <MaterialIcons name="add-a-photo" size={32} color={colors.primary} />
            <Text style={styles.uploadText}>Kapak Fotoğrafı Ekle</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Form Sections */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Etkinlik Bilgileri</Text>
        
        {/* Title */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Etkinlik Başlığı *</Text>
          <TextInput
            style={styles.input}
            placeholder="Başlık girin"
            placeholderTextColor={colors.gray}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Etkinlik hakkında bilgi verin"
            placeholderTextColor={colors.gray}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={300}
          />
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Konum Bilgileri</Text>
        
        {/* City and District */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.flex1, { marginRight: 8 }]}> 
            <Text style={styles.label}>Şehir *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={city}
                onValueChange={setCity}
                style={styles.picker}
                dropdownIconColor={colors.primary}
              >
                <Picker.Item label="Şehir seçin" value="" />
                {cities.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={[styles.inputContainer, styles.flex1, { marginLeft: 8 }]}> 
            <Text style={styles.label}>İlçe *</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={district}
                onValueChange={setDistrict}
                style={styles.picker}
                enabled={!!city}
                dropdownIconColor={colors.primary}
              >
                <Picker.Item label="İlçe seçin" value="" />
                {districts.map((d) => (
                  <Picker.Item key={d} label={d} value={d} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Place */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mekan *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mekan adı"
            placeholderTextColor={colors.gray}
            value={place}
            onChangeText={setPlace}
          />
        </View>
      </View>

      {/* Date and Time Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Tarih ve Saat</Text>
        
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.inputContainer, styles.flex1, styles.dateTimeButton, { marginRight: 8 }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>Tarih *</Text>
            <View style={styles.dateTimeValueRow}>
              <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateTimeValue}>{date.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.inputContainer, styles.flex1, styles.dateTimeButton, { marginLeft: 8 }]} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.label}>Saat *</Text>
            <View style={styles.dateTimeValueRow}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.dateTimeValue}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
            accentColor={colors.primary}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            accentColor={colors.primary}
          />
        )}
      </View>

      {/* Category Section */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Kategori Seçimi</Text>
        
        <Text style={styles.label}>Ana Kategori *</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat, idx) => (
            <TouchableOpacity
              key={cat.name}
              style={[
                styles.categoryButton,
                selectedCategory?.name === cat.name && styles.categorySelected,
              ]}
              onPress={() => handleCategorySelect(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory?.name === cat.name && styles.categoryTextSelected,
                ]}
              >
                {cat.icon} {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedCategory && SUBCATEGORIES[cleanCategoryName(selectedCategory.name)] && (
          <>
            <Text style={[styles.label, { marginTop: 16 }]}>Alt Kategori *</Text>
            <View style={styles.categoryContainer}>
              {SUBCATEGORIES[cleanCategoryName(selectedCategory.name)].map((sub) => (
                <TouchableOpacity
                  key={sub}
                  style={[
                    styles.categoryButton,
                    selectedSubcategory === sub && styles.categorySelected,
                  ]}
                  onPress={() => setSelectedSubcategory(sub)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedSubcategory === sub && styles.categoryTextSelected,
                    ]}
                  >
                    {sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Club Selection */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Kulüp Seçimi</Text>
        <TouchableOpacity 
          style={styles.selectButton} 
          onPress={() => setClubModalVisible(true)}
        >
          {selectedClub ? (
            <View style={styles.selectedClubContainer}>
              <Text style={styles.clubEmoji}>🏛</Text>
              <Text style={styles.selectedClubText}>{selectedClub.name}</Text>
            </View>
          ) : (
            <View style={styles.selectClubPlaceholder}>
              <Text style={styles.selectClubText}>Kulüp seçin *</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.gray} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Club Modal */}
      <Modal
        visible={clubModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setClubModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Kurucusu Olduğunuz Kulüpler</Text>
            {clubs.length === 0 ? (
              <Text style={styles.noClubText}>Kurucusu olduğunuz kulüp yok.</Text>
            ) : (
              <FlatList
                data={clubs}
                keyExtractor={item => item.id?.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedClub(item);
                      setClubModalVisible(false);
                    }}
                  >
                    <Text style={styles.clubEmojiModal}>🏛</Text>
                    <Text style={styles.clubNameModal}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setClubModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.createButtonText}>Etkinliği Oluştur</Text>
        )}
      </TouchableOpacity>

      {/* User's Created Events */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Oluşturduğunuz Etkinlikler</Text>
        {createdEvents.length === 0 ? (
          <Text style={styles.noEventText}>Henüz etkinlik oluşturmadınız.</Text>
        ) : (
          <FlatList
            data={createdEvents}
            keyExtractor={item => item.id?.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.eventImage} />
                ) : (
                  <View style={styles.eventImagePlaceholder}>
                    <MaterialIcons name="event" size={32} color={colors.primary} />
                  </View>
                )}
                <View style={styles.eventInfoContainer}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventMeta}>{item.city} / {item.district}</Text>
                  <Text style={styles.eventMeta}>{item.date} {item.time}</Text>
                  <Text style={styles.eventCategory}>{item.category}</Text>
                </View>
              </View>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          />
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
    paddingTop: 16,
  },
  content: { 
    padding: 16, 
    paddingBottom: 40 
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  imageUploadContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  imageUploadButton: {
    backgroundColor: colors.lightGray,
    height: screenWidth * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imagePreview: {
    width: '100%',
    height: screenWidth * 0.5,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.overlay,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageText: {
    color: colors.white,
    marginLeft: 8,
    fontWeight: '600',
  },
  uploadText: {
    color: colors.primary,
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: colors.secondary,
    fontSize: 15,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#eee',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedClubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedClubText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  clubEmoji: {
    marginRight: 8,
    fontSize: 18,
    color: colors.primary,
  },
  selectClubPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectClubText: {
    color: colors.gray,
    fontWeight: '600',
  },
  dateTimeButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  dateTimeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeValue: {
    marginLeft: 8,
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    maxHeight: '70%',
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: colors.secondary,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  clubEmojiModal: {
    fontSize: 20,
    marginRight: 12,
    color: colors.primary,
  },
  clubNameModal: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 16,
  },
  noClubText: {
    color: colors.gray,
    textAlign: 'center',
    marginVertical: 16,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  modalCloseButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categorySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 280,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  eventImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 2,
  },
  eventMeta: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: 2,
  },
  eventCategory: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  noEventText: {
    color: colors.gray,
    textAlign: 'center',
    marginVertical: 16,
  },
  // Additional styles from your reference
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
    borderColor: colors.lightGray,
  },
  searchIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  activeCategory: {
    backgroundColor: colors.primary,
  },
  activeCategoryText: {
    color: colors.white,
  },
  scrollView: {
    marginBottom: 60,
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
    fontWeight: 'bold',
  },
  clubCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  clubName: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clubButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  applyButton: {
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
});