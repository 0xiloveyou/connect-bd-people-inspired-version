export type CitySeed = {
  slug: string;
  name: string;
  nameBn: string;
  country: string;
  countryBn: string;
  countryCode: string;
  lat: number;
  lng: number;
  /** Relative seeding weight used to generate a believable diaspora distribution. */
  weight: number;
};

export const cities: CitySeed[] = [
  // Saudi Arabia
  { slug: "riyadh", name: "Riyadh", nameBn: "রিয়াদ", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 24.7136, lng: 46.6753, weight: 18 },
  { slug: "jeddah", name: "Jeddah", nameBn: "জেদ্দা", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 21.4858, lng: 39.1925, weight: 8 },
  { slug: "dammam", name: "Dammam", nameBn: "দাম্মাম", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 26.4207, lng: 50.0888, weight: 8 },
  { slug: "mecca", name: "Mecca", nameBn: "মক্কা", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 21.3891, lng: 39.8579, weight: 4 },
  { slug: "medina", name: "Medina", nameBn: "মদিনা", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 24.4672, lng: 39.6111, weight: 4 },
  { slug: "abha", name: "Abha", nameBn: "আবহা", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 18.2164, lng: 42.5053, weight: 3 },
  { slug: "al-jubayl", name: "Al Jubayl", nameBn: "আল জুবাইল", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 27.0046, lng: 49.6583, weight: 2 },
  { slug: "khobar", name: "Khobar", nameBn: "খোবার", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 26.2172, lng: 50.1971, weight: 2 },
  { slug: "taif", name: "Taif", nameBn: "তায়েফ", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 21.2703, lng: 40.4158, weight: 1 },
  { slug: "buraidah", name: "Buraidah", nameBn: "বুরাইদাহ", country: "Saudi Arabia", countryBn: "সৌদি আরব", countryCode: "SA", lat: 26.326, lng: 43.975, weight: 1 },

  // UAE
  { slug: "dubai", name: "Dubai", nameBn: "দুবাই", country: "United Arab Emirates", countryBn: "আমিরাত", countryCode: "AE", lat: 25.2048, lng: 55.2708, weight: 6 },
  { slug: "abu-dhabi", name: "Abu Dhabi", nameBn: "আবুধাবি", country: "United Arab Emirates", countryBn: "আমিরাত", countryCode: "AE", lat: 24.4539, lng: 54.3773, weight: 3 },
  { slug: "sharjah", name: "Sharjah", nameBn: "শারজাহ", country: "United Arab Emirates", countryBn: "আমিরাত", countryCode: "AE", lat: 25.3463, lng: 55.4209, weight: 2 },
  { slug: "al-ain", name: "Al Ain", nameBn: "আল আইন", country: "United Arab Emirates", countryBn: "আমিরাত", countryCode: "AE", lat: 24.2075, lng: 55.7447, weight: 1 },

  // Qatar, Kuwait, Bahrain, Oman
  { slug: "doha", name: "Doha", nameBn: "দোহা", country: "Qatar", countryBn: "কাতার", countryCode: "QA", lat: 25.2854, lng: 51.531, weight: 6 },
  { slug: "al-wakrah", name: "Al Wakrah", nameBn: "আল ওয়াক্রাহ", country: "Qatar", countryBn: "কাতার", countryCode: "QA", lat: 25.1659, lng: 51.5975, weight: 1 },
  { slug: "kuwait-city", name: "Kuwait City", nameBn: "কুয়েত সিটি", country: "Kuwait", countryBn: "কুয়েত", countryCode: "KW", lat: 29.3759, lng: 47.9774, weight: 3 },
  { slug: "manama", name: "Manama", nameBn: "মানামা", country: "Bahrain", countryBn: "বাহরাইন", countryCode: "BH", lat: 26.2285, lng: 50.586, weight: 2 },
  { slug: "muscat", name: "Muscat", nameBn: "মাস্কাট", country: "Oman", countryBn: "ওমান", countryCode: "OM", lat: 23.588, lng: 58.3829, weight: 2 },
  { slug: "salalah", name: "Salalah", nameBn: "সালালাহ", country: "Oman", countryBn: "ওমান", countryCode: "OM", lat: 17.0151, lng: 54.0924, weight: 1 },

  // South-East Asia
  { slug: "kuala-lumpur", name: "Kuala Lumpur", nameBn: "কুয়ালালামপুর", country: "Malaysia", countryBn: "মালয়েশিয়া", countryCode: "MY", lat: 3.139, lng: 101.6869, weight: 5 },
  { slug: "kajang", name: "Kajang", nameBn: "কাজাং", country: "Malaysia", countryBn: "মালয়েশিয়া", countryCode: "MY", lat: 2.9927, lng: 101.7909, weight: 2 },
  { slug: "penang", name: "Penang", nameBn: "পেনাং", country: "Malaysia", countryBn: "মালয়েশিয়া", countryCode: "MY", lat: 5.4141, lng: 100.3288, weight: 1 },
  { slug: "johor-bahru", name: "Johor Bahru", nameBn: "জোহর বাহরু", country: "Malaysia", countryBn: "মালয়েশিয়া", countryCode: "MY", lat: 1.4927, lng: 103.7414, weight: 1 },
  { slug: "singapore", name: "Singapore", nameBn: "সিঙ্গাপুর", country: "Singapore", countryBn: "সিঙ্গাপুর", countryCode: "SG", lat: 1.3521, lng: 103.8198, weight: 5 },
  { slug: "male", name: "Malé", nameBn: "মালে", country: "Maldives", countryBn: "মালদ্বীপ", countryCode: "MV", lat: 4.1755, lng: 73.5093, weight: 2 },
  { slug: "bangkok", name: "Bangkok", nameBn: "ব্যাংকক", country: "Thailand", countryBn: "থাইল্যান্ড", countryCode: "TH", lat: 13.7563, lng: 100.5018, weight: 2 },
  { slug: "tokyo", name: "Tokyo", nameBn: "টোকিও", country: "Japan", countryBn: "জাপান", countryCode: "JP", lat: 35.6762, lng: 139.6503, weight: 2 },
  { slug: "osaka", name: "Osaka", nameBn: "ওসাকা", country: "Japan", countryBn: "জাপান", countryCode: "JP", lat: 34.6937, lng: 135.5023, weight: 1 },
  { slug: "kumamoto", name: "Kumamoto", nameBn: "কুমামোতো", country: "Japan", countryBn: "জাপান", countryCode: "JP", lat: 32.8031, lng: 130.7079, weight: 1 },
  { slug: "nagoya", name: "Nagoya", nameBn: "নাগোয়া", country: "Japan", countryBn: "জাপান", countryCode: "JP", lat: 35.1815, lng: 136.9066, weight: 1 },
  { slug: "seoul", name: "Seoul", nameBn: "সিউল", country: "South Korea", countryBn: "দক্ষিণ কোরিয়া", countryCode: "KR", lat: 37.5665, lng: 126.978, weight: 2 },
  { slug: "guangzhou", name: "Guangzhou", nameBn: "গুয়াংজু", country: "China", countryBn: "চীন", countryCode: "CN", lat: 23.1291, lng: 113.2644, weight: 1 },
  { slug: "shenzhen", name: "Shenzhen", nameBn: "শেনচেন", country: "China", countryBn: "চীন", countryCode: "CN", lat: 22.5431, lng: 114.0579, weight: 1 },
  { slug: "harbin", name: "Harbin", nameBn: "হারবিন", country: "China", countryBn: "চীন", countryCode: "CN", lat: 45.8038, lng: 126.5349, weight: 1 },
  { slug: "beijing", name: "Beijing", nameBn: "বেইজিং", country: "China", countryBn: "চীন", countryCode: "CN", lat: 39.9042, lng: 116.4074, weight: 1 },
  { slug: "hong-kong", name: "Hong Kong", nameBn: "হংকং", country: "Hong Kong", countryBn: "হংকং", countryCode: "HK", lat: 22.3193, lng: 114.1694, weight: 1 },
  { slug: "taipei", name: "Taipei", nameBn: "তাইপেই", country: "Taiwan", countryBn: "তাইওয়ান", countryCode: "TW", lat: 25.033, lng: 121.5654, weight: 1 },

  // South Asia
  { slug: "new-delhi", name: "New Delhi", nameBn: "নয়াদিল্লি", country: "India", countryBn: "ভারত", countryCode: "IN", lat: 28.6139, lng: 77.209, weight: 1 },
  { slug: "mumbai", name: "Mumbai", nameBn: "মুম্বাই", country: "India", countryBn: "ভারত", countryCode: "IN", lat: 19.076, lng: 72.8777, weight: 1 },
  { slug: "kolkata", name: "Kolkata", nameBn: "কলকাতা", country: "India", countryBn: "ভারত", countryCode: "IN", lat: 22.5726, lng: 88.3639, weight: 2 },
  { slug: "kathmandu", name: "Kathmandu", nameBn: "কাঠমান্ডু", country: "Nepal", countryBn: "নেপাল", countryCode: "NP", lat: 27.7172, lng: 85.324, weight: 1 },
  { slug: "colombo", name: "Colombo", nameBn: "কলম্বো", country: "Sri Lanka", countryBn: "শ্রীলঙ্কা", countryCode: "LK", lat: 6.9271, lng: 79.8612, weight: 1 },
  { slug: "karachi", name: "Karachi", nameBn: "করাচি", country: "Pakistan", countryBn: "পাকিস্তান", countryCode: "PK", lat: 24.8607, lng: 67.0011, weight: 1 },
  { slug: "thimphu", name: "Thimphu", nameBn: "থিম্পু", country: "Bhutan", countryBn: "ভুটান", countryCode: "BT", lat: 27.4728, lng: 89.639, weight: 1 },

  // Europe
  { slug: "rome", name: "Rome", nameBn: "রোম", country: "Italy", countryBn: "ইতালি", countryCode: "IT", lat: 41.9028, lng: 12.4964, weight: 3 },
  { slug: "milan", name: "Milan", nameBn: "মিলান", country: "Italy", countryBn: "ইতালি", countryCode: "IT", lat: 45.4642, lng: 9.19, weight: 1 },
  { slug: "london", name: "London", nameBn: "লন্ডন", country: "United Kingdom", countryBn: "যুক্তরাজ্য", countryCode: "GB", lat: 51.5074, lng: -0.1278, weight: 5 },
  { slug: "birmingham", name: "Birmingham", nameBn: "বার্মিংহাম", country: "United Kingdom", countryBn: "যুক্তরাজ্য", countryCode: "GB", lat: 52.4862, lng: -1.8904, weight: 1 },
  { slug: "manchester", name: "Manchester", nameBn: "ম্যানচেস্টার", country: "United Kingdom", countryBn: "যুক্তরাজ্য", countryCode: "GB", lat: 53.4808, lng: -2.2426, weight: 1 },
  { slug: "paris", name: "Paris", nameBn: "প্যারিস", country: "France", countryBn: "ফ্রান্স", countryCode: "FR", lat: 48.8566, lng: 2.3522, weight: 2 },
  { slug: "berlin", name: "Berlin", nameBn: "বার্লিন", country: "Germany", countryBn: "জার্মানি", countryCode: "DE", lat: 52.52, lng: 13.405, weight: 1 },
  { slug: "amsterdam", name: "Amsterdam", nameBn: "আমস্টার্ডাম", country: "Netherlands", countryBn: "নেদারল্যান্ডস", countryCode: "NL", lat: 52.3676, lng: 4.9041, weight: 1 },
  { slug: "brussels", name: "Brussels", nameBn: "ব্রাসেলস", country: "Belgium", countryBn: "বেলজিয়াম", countryCode: "BE", lat: 50.8503, lng: 4.3517, weight: 1 },
  { slug: "madrid", name: "Madrid", nameBn: "মাদ্রিদ", country: "Spain", countryBn: "স্পেন", countryCode: "ES", lat: 40.4168, lng: -3.7038, weight: 1 },
  { slug: "barcelona", name: "Barcelona", nameBn: "বার্সেলোনা", country: "Spain", countryBn: "স্পেন", countryCode: "ES", lat: 41.3874, lng: 2.1686, weight: 1 },
  { slug: "lisbon", name: "Lisbon", nameBn: "লিসবন", country: "Portugal", countryBn: "পর্তুগাল", countryCode: "PT", lat: 38.7223, lng: -9.1393, weight: 1 },
  { slug: "stockholm", name: "Stockholm", nameBn: "স্টকহোম", country: "Sweden", countryBn: "সুইডেন", countryCode: "SE", lat: 59.3293, lng: 18.0686, weight: 1 },
  { slug: "kristianstad", name: "Kristianstad", nameBn: "ক্রিস্টিয়ানস্টাড", country: "Sweden", countryBn: "সুইডেন", countryCode: "SE", lat: 56.0294, lng: 14.1567, weight: 1 },
  { slug: "oslo", name: "Oslo", nameBn: "অসলো", country: "Norway", countryBn: "নরওয়ে", countryCode: "NO", lat: 59.9139, lng: 10.7522, weight: 1 },
  { slug: "copenhagen", name: "Copenhagen", nameBn: "কোপেনহেগেন", country: "Denmark", countryBn: "ডেনমার্ক", countryCode: "DK", lat: 55.6761, lng: 12.5683, weight: 1 },
  { slug: "helsinki", name: "Helsinki", nameBn: "হেলসিংকি", country: "Finland", countryBn: "ফিনল্যান্ড", countryCode: "FI", lat: 60.1699, lng: 24.9384, weight: 1 },
  { slug: "vienna", name: "Vienna", nameBn: "ভিয়েনা", country: "Austria", countryBn: "অস্ট্রিয়া", countryCode: "AT", lat: 48.2082, lng: 16.3738, weight: 1 },
  { slug: "zurich", name: "Zurich", nameBn: "জুরিখ", country: "Switzerland", countryBn: "সুইজারল্যান্ড", countryCode: "CH", lat: 47.3769, lng: 8.5417, weight: 1 },
  { slug: "warsaw", name: "Warsaw", nameBn: "ওয়ারশ", country: "Poland", countryBn: "পোল্যান্ড", countryCode: "PL", lat: 52.2297, lng: 21.0122, weight: 1 },
  { slug: "prague", name: "Prague", nameBn: "প্রাগ", country: "Czechia", countryBn: "চেক প্রজাতন্ত্র", countryCode: "CZ", lat: 50.0755, lng: 14.4378, weight: 1 },
  { slug: "bucharest", name: "Bucharest", nameBn: "বুখারেস্ট", country: "Romania", countryBn: "রোমানিয়া", countryCode: "RO", lat: 44.4268, lng: 26.1025, weight: 1 },
  { slug: "kyiv", name: "Kyiv", nameBn: "কিয়েভ", country: "Ukraine", countryBn: "ইউক্রেন", countryCode: "UA", lat: 50.4501, lng: 30.5234, weight: 1 },
  { slug: "budapest", name: "Budapest", nameBn: "বুদাপেস্ট", country: "Hungary", countryBn: "হাঙ্গেরি", countryCode: "HU", lat: 47.4979, lng: 19.0402, weight: 1 },
  { slug: "nicosia", name: "Nicosia", nameBn: "নিকোশিয়া", country: "Cyprus", countryBn: "সাইপ্রাস", countryCode: "CY", lat: 35.1856, lng: 33.3823, weight: 2 },
  { slug: "athens", name: "Athens", nameBn: "এথেন্স", country: "Greece", countryBn: "গ্রিস", countryCode: "GR", lat: 37.9838, lng: 23.7275, weight: 1 },
  { slug: "istanbul", name: "Istanbul", nameBn: "ইস্তাম্বুল", country: "Turkey", countryBn: "তুরস্ক", countryCode: "TR", lat: 41.0082, lng: 28.9784, weight: 1 },
  { slug: "moscow", name: "Moscow", nameBn: "মস্কো", country: "Russia", countryBn: "রাশিয়া", countryCode: "RU", lat: 55.7558, lng: 37.6173, weight: 2 },
  { slug: "omsk", name: "Omsk", nameBn: "ওমস্ক", country: "Russia", countryBn: "রাশিয়া", countryCode: "RU", lat: 54.9885, lng: 73.3242, weight: 1 },

  // North America
  { slug: "new-york", name: "New York", nameBn: "নিউ ইয়র্ক", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 40.7128, lng: -74.006, weight: 7 },
  { slug: "atlanta", name: "Atlanta", nameBn: "আটলান্টা", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 33.749, lng: -84.388, weight: 2 },
  { slug: "houston", name: "Houston", nameBn: "হিউস্টন", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 29.7604, lng: -95.3698, weight: 2 },
  { slug: "chicago", name: "Chicago", nameBn: "শিকাগো", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 41.8781, lng: -87.6298, weight: 2 },
  { slug: "los-angeles", name: "Los Angeles", nameBn: "লস অ্যাঞ্জেলেস", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 34.0522, lng: -118.2437, weight: 2 },
  { slug: "washington-dc", name: "Washington DC", nameBn: "ওয়াশিংটন ডিসি", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 38.9072, lng: -77.0369, weight: 1 },
  { slug: "detroit", name: "Detroit", nameBn: "ডেট্রয়েট", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 42.3314, lng: -83.0458, weight: 1 },
  { slug: "dallas", name: "Dallas", nameBn: "ডালাস", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 32.7767, lng: -96.797, weight: 1 },
  { slug: "honolulu", name: "Honolulu", nameBn: "হনুলুলু", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 21.3069, lng: -157.8583, weight: 1 },
  { slug: "chico", name: "Chico", nameBn: "চিকো", country: "United States", countryBn: "যুক্তরাষ্ট্র", countryCode: "US", lat: 39.7285, lng: -121.8375, weight: 1 },
  { slug: "toronto", name: "Toronto", nameBn: "টরন্টো", country: "Canada", countryBn: "কানাডা", countryCode: "CA", lat: 43.6532, lng: -79.3832, weight: 5 },
  { slug: "calgary", name: "Calgary", nameBn: "ক্যালগারি", country: "Canada", countryBn: "কানাডা", countryCode: "CA", lat: 51.0447, lng: -114.0719, weight: 2 },
  { slug: "montreal", name: "Montreal", nameBn: "মন্ট্রিয়াল", country: "Canada", countryBn: "কানাডা", countryCode: "CA", lat: 45.5019, lng: -73.5674, weight: 1 },
  { slug: "victoria-ca", name: "Victoria", nameBn: "ভিক্টোরিয়া", country: "Canada", countryBn: "কানাডা", countryCode: "CA", lat: 48.4284, lng: -123.3656, weight: 1 },

  // Oceania
  { slug: "sydney", name: "Sydney", nameBn: "সিডনি", country: "Australia", countryBn: "অস্ট্রেলিয়া", countryCode: "AU", lat: -33.8688, lng: 151.2093, weight: 3 },
  { slug: "melbourne", name: "Melbourne", nameBn: "মেলবোর্ন", country: "Australia", countryBn: "অস্ট্রেলিয়া", countryCode: "AU", lat: -37.8136, lng: 144.9631, weight: 2 },
  { slug: "perth", name: "Perth", nameBn: "পার্থ", country: "Australia", countryBn: "অস্ট্রেলিয়া", countryCode: "AU", lat: -31.9505, lng: 115.8605, weight: 2 },
  { slug: "darwin", name: "Darwin", nameBn: "ডারউইন", country: "Australia", countryBn: "অস্ট্রেলিয়া", countryCode: "AU", lat: -12.4634, lng: 130.8456, weight: 1 },
  { slug: "auckland", name: "Auckland", nameBn: "অকল্যান্ড", country: "New Zealand", countryBn: "নিউজিল্যান্ড", countryCode: "NZ", lat: -36.8485, lng: 174.7633, weight: 2 },
  { slug: "christchurch", name: "Christchurch", nameBn: "ক্রাইস্টচার্চ", country: "New Zealand", countryBn: "নিউজিল্যান্ড", countryCode: "NZ", lat: -43.5321, lng: 172.6362, weight: 1 },
  { slug: "suva", name: "Suva", nameBn: "সুভা", country: "Fiji", countryBn: "ফিজি", countryCode: "FJ", lat: -18.1416, lng: 178.4419, weight: 1 },
  { slug: "port-moresby", name: "Port Moresby", nameBn: "পোর্ট মোর্সবি", country: "Papua New Guinea", countryBn: "পাপুয়া নিউগিনি", countryCode: "PG", lat: -9.4438, lng: 147.1803, weight: 1 },

  // Africa
  { slug: "johannesburg", name: "Johannesburg", nameBn: "জোহানেসবার্গ", country: "South Africa", countryBn: "দক্ষিণ আফ্রিকা", countryCode: "ZA", lat: -26.2041, lng: 28.0473, weight: 1 },
  { slug: "cape-town", name: "Cape Town", nameBn: "কেপ টাউন", country: "South Africa", countryBn: "দক্ষিণ আফ্রিকা", countryCode: "ZA", lat: -33.9249, lng: 18.4241, weight: 2 },
  { slug: "mount-ayliff", name: "Mount Ayliff", nameBn: "মাউন্ট আইলিফ", country: "South Africa", countryBn: "দক্ষিণ আফ্রিকা", countryCode: "ZA", lat: -30.8167, lng: 29.3667, weight: 1 },
  { slug: "cairo", name: "Cairo", nameBn: "কায়রো", country: "Egypt", countryBn: "মিশর", countryCode: "EG", lat: 30.0444, lng: 31.2357, weight: 1 },
  { slug: "tripoli", name: "Tripoli", nameBn: "ত্রিপোলি", country: "Libya", countryBn: "লিবিয়া", countryCode: "LY", lat: 32.8872, lng: 13.1913, weight: 1 },
  { slug: "khartoum", name: "Khartoum", nameBn: "খার্তুম", country: "Sudan", countryBn: "সুদান", countryCode: "SD", lat: 15.5007, lng: 32.5599, weight: 1 },
  { slug: "juba", name: "Juba", nameBn: "জুবা", country: "South Sudan", countryBn: "দক্ষিণ সুদান", countryCode: "SS", lat: 4.8594, lng: 31.5713, weight: 1 },
  { slug: "nairobi", name: "Nairobi", nameBn: "নাইরোবি", country: "Kenya", countryBn: "কেনিয়া", countryCode: "KE", lat: -1.2921, lng: 36.8219, weight: 1 },
  { slug: "dar-es-salaam", name: "Dar es Salaam", nameBn: "দার এস সালাম", country: "Tanzania", countryBn: "তানজানিয়া", countryCode: "TZ", lat: -6.7924, lng: 39.2083, weight: 1 },
  { slug: "kinshasa", name: "Kinshasa", nameBn: "কিনশাসা", country: "DR Congo", countryBn: "কঙ্গো", countryCode: "CD", lat: -4.4419, lng: 15.2663, weight: 1 },
  { slug: "lagos", name: "Lagos", nameBn: "লাগোস", country: "Nigeria", countryBn: "নাইজেরিয়া", countryCode: "NG", lat: 6.5244, lng: 3.3792, weight: 1 },
  { slug: "accra", name: "Accra", nameBn: "আক্রা", country: "Ghana", countryBn: "ঘানা", countryCode: "GH", lat: 5.6037, lng: -0.187, weight: 1 },
  { slug: "addis-ababa", name: "Addis Ababa", nameBn: "আডিস আবাবা", country: "Ethiopia", countryBn: "ইথিওপিয়া", countryCode: "ET", lat: 8.9806, lng: 38.7578, weight: 1 },
  { slug: "freetown", name: "Freetown", nameBn: "ফ্রিটাউন", country: "Sierra Leone", countryBn: "সিয়েরা লিওন", countryCode: "SL", lat: 8.4657, lng: -13.2317, weight: 1 },
  { slug: "port-louis", name: "Port Louis", nameBn: "পোর্ট লুইস", country: "Mauritius", countryBn: "মরিশাস", countryCode: "MU", lat: -20.1609, lng: 57.5012, weight: 1 },
  { slug: "saint-denis", name: "Saint-Denis", nameBn: "সাঁ-দ্যনি", country: "Réunion", countryBn: "রিইউনিয়ন", countryCode: "RE", lat: -20.8789, lng: 55.4481, weight: 1 },
  { slug: "victoria-sc", name: "Victoria", nameBn: "ভিক্টোরিয়া", country: "Seychelles", countryBn: "সেশেলস", countryCode: "SC", lat: -4.6191, lng: 55.4513, weight: 1 },
  { slug: "antananarivo", name: "Antananarivo", nameBn: "আন্তানারিভো", country: "Madagascar", countryBn: "মাদাগাস্কার", countryCode: "MG", lat: -18.8792, lng: 47.5079, weight: 1 },

  // Latin America & Caribbean
  { slug: "sao-paulo", name: "São Paulo", nameBn: "সাও পাওলো", country: "Brazil", countryBn: "ব্রাজিল", countryCode: "BR", lat: -23.5505, lng: -46.6333, weight: 1 },
  { slug: "buenos-aires", name: "Buenos Aires", nameBn: "বুয়েনস আইরেস", country: "Argentina", countryBn: "আর্জেন্টিনা", countryCode: "AR", lat: -34.6037, lng: -58.3816, weight: 1 },
  { slug: "valparaiso", name: "Valparaíso", nameBn: "ভালপারাইসো", country: "Chile", countryBn: "চিলি", countryCode: "CL", lat: -33.0472, lng: -71.6127, weight: 1 },
  { slug: "panama-city", name: "Panama City", nameBn: "পানামা সিটি", country: "Panama", countryBn: "পানামা", countryCode: "PA", lat: 8.9824, lng: -79.5199, weight: 1 },
  { slug: "mexico-city", name: "Mexico City", nameBn: "মেক্সিকো সিটি", country: "Mexico", countryBn: "মেক্সিকো", countryCode: "MX", lat: 19.4326, lng: -99.1332, weight: 1 },

  // Middle East (other)
  { slug: "beirut", name: "Beirut", nameBn: "বৈরুত", country: "Lebanon", countryBn: "লেবানন", countryCode: "LB", lat: 33.8938, lng: 35.5018, weight: 1 },
  { slug: "amman", name: "Amman", nameBn: "আম্মান", country: "Jordan", countryBn: "জর্ডান", countryCode: "JO", lat: 31.9454, lng: 35.9284, weight: 1 },
  { slug: "baghdad", name: "Baghdad", nameBn: "বাগদাদ", country: "Iraq", countryBn: "ইরাক", countryCode: "IQ", lat: 33.3152, lng: 44.3661, weight: 1 },
  { slug: "bishkek", name: "Bishkek", nameBn: "বিশকেক", country: "Kyrgyzstan", countryBn: "কিরগিজস্তান", countryCode: "KG", lat: 42.8746, lng: 74.5698, weight: 2 },

  // Other Asia
  { slug: "manila", name: "Manila", nameBn: "ম্যানিলা", country: "Philippines", countryBn: "ফিলিপাইন", countryCode: "PH", lat: 14.5995, lng: 120.9842, weight: 1 },
  { slug: "jakarta", name: "Jakarta", nameBn: "জাকার্তা", country: "Indonesia", countryBn: "ইন্দোনেশিয়া", countryCode: "ID", lat: -6.2088, lng: 106.8456, weight: 1 },
  { slug: "ho-chi-minh", name: "Ho Chi Minh City", nameBn: "হো চি মিন সিটি", country: "Vietnam", countryBn: "ভিয়েতনাম", countryCode: "VN", lat: 10.8231, lng: 106.6297, weight: 1 },
  { slug: "phnom-penh", name: "Phnom Penh", nameBn: "নম পেন", country: "Cambodia", countryBn: "কম্বোডিয়া", countryCode: "KH", lat: 11.5564, lng: 104.9282, weight: 1 },
  { slug: "yangon", name: "Yangon", nameBn: "ইয়াঙ্গুন", country: "Myanmar", countryBn: "মিয়ানমার", countryCode: "MM", lat: 16.8409, lng: 96.1735, weight: 1 },
];

export const countryCodeToBn: Record<string, string> = Object.fromEntries(
  cities.map((c) => [c.countryCode, c.countryBn]),
);
