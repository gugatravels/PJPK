import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Mail, 
  X, 
  ShieldCheck,
  ArrowUpRight,
  Settings,
  Plus,
  Trash2,
  RotateCcw,
  ExternalLink,
  Image as ImageIcon,
  Type,
  Compass,
  Layers,
  Check
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const DISC = 46; // ขนาดวงกลมลูกศร (กะทัดรัด มินิมอล)
const BLOCK = 58; // ขนาดบล็อกรอยบาก
const FILLET = 20; // ความโค้งมนตรงรอยต่อ

// --- ข้อมูลเริ่มต้นของเว็บไซต์ทั้งหมด (สามารถแก้ไขผ่านระบบหลังบ้านได้) ---
const INITIAL_SITE_CONFIG = {
  brand: {
    namePrefix: 'PAJAI',
    nameHighlight: 'PAIKHAO',
    logoImageUrl: '', // หากเว้นว่างจะใช้โลโก้ SVG ต้นฉบับ หากใส่ URL รูปจะแสดงรูปแทน
    heroWallpaper: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
  booking: {
    navButtonText: 'ติดต่อจองทริป',
    primaryBookingUrl: '#contact', // ใส่ URL ระบบจองที่นั่งในอนาคตได้ เช่น https://booking.pajaipaikhao.com
    openInNewTab: false,
  },
  hero: {
    badgeFull: 'PaJaiPaiKhao — Your Next Mountain Story Starts Here',
    badgeShort: 'PaJaiPaiKhao — Mountain Story',
    headlineLine1: 'ใจมันเรียกร้อง...',
    headlinePrefix: 'ก็',
    headlineAccent: 'พาใจไปเขาดิครับ!',
    ctaText: 'ดูตารางทริปทั้งหมด',
    ledeText: 'ยินดีต้อนรับสู่ พาใจไปเขา โซนรวมตัวของคนรักการเดินทางที่พร้อมจะออกไปตะลุยโลกกว้าง! เราคือเพื่อนเดินทางสายตะลอนที่จะพาคุณไปกางเต้นท์ ดูดาว สูดหมอกยามเช้า และดื่มด่ำกับบรรยากาศสุดฟินบนยอดเขา ไม่ว่าจะเดินทางคนเดียวอยากหาเพื่อนใหม่ หรือยกแก๊งกันมาลุย เราก็พร้อมจัดการทุกเรื่องทริปให้เป็นเรื่องง่ายและปลอดภัยที่สุด ถ้าร่างกายต้องการธรรมชาติติดสปีด แล้วจะรออะไรอยู่... ปักวันแล้วพาใจไปเขาด้วยกันเลย!',
  },
  tripsSection: {
    tag: '01 // UPCOMING MOUNTAIN TRIPS',
    title: 'ทริปต่าง ๆ — ปักวันแล้วออกไปแตะขอบฟ้า',
    desc: 'คัดสรรเส้นทางเดินป่าและแคมป์ปิ้งสุดตระการตาทั่วไทย แบ่งระดับความท้าทายชัดเจน เลือกทริปที่ตรงกับจังหวะหัวใจของคุณได้เลย',
    items: [
      {
        id: 1,
        category: 'intermediate',
        badge: 'LEVEL: กลาง (Intermediate)',
        slots: 'ว่าง 4 ที่สุดท้าย',
        location: 'จ.เชียงใหม่',
        duration: '3 วัน 2 คืน (ศ.-อา.)',
        title: 'ดอยหลวงเชียงดาว — สัมผัสภูเขาหินปูนที่สูงเป็นอันดับ 3 ของไทย',
        desc: 'ตื่นตาตื่นใจกับทะเลหมอกและทางช้างเผือกเหนือเทือกเขาเชียงดาว เดินป่าศึกษาธรรมชาติกึ่งอัลไพน์ พร้อมทีมสตาฟและลูกหาบดูแลตลอดเส้นทาง',
        price: '฿4,590',
        priceSub: '/ ท่าน (รวมรถตู้ VIP)',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        bookingUrl: '', // หากเว้นว่างจะใช้ลิงก์จองหลัก (primaryBookingUrl)
      },
      {
        id: 2,
        category: 'beginner',
        badge: 'LEVEL: มือใหม่ (Beginner+)',
        slots: 'ว่าง 6 ที่นั่ง',
        location: 'จ.จันทบุรี',
        duration: '2 วัน 1 คืน (ส.-อา.)',
        title: 'เขาผาหินกูบ — นอนดูดาวริมผาหินแกรนิตสุดอลังการ',
        desc: 'ทริปสั้นเสาร์-อาทิตย์ใกล้กรุงเทพฯ พิชิตยอดผาหินกูบ ชมวิวทะเลหมอก 360 องศา เหมาะสำหรับคนมีเวลาน้อยแต่อยากชาร์จพลังธรรมชาติแบบติดสปีด',
        price: '฿2,890',
        priceSub: '/ ท่าน (รวมทุกอย่าง)',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
        bookingUrl: '',
      },
      {
        id: 3,
        category: 'hardcore',
        badge: 'LEVEL: สายลุย (Adventure)',
        slots: 'เปิดรับจองรอบใหม่',
        location: 'จ.ตาก (ท่าสองยาง)',
        duration: '3 วัน 2 คืน',
        title: 'ยอดเขาเลอกวาเดาะ & ดอยทูเล — สันคมมีดแห่งขุนเขาตะวันตก',
        desc: 'เดินไต่สันเขาสีทองตัดกับท้องฟ้าเข้มและทะเลหมอกหนาแน่น ทริปในฝันของนักเดินป่าที่ต้องการภาพถ่ายระดับมาสเตอร์พีซและมิตรภาพสุดเข้มข้น',
        price: '฿4,290',
        priceSub: '/ ท่าน (รวมรถตู้ VIP)',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
        bookingUrl: '',
      },
    ],
  },
  aboutSection: {
    tag: '02 // ABOUT PAJAIPAIKHAO',
    title: 'รู้จักกับเรา — เพื่อนร่วมทางสายลุยที่คุณไว้ใจได้',
    desc: 'มากกว่าทัวร์เดินป่า คือคอมมูนิตี้ของคนที่หลงใหลในกลิ่นฝน เสียงลม และทะเลหมอก เราเปลี่ยนเรื่องยุ่งยากของการเตรียมตัวให้เป็นเรื่องง่าย',
    quoteMain: '“ไม่ว่าคุณจะเป็นมือใหม่หัดเดินเขาคนเดียว หรือสายแบกเป้ตัวจริง ',
    quoteHighlight: 'เราดูแลคุณเหมือนเพื่อนร่วมแก๊ง',
    storyText: 'PaJaiPaiKhao ก่อตั้งขึ้นจากกลุ่มเพื่อนนักเดินทางที่เข้าใจดีว่าการจะออกไปสัมผัสธรรมชาติสักครั้ง ต้องจัดการทั้งเรื่องรถเดินทาง การจองคิวอุทยาน ลูกหาบ และอาหาร เราจึงออกแบบระบบจัดการทริปแบบครบวงจร',
    stats: [
      { num: '140', suffix: '+', label: 'ทริปที่เดินทางแล้ว' },
      { num: '4.8k', suffix: '+', label: 'สมาชิกครอบครัว' },
      { num: '100', suffix: '%', label: 'มาตรฐานความปลอดภัย' },
    ],
    pillars: [
      { num: '01', title: 'มาคนเดียวก็ไม่เหงา', desc: 'กว่า 65% ของลูกทริปเดินทางมาคนเดียว สตาฟของเราเชื่อมบรรยากาศให้ทุกคนได้เพื่อนใหม่' },
      { num: '02', title: 'ปลอดภัยสูงสุด', desc: 'ทีมงานผ่านการอบรมปฐมพยาบาล (Wilderness First Aid) พร้อมวิทยุสื่อสาร' },
    ],
  },
  servicesSection: {
    tag: '03 // OTHER SERVICES',
    title: 'บริการอื่น ๆ — ครบเครื่องทุกเรื่องแคมป์ปิ้ง',
    desc: 'นอกจากทริปจอยประจำสัปดาห์ เรายังพร้อมซัพพอร์ตกลุ่มเพื่อน องค์กร และนักเดินทางด้วยบริการเสริมระดับมืออาชีพ',
    items: [
      { id: 1, title: 'จัดทริปส่วนตัว & ยกแก๊ง', desc: 'อยากไปเฉพาะแก๊งเพื่อนสนิท เราออกแบบเส้นทาง วันเวลา และเมนูอาหารบนเขาให้ตามใจคุณ 100%' },
      { id: 2, title: 'เช่าอุปกรณ์แคมป์ปิ้ง', desc: 'ไม่ต้องลงทุนซื้อของแพง เรามีอุปกรณ์เดินป่าแบรนด์มาตรฐานให้เช่า ทำความสะอาดฆ่าเชื้อทุกครั้ง' },
    ],
  },
  gallerySection: {
    tag: '04 // MOUNTAIN STORIES GALLERY',
    title: 'รูปแกลลอรี่ — บันทึกความทรงจำบนยอดเขา',
    items: [
      {
        id: 1,
        location: 'CHIANG MAI',
        name: 'แสงแรกเหนือทะเลหมอก',
        image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80',
        spanClass: 'gallery-item--wide gallery-item--tall',
      },
      {
        id: 2,
        location: 'STARRY NIGHT',
        name: 'บทสนทนาใต้หมู่ดาว',
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
        spanClass: '',
      },
      {
        id: 3,
        location: 'TREKKING',
        name: 'ก้าวไปพร้อมกัน',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
        spanClass: '',
      },
      {
        id: 4,
        location: 'MILKY WAY',
        name: 'ค่ำคืนดูทางช้างเผือก',
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
        spanClass: 'gallery-item--wide',
      },
    ],
  },
  contactSection: {
    tag: '05 // GET IN TOUCH',
    title: 'ติดต่อเรา — พร้อมพาใจไปเขากับเราหรือยัง?',
    boxTag: 'PAJAIPAIKHAO BASECAMP',
    boxTitle: 'ใจมันเรียกร้อง... ทักหาเราแล้วแพ็คกระเป๋าเลย!',
    line: '@PaJaiPaiKhao',
    phone: '089-998-7654',
    pickup: 'BTS หมอชิต',
    email: 'hello@pajaipaikhao.com',
    footerText: '© 2026 PaJaiPaiKhao Adventure Co., Ltd.',
  },
};

// --- Firebase Configuration & Setup ---
const userFirebaseConfig = {
  apiKey: "AIzaSyCyT_8-1QV7KqL_2t-y3BM-8DKdKYDGuqE",
  authDomain: "bookpajai.firebaseapp.com",
  databaseURL: "https://bookpajai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bookpajai",
  storageBucket: "bookpajai.firebasestorage.app",
  messagingSenderId: "367823485461",
  appId: "1:367823485461:web:d38bf3d0d358a8b5816c1c"
};

// ใช้ Config จากระบบ Platform หากมี มิฉะนั้นจะใช้ Config ส่วนตัวของผู้ใช้
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : userFirebaseConfig;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'pajaipaikhao-app-id';

// --- คอมโพเนนต์ NotchedTripCard สไตล์มินิมอล (ขนาดกะทัดรัด) ---
function NotchedTripCard({ trip, defaultBookingUrl, openInNewTab, onInternalNavigate }) {
  const surface = "#121216";
  const tone = "grayscale transition-all duration-500 group-hover:grayscale-0 focus-visible:grayscale-0";
  const targetUrl = (trip.bookingUrl && trip.bookingUrl.trim() !== '') ? trip.bookingUrl.trim() : defaultBookingUrl;
  const isInternalHash = targetUrl.startsWith('#');

  const handleCardClick = (e) => {
    if (isInternalHash) {
      e.preventDefault();
      onInternalNavigate(targetUrl);
    }
  };

  return (
    <a
      href={targetUrl || '#contact'}
      target={!isInternalHash && openInNewTab ? '_blank' : undefined}
      rel={!isInternalHash && openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={handleCardClick}
      className="group flex flex-col rounded-[24px] outline-none cursor-pointer bg-[#17171d]/60 border border-white/[0.06] p-3.5 hover:border-[#f97316]/40 transition-all duration-300"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative">
        {/* รูปภาพหน้าปก (Cover) ขนาดกะทัดรัด */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#1a1a20]">
          <img
            src={trip.image}
            alt={trip.title}
            className={`absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] ${tone}`}
          />
          <div aria-hidden className="absolute inset-0 bg-black/25 transition-opacity duration-500 group-hover:bg-black/10" />
          
          {/* ป้าย Badge มุมบน */}
          {trip.badge && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-3 z-10">
              <span className="rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                {trip.badge}
              </span>
            </div>
          )}
        </div>

        {/* รอยบากมุมขวาล่าง (Notch) */}
        <div
          aria-hidden
          className="absolute bottom-0 right-0 z-10"
          style={{ width: BLOCK, height: BLOCK, borderTopLeftRadius: BLOCK - DISC / 2, background: surface }}
        />
        {[
          { bottom: BLOCK, right: 0 },
          { bottom: 0, right: BLOCK },
        ].map((pos, i) => (
          <div
            key={i}
            aria-hidden
            className="absolute z-10"
            style={{
              ...pos,
              width: FILLET,
              height: FILLET,
              background: `radial-gradient(circle at top left, transparent ${FILLET - 0.5}px, ${surface} ${FILLET}px)`,
            }}
          />
        ))}

        {/* ปุ่มลูกศรซ้อนในรอยบาก */}
        <span
          aria-hidden
          className="absolute bottom-0 right-0 z-20 flex items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-[#f97316] group-hover:text-white"
          style={{ width: DISC, height: DISC }}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      {/* เนื้อหาด้านล่างการ์ด */}
      <div className="mt-3.5 flex flex-col flex-grow px-1.5">
        <h3 className="text-[16px] font-bold tracking-tight text-white mb-1.5 leading-snug line-clamp-2">{trip.title}</h3>
        <p className="text-[12.5px] leading-relaxed text-[#a1a1aa] flex-grow mb-3 line-clamp-2">{trip.desc}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="rounded-md bg-[#121216] border border-white/5 px-2 py-0.5 text-[10px] font-medium text-[#d4d4d8] flex items-center gap-1">
            <MapPin size={11} className="text-[#f97316]" /> {trip.location}
          </span>
          <span className="rounded-md bg-[#121216] border border-white/5 px-2 py-0.5 text-[10px] font-medium text-[#d4d4d8] flex items-center gap-1">
            <Calendar size={11} className="text-[#f97316]" /> {trip.duration}
          </span>
        </div>
        
        <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
          <div className="text-[17px] font-bold text-[#f97316]">
            {trip.price} <span className="text-[10.5px] font-normal text-[#a1a1aa]">{trip.priceSub}</span>
          </div>
          <div className="text-[9.5px] font-bold text-[#f97316] uppercase tracking-wider bg-[#f97316]/10 px-2 py-0.5 rounded-full border border-[#f97316]/20">
            {trip.slots}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const [siteConfig, setSiteConfig] = useState(INITIAL_SITE_CONFIG);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  // States สำหรับระบบหลังบ้าน (Admin CMS)
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('brand');
  const [saveToast, setSaveToast] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // --- 1. ระบบยืนยันตัวตน Firebase (Auth Effect) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Firebase Auth Error:', error);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. ระบบซิงค์ข้อมูลจากฐานข้อมูล Firebase (Fetch & Sync) ---
  useEffect(() => {
    if (!user) return; // ดึงข้อมูลเฉพาะเมื่อยืนยันตัวตนแล้ว
    
    const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteConfig', 'mainConfig');
    const unsubscribe = onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) {
        // หากมีข้อมูลบน Cloud ให้เขียนทับข้อมูลเริ่มต้น
        setSiteConfig(docSnap.data());
      } else {
        // หากยังไม่มีข้อมูล (เพิ่งรันครั้งแรก) ให้สร้างข้อมูลเริ่มต้นขึ้นบน Cloud
        setDoc(configDocRef, INITIAL_SITE_CONFIG).catch(console.error);
      }
    }, (error) => {
      console.error('Firestore sync error:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const smoothScrollTo = (targetId) => {
    const id = targetId.replace('#', '');
    const targetEl = document.getElementById(id);
    if (!targetEl) return;

    const startPosition = window.pageYOffset;
    const targetPosition = targetEl.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    const duration = 900;
    let startTime = null;

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (mobileMenuOpen) setMobileMenuOpen(false);
    smoothScrollTo(targetId);
  };

  // ฟังก์ชันจัดการปุ่มจองหลัก (รองรับทั้ง #contact และลิงก์เว็บจองภายนอก)
  const handlePrimaryBookingClick = (e) => {
    const url = siteConfig.booking.primaryBookingUrl.trim();
    if (url.startsWith('#')) {
      e.preventDefault();
      if (mobileMenuOpen) setMobileMenuOpen(false);
      smoothScrollTo(url);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory, siteConfig.tripsSection.items]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (modalState.isOpen) setModalState({ isOpen: false, type: null, data: null });
        if (adminOpen) setAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, modalState.isOpen, adminOpen]);

  const filteredTrips = activeCategory === 'all'
    ? siteConfig.tripsSection.items
    : siteConfig.tripsSection.items.filter((trip) => trip.category === activeCategory);

  const openLightbox = (imgUrl, title) => {
    setModalState({ isOpen: true, type: 'lightbox', data: { imgUrl, title } });
  };

  // --- Helpers สำหรับอัปเดตข้อมูลในระบบหลังบ้าน ---
  const updateSectionField = (sectionKey, field, value) => {
    setSiteConfig((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const handleTripChange = (tripId, field, value) => {
    setSiteConfig((prev) => ({
      ...prev,
      tripsSection: {
        ...prev.tripsSection,
        items: prev.tripsSection.items.map((item) =>
          item.id === tripId ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleAddTrip = () => {
    const newTrip = {
      id: Date.now(),
      category: 'beginner',
      badge: 'LEVEL: ทริปใหม่ (New)',
      slots: 'ว่าง 8 ที่นั่ง',
      location: 'จ.เชียงใหม่',
      duration: '2 วัน 1 คืน',
      title: 'ชื่อทริปใหม่ — แก้ไขรายละเอียดได้ในระบบหลังบ้าน',
      desc: 'คำอธิบายไฮไลต์ของทริปบรรยากาศธรรมชาติ गางเต็นท์ดูดาว สูดหมอกยามเช้าพร้อมทีมงานดูแลตลอดเส้นทาง',
      price: '฿3,590',
      priceSub: '/ ท่าน (รวมรถตู้ VIP)',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      bookingUrl: '',
    };
    setSiteConfig((prev) => ({
      ...prev,
      tripsSection: {
        ...prev.tripsSection,
        items: [newTrip, ...prev.tripsSection.items],
      },
    }));
  };

  const handleDeleteTrip = (tripId) => {
    setSiteConfig((prev) => ({
      ...prev,
      tripsSection: {
        ...prev.tripsSection,
        items: prev.tripsSection.items.filter((item) => item.id !== tripId),
      },
    }));
  };

  const triggerSaveNotification = (message = 'อัปเดตข้อมูลลงฐานข้อมูล (Cloud) เรียบร้อยแล้ว!') => {
    setSaveStatus(message);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // --- 3. ฟังก์ชันบันทึกข้อมูลขึ้น Firebase เมื่อกดบันทึกในหน้า Admin ---
  const handleSaveToCloud = async () => {
    if (!user) return;
    try {
      const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteConfig', 'mainConfig');
      await setDoc(configDocRef, siteConfig);
      triggerSaveNotification();
      setTimeout(() => setAdminOpen(false), 1200);
    } catch (error) {
      console.error('Save error:', error);
      triggerSaveNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const MeridianArrow = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h10.2M10.4 5.6 15.2 10l-4.8 4.4" />
    </svg>
  );

  const isPrimaryBookingHash = siteConfig.booking.primaryBookingUrl.trim().startsWith('#');

  return (
    <div className="pajaipaikhao-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --bg: #0f0f12;
          --bg-dark: #09090b;
          --bg-charcoal: #141418;
          --bg-gray: #121216;
          --text: #0a0a0a;
          --text-light: #fafafa;
          --gray-muted: #a1a1aa;
          --orange: #f97316;
          --orange-dark: #ea580c;
          --orange-pale: #fdba74;
          --orange-glow: rgba(249, 115, 22, 0.28);
          --radius-md: 18px;
          --radius-lg: 24px;
          --radius-xl: 30px;
          --radius-pill: 9999px;
          --font: "Inter", "IBM Plex Sans Thai", "Helvetica Neue", Helvetica, Arial, sans-serif;
          --pad-x: clamp(20px, 3.52vw, 64px);
          --nav-top: clamp(16px, 2.05vw, 28px);
        }

        .pajaipaikhao-app, .pajaipaikhao-app *, .pajaipaikhao-app *::before, .pajaipaikhao-app *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; padding: 0; font-family: var(--font); background-color: var(--bg-dark); color: var(--text-light); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; }

        .top-crimson-bar { position: fixed; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--bg-dark) 0%, var(--bg-dark) 60%, var(--orange) 60%, #fbbf24 100%); box-shadow: 0 2px 14px var(--orange-glow); z-index: 100; }
        .reveal-on-scroll { opacity: 0; transform: translate3d(0, 30px, 0) scale(0.98); transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); will-change: opacity, transform; }
        .reveal-on-scroll.is-visible { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }

        /* HERO PAGE SHELL */
        .page { position: relative; width: 100%; min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; overflow: hidden; padding: var(--nav-top) var(--pad-x) clamp(40px, 6vw, 64px); background: var(--bg-dark); }
        .bg { position: absolute; inset: 0; z-index: 0; background: var(--bg-dark); pointer-events: none; overflow: hidden; }
        .bg::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(9, 9, 11, 0.25) 0%, rgba(9, 9, 11, 0.85) 100%); z-index: 1; }
        .bg-image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(1.05); transform: scale(1.02); }
        .nav, .hero, .lede, .mobile-menu { position: relative; z-index: 10; }

        /* HEADER / NAV */
        .nav { display: flex; align-items: center; justify-content: space-between; width: 100%; position: relative; }
        .nav__links { display: flex; flex-direction: row; align-items: center; gap: clamp(16px, 2vw, 28px); padding: 16px 28px; background: rgba(15, 15, 18, 0.72); backdrop-filter: blur(20px); border-radius: var(--radius-pill); border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22); }
        .nav__link { position: relative; font-size: clamp(13px, 1.3vw, 14.5px); font-weight: 500; color: #ffffff; text-decoration: none; padding-bottom: 2px; transition: color 0.25s ease, transform 0.25s ease; }
        .nav__link:hover { color: var(--orange-pale); transform: translateY(-2px); }
        .nav__link::after { content: ""; position: absolute; left: 0; bottom: -6px; width: 100%; height: 3px; border-radius: var(--radius-pill); background: linear-gradient(90deg, var(--orange), #fbbf24); transform: scaleX(0); transform-origin: left center; transition: transform 0.28s ease; }
        .nav__link:hover::after { transform: scaleX(1); }
        
        .logo { position: absolute; left: 50%; transform: translateX(-50%); display: inline-flex; flex-direction: column; align-items: center; gap: 5px; color: #ffffff; text-decoration: none; transition: transform 0.35s ease; }
        .logo svg { width: clamp(30px, 3vw, 38px); height: auto; fill: currentColor; }
        .logo__img { height: clamp(34px, 3.6vw, 44px); width: auto; max-width: 150px; object-fit: contain; border-radius: 6px; }
        .logo__text { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #ffffff; }
        .logo__text span { color: var(--orange); }
        .logo:hover { transform: translateX(-50%) scale(1.06); }

        .nav__burger { display: none; width: 42px; height: 42px; flex-direction: column; justify-content: center; align-items: center; gap: 5px; background: rgba(15, 15, 18, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50%; cursor: pointer; }
        .nav__burger-bar { width: 18px; height: 2px; border-radius: 2px; background-color: #ffffff; transition: all 0.25s ease; }
        .mobile-menu { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem 0; }
        .mobile-menu__links { display: flex; flex-direction: column; gap: 0.9rem; padding: 20px 24px; background: rgba(15, 15, 18, 0.94); backdrop-filter: blur(16px); border-radius: var(--radius-md); border: 1px solid rgba(249, 115, 22, 0.35); box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45); }
        .mobile-menu__link { font-size: 1.02rem; font-weight: 500; color: #ffffff; text-decoration: none; }

        /* BUTTONS */
        .btn { position: relative; display: inline-flex; align-items: center; height: 52px; padding: 8px 8px 8px 24px; gap: 14px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: var(--radius-pill); cursor: pointer; overflow: hidden; transition: transform 0.35s ease, box-shadow 0.35s ease; }
        .btn:hover { transform: translateY(-3px); }
        .btn__label, .btn__icon { position: relative; z-index: 1; }
        .btn__icon { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
        .btn__icon svg { width: 15px; height: 15px; }
        .btn::before { content: ""; position: absolute; inset: 0; border-radius: inherit; transform: scaleX(0); transform-origin: left center; transition: transform 0.42s ease; z-index: 0; }
        .btn:hover::before { transform: scaleX(1); }

        .btn--nav { background: linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%); color: #ffffff; box-shadow: 0 10px 26px rgba(249, 115, 22, 0.38); }
        .btn--nav::before { background: var(--bg-dark); }
        .btn--nav .btn__icon { background-color: rgba(0, 0, 0, 0.22); color: #ffffff; }
        .btn--nav:hover .btn__icon { background-color: var(--orange); }

        .btn--light { background-color: var(--bg-dark); color: #ffffff; box-shadow: 0 14px 32px rgba(0, 0, 0, 0.25); border: 1px solid rgba(255,255,255,0.12); }
        .btn--light::before { background: linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%); }
        .btn--light .btn__icon { background-color: var(--orange); color: #ffffff; }

        /* HERO */
        .hero { margin-top: clamp(44px, 11vh, 110px); max-width: 960px; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .badge { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 36px; max-width: 100%; padding: 7px 18px 7px 14px; background: rgba(12, 12, 16, 0.75); border: 1px solid rgba(249, 115, 22, 0.45); border-radius: var(--radius-pill); backdrop-filter: blur(18px); color: #ffffff; font-size: clamp(11.5px, 2.5vw, 13.5px); font-weight: 600; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .badge__square { width: 9px; height: 9px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.22); flex-shrink: 0; }
        .badge-short { display: none; }
        .headline { margin-top: clamp(20px, 2.6vw, 32px); font-size: clamp(2.3rem, 5.4vw, 4.8rem); font-weight: 700; line-height: 1.15; color: #ffffff; }
        .headline__mask { display: block; overflow: hidden; padding-bottom: 0.08em; }
        .headline__rise { display: block; animation: type-rise 0.85s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
        .headline__muted { color: #d4d4d8; font-weight: 600; }
        .headline__accent { color: var(--orange); font-weight: 700; }
        .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin-top: 34px; }

        .lede { margin: clamp(36px, 7vh, 72px) auto 0; max-width: 820px; color: #e4e4e7; font-size: clamp(14.5px, 1.4vw, 16.5px); font-weight: 400; line-height: 1.75; border-top: 3px solid var(--orange); border-radius: var(--radius-md); padding: 28px 36px; background: rgba(12, 12, 16, 0.9); backdrop-filter: blur(16px); text-align: center; }

        @keyframes type-rise { from { transform: translate3d(0, 118%, 0); } to { transform: translate3d(0, 0, 0); } }

        /* SECTIONS */
        .section { padding: clamp(64px, 7.5vw, 110px) var(--pad-x); position: relative; }
        .section--dark { background: var(--bg-dark); color: var(--text-light); }
        .section--light { background: #121216; color: var(--text-light); }
        .section--gray { background: #0d0d10; color: var(--text-light); }
        .container-box { max-width: 1140px; margin: 0 auto; }
        .sec-header { display: flex; flex-direction: column; gap: 10px; margin-bottom: clamp(32px, 4vw, 52px); border-left: 4px solid var(--orange); padding-left: 20px; }
        .sec-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--orange); letter-spacing: 0.08em; }
        .sec-title { font-size: clamp(1.75rem, 3.2vw, 2.75rem); font-weight: 700; color: #ffffff; margin: 0; }
        .sec-desc { max-width: 650px; font-size: 15px; color: var(--gray-muted); line-height: 1.65; margin: 0; }

        /* TRIPS GRID (ปรับขนาดให้กะทัดรัด สมส่วนทั้งคอมและมือถือ) */
        .filter-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
        .filter-btn { padding: 10px 20px; font-size: 13px; font-weight: 600; border-radius: var(--radius-pill); background: #1a1a20; color: #d4d4d8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; transition: all 0.25s ease; }
        .filter-btn.active { background: linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%); color: #ffffff; border-color: transparent; }
        .trips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 340px)); gap: 22px; justify-content: center; }

        /* ABOUT */
        .about-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; align-items: stretch; }
        .about-story { background: linear-gradient(145deg, #1a1a22 0%, #121217 100%); padding: clamp(26px, 3.5vw, 42px); border-radius: var(--radius-lg); border-top: 4px solid var(--orange); display: flex; flex-direction: column; justify-content: space-between; }
        .about-quote { font-size: clamp(1.3rem, 2.2vw, 1.65rem); font-weight: 600; margin: 0 0 18px 0; color: #ffffff; line-height: 1.4; }
        .about-quote span { color: var(--orange); }
        .about-p { color: #a1a1aa; font-size: 15px; line-height: 1.75; margin: 0 0 26px 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-box { background: rgba(9, 9, 11, 0.65); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: var(--radius-md); padding: 18px 14px; }
        .stat-num { font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 700; color: #ffffff; }
        .stat-num span { color: var(--orange); }
        .stat-label { font-size: 12px; color: #a1a1aa; margin-top: 4px; }
        .about-pillars { display: grid; gap: 16px; }
        .pillar-card { background: #191920; border-radius: var(--radius-lg); padding: 24px; display: flex; gap: 18px; border: 1px solid rgba(255,255,255,0.05); }
        .pillar-num { width: 38px; height: 38px; border-radius: 12px; background: var(--orange); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 14px; }
        .pillar-title { margin: 0 0 6px 0; font-size: 17px; font-weight: 700; color: #ffffff; }

        /* SERVICES */
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 22px; }
        .service-card { background: #1b1b22; padding: 30px 26px; border-radius: var(--radius-lg); transition: transform 0.3s ease; border: 1px solid rgba(255,255,255,0.05); }
        .service-card:hover { transform: translateY(-6px); border-color: rgba(249,115,22,0.35); }
        .service-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--orange); color: white; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .service-title { font-size: 18px; font-weight: 700; margin: 0 0 10px 0; color: white; }
        .service-desc { color: #a1a1aa; line-height: 1.6; font-size: 14px; margin: 0; }

        /* GALLERY */
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 220px; gap: 16px; }
        .gallery-item { position: relative; overflow: hidden; border-radius: var(--radius-lg); cursor: pointer; transition: transform 0.4s ease; }
        .gallery-item:hover { transform: translateY(-5px); }
        .gallery-item--wide { grid-column: span 2; }
        .gallery-item--tall { grid-row: span 2; }
        .gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .gallery-item:hover .gallery-img { transform: scale(1.06); }
        .gallery-caption { position: absolute; inset: auto 10px 10px 10px; padding: 12px 14px; border-radius: 14px; background: rgba(10, 10, 14, 0.82); backdrop-filter: blur(8px); color: white; transition: all 0.3s ease; }
        .gallery-loc { color: var(--orange); font-size: 10px; font-weight: 700; letter-spacing: 0.08em; }
        .gallery-name { font-size: 14px; font-weight: 600; margin-top: 2px; }

        /* CONTACT */
        .contact-wrapper { display: flex; justify-content: center; }
        .contact-info { width: 100%; max-width: 820px; background: #1b1b22; padding: clamp(26px, 4vw, 40px); border-radius: var(--radius-xl); border-top: 5px solid var(--orange); }
        .contact-channels { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin: 28px 0 0; }
        .channel-item { display: flex; align-items: center; gap: 14px; background: rgba(9, 9, 11, 0.5); padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05); }
        .channel-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(249, 115, 22, 0.14); color: var(--orange); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .footer { background: #060608; color: #a1a1aa; padding: 36px var(--pad-x); text-align: center; font-size: 13.5px; border-top: 1px solid rgba(255,255,255,0.06); }

        /* MODAL */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.82); backdrop-filter: blur(12px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: #18181f; padding: 28px; border-radius: var(--radius-lg); position: relative; width: 100%; max-width: 780px; color: white; }
        .modal-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: none; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 820px) {
          .nav__links, .btn--nav.desktop { display: none; }
          .nav__burger { display: flex; }
          .badge { padding: 6px 14px 6px 12px; gap: 8px; max-width: 92vw; }
          .badge-full { display: none; }
          .badge-short { display: inline; font-size: 11.5px; letter-spacing: 0.01em; }
          .headline { font-size: clamp(1.9rem, 8vw, 2.8rem); }
          .lede { padding: 22px 18px; font-size: 14px; margin-top: 28px; }
          .trips-grid { grid-template-columns: minmax(250px, 330px); }
          .about-grid, .gallery-grid, .stats-grid { grid-template-columns: 1fr; }
          .gallery-item--wide { grid-column: span 1; }
          .logo { position: relative; left: 0; transform: none; flex-direction: row; gap: 8px; }
          .logo:hover { transform: none; }
        }
      `}</style>

      <div className="top-crimson-bar" aria-hidden="true" />

      {/* ================= HERO SECTION ================= */}
      <main className="page" id="top">
        <div className="bg" aria-hidden="true">
          <img 
            className="bg-image" 
            src={siteConfig.brand.heroWallpaper} 
            alt="Mountain Background" 
          />
        </div>

        <header className="nav">
          <nav className="nav__links" aria-label="Primary">
            <a className="nav__link" href="#trips" onClick={(e) => handleNavClick(e, '#trips')}>ทริปต่าง ๆ</a>
            <a className="nav__link" href="#about" onClick={(e) => handleNavClick(e, '#about')}>รู้จักกับเรา</a>
            <a className="nav__link" href="#services" onClick={(e) => handleNavClick(e, '#services')}>บริการอื่น ๆ</a>
            <a className="nav__link" href="#gallery" onClick={(e) => handleNavClick(e, '#gallery')}>รูปแกลลอรี่</a>
            <a className="nav__link" href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>ติดต่อเรา</a>
          </nav>

          {/* โลโก้ (รองรับทั้งรูปภาพจากระบบหลังบ้าน และ SVG ต้นฉบับ) */}
          <a className="logo" href="#top" aria-label="PaJaiPaiKhao" onClick={(e) => handleNavClick(e, '#top')}>
            {siteConfig.brand.logoImageUrl.trim() !== '' ? (
              <img src={siteConfig.brand.logoImageUrl} alt={siteConfig.brand.namePrefix} className="logo__img" />
            ) : (
              <svg viewBox="0 0 42 34" aria-hidden="true">
                <polygon points="12,0 30,0 33.2,3.2 15.2,3.2" />
                <polygon points="14.6,5.6 32.6,5.6 35.8,8.8 17.8,8.8" />
                <polygon points="17.2,11.2 35.2,11.2 38.4,14.4 20.4,14.4" />
                <polygon points="3.2,16.8 21.2,16.8 24.4,20 6.4,20" />
                <polygon points="5.8,22.4 23.8,22.4 27,25.6 9,25.6" />
                <polygon points="8.4,28 26.4,28 29.6,31.2 11.6,31.2" />
              </svg>
            )}
            <span className="logo__text">
              {siteConfig.brand.namePrefix}<span>{siteConfig.brand.nameHighlight}</span>
            </span>
          </a>

          {/* ปุ่มติดต่อจองทริป (รองรับการใส่ลิงก์เว็บจองที่นั่งภายนอกได้) */}
          <a
            className="btn btn--nav desktop"
            href={siteConfig.booking.primaryBookingUrl || '#contact'}
            target={!isPrimaryBookingHash && siteConfig.booking.openInNewTab ? '_blank' : undefined}
            rel={!isPrimaryBookingHash && siteConfig.booking.openInNewTab ? 'noopener noreferrer' : undefined}
            onClick={handlePrimaryBookingClick}
          >
            <span className="btn__label">{siteConfig.booking.navButtonText}</span>
            <span className="btn__icon" aria-hidden="true"><MeridianArrow /></span>
          </a>

          <button
            className={`nav__burger ${mobileMenuOpen ? 'is-open' : ''}`}
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="nav__burger-bar" />
            <span className="nav__burger-bar" />
            <span className="nav__burger-bar" />
          </button>
        </header>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="mobile-menu">
            <nav className="mobile-menu__links">
              <a className="mobile-menu__link" href="#trips" onClick={(e) => handleNavClick(e, '#trips')}>ทริปต่าง ๆ</a>
              <a className="mobile-menu__link" href="#about" onClick={(e) => handleNavClick(e, '#about')}>รู้จักกับเรา</a>
              <a className="mobile-menu__link" href="#services" onClick={(e) => handleNavClick(e, '#services')}>บริการอื่น ๆ</a>
              <a className="mobile-menu__link" href="#gallery" onClick={(e) => handleNavClick(e, '#gallery')}>รูปแกลลอรี่</a>
              <a className="mobile-menu__link" href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>ติดต่อเรา</a>
              <a
                className="btn btn--nav"
                style={{ width: 'fit-content', marginTop: '6px' }}
                href={siteConfig.booking.primaryBookingUrl || '#contact'}
                target={!isPrimaryBookingHash && siteConfig.booking.openInNewTab ? '_blank' : undefined}
                rel={!isPrimaryBookingHash && siteConfig.booking.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={handlePrimaryBookingClick}
              >
                <span className="btn__label">{siteConfig.booking.navButtonText}</span>
                <span className="btn__icon" aria-hidden="true"><MeridianArrow /></span>
              </a>
            </nav>
          </div>
        )}

        <section className="hero">
          <div className="badge">
            <span className="badge__square" aria-hidden="true" />
            <span className="badge-full">{siteConfig.hero.badgeFull}</span>
            <span className="badge-short">{siteConfig.hero.badgeShort}</span>
          </div>

          <h1 className="headline">
            <span className="headline__mask"><span className="headline__rise">{siteConfig.hero.headlineLine1}</span></span>
            <span className="headline__mask">
              <span className="headline__rise">
                <span className="headline__muted">{siteConfig.hero.headlinePrefix}</span>{' '}
                <span className="headline__accent">{siteConfig.hero.headlineAccent}</span>
              </span>
            </span>
          </h1>

          <div className="actions">
            <a className="btn btn--light" href="#trips" onClick={(e) => handleNavClick(e, '#trips')}>
              <span className="btn__label">{siteConfig.hero.ctaText}</span>
              <span className="btn__icon" aria-hidden="true"><MeridianArrow /></span>
            </a>
          </div>
        </section>

        <div className="lede">
          <p style={{ margin: 0 }}>{siteConfig.hero.ledeText}</p>
        </div>
      </main>

      {/* ================= 1. ทริปต่าง ๆ (OUR TRIPS) ================= */}
      <section id="trips" className="section section--light">
        <div className="container-box">
          <div className="sec-header reveal-on-scroll">
            <span className="sec-tag">{siteConfig.tripsSection.tag}</span>
            <h2 className="sec-title">{siteConfig.tripsSection.title}</h2>
            <p className="sec-desc">{siteConfig.tripsSection.desc}</p>
          </div>

          <div className="filter-bar reveal-on-scroll">
            {[
              { key: 'all', label: 'ทั้งหมด (All Trips)' },
              { key: 'beginner', label: 'มือใหม่สายชิล (Beginner)' },
              { key: 'intermediate', label: 'สายลุยกำลังดี (Intermediate)' },
              { key: 'hardcore', label: 'สายโหดพิชิตยอด (Adventure)' },
            ].map((tab) => (
              <button key={tab.key} className={`filter-btn ${activeCategory === tab.key ? 'active' : ''}`} onClick={() => setActiveCategory(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="trips-grid">
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="reveal-on-scroll">
                <NotchedTripCard
                  trip={trip}
                  defaultBookingUrl={siteConfig.booking.primaryBookingUrl}
                  openInNewTab={siteConfig.booking.openInNewTab}
                  onInternalNavigate={(hash) => smoothScrollTo(hash)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. รู้จักกับเรา (ABOUT US) ================= */}
      <section id="about" className="section section--dark">
        <div className="container-box">
          <div className="sec-header reveal-on-scroll">
            <span className="sec-tag">{siteConfig.aboutSection.tag}</span>
            <h2 className="sec-title">{siteConfig.aboutSection.title}</h2>
            <p className="sec-desc">{siteConfig.aboutSection.desc}</p>
          </div>
          <div className="about-grid reveal-on-scroll">
            <div className="about-story">
              <div>
                <h3 className="about-quote">
                  {siteConfig.aboutSection.quoteMain}
                  <span>{siteConfig.aboutSection.quoteHighlight}”</span>
                </h3>
                <p className="about-p">{siteConfig.aboutSection.storyText}</p>
              </div>
              <div className="stats-grid">
                {siteConfig.aboutSection.stats.map((st, idx) => (
                  <div key={idx} className="stat-box">
                    <div className="stat-num">{st.num}<span>{st.suffix}</span></div>
                    <div className="stat-label">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-pillars">
              {siteConfig.aboutSection.pillars.map((pillar, idx) => (
                <div key={idx} className="pillar-card">
                  <div className="pillar-num">{pillar.num}</div>
                  <div>
                    <h4 className="pillar-title">{pillar.title}</h4>
                    <p style={{ color: '#a1a1aa', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. บริการอื่น ๆ (OTHER SERVICES) ================= */}
      <section id="services" className="section section--gray">
        <div className="container-box">
          <div className="sec-header reveal-on-scroll">
            <span className="sec-tag">{siteConfig.servicesSection.tag}</span>
            <h2 className="sec-title">{siteConfig.servicesSection.title}</h2>
            <p className="sec-desc">{siteConfig.servicesSection.desc}</p>
          </div>
          <div className="services-grid reveal-on-scroll">
            {siteConfig.servicesSection.items.map((srv, idx) => (
              <div key={srv.id || idx} className="service-card">
                <div className="service-icon">
                  {idx % 2 === 0 ? <ShieldCheck size={24} /> : <MapPin size={24} />}
                </div>
                <h3 className="service-title">{srv.title}</h3>
                <p className="service-desc">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. รูปแกลลอรี่ (GALLERY) ================= */}
      <section id="gallery" className="section section--dark">
        <div className="container-box">
          <div className="sec-header reveal-on-scroll">
            <span className="sec-tag">{siteConfig.gallerySection.tag}</span>
            <h2 className="sec-title">{siteConfig.gallerySection.title}</h2>
          </div>
          <div className="gallery-grid reveal-on-scroll">
            {siteConfig.gallerySection.items.map((item) => (
              <div
                key={item.id}
                className={`gallery-item ${item.spanClass || ''}`}
                onClick={() => openLightbox(item.image, item.name)}
              >
                <img className="gallery-img" src={item.image} alt={item.name} />
                <div className="gallery-caption">
                  {item.location && <div className="gallery-loc">{item.location}</div>}
                  <div className="gallery-name">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. ติดต่อเรา (CONTACT US) ================= */}
      <section id="contact" className="section section--light">
        <div className="container-box">
          <div className="sec-header reveal-on-scroll">
            <span className="sec-tag">{siteConfig.contactSection.tag}</span>
            <h2 className="sec-title">{siteConfig.contactSection.title}</h2>
          </div>
          <div className="contact-wrapper reveal-on-scroll">
            <div className="contact-info">
              <span className="sec-tag">{siteConfig.contactSection.boxTag}</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginTop: '8px', marginBottom: '12px' }}>
                {siteConfig.contactSection.boxTitle}
              </h3>

              {/* หากตั้งค่าลิงก์จองภายนอกไว้ จะแสดงปุ่มลัดไปยังเว็บจองที่นั่งด้วย */}
              {!isPrimaryBookingHash && (
                <div className="mb-4">
                  <a
                    href={siteConfig.booking.primaryBookingUrl}
                    target={siteConfig.booking.openInNewTab ? '_blank' : undefined}
                    rel={siteConfig.booking.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-[#ea580c] transition"
                  >
                    <span>เข้าสู่เว็บไซต์ระบบจองที่นั่งออนไลน์</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              <div className="contact-channels">
                <div className="channel-item">
                  <div className="channel-icon"><MessageCircle size={20} /></div>
                  <div>
                    <div style={{ color: '#a1a1aa', fontSize: '11px' }}>LINE OFFICIAL</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14.5px' }}>{siteConfig.contactSection.line}</div>
                  </div>
                </div>
                <div className="channel-item">
                  <div className="channel-icon"><Phone size={20} /></div>
                  <div>
                    <div style={{ color: '#a1a1aa', fontSize: '11px' }}>HOTLINE</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14.5px' }}>{siteConfig.contactSection.phone}</div>
                  </div>
                </div>
                <div className="channel-item">
                  <div className="channel-icon"><MapPin size={20} /></div>
                  <div>
                    <div style={{ color: '#a1a1aa', fontSize: '11px' }}>จุดนัดพบหลัก</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14.5px' }}>{siteConfig.contactSection.pickup}</div>
                  </div>
                </div>
                <div className="channel-item">
                  <div className="channel-icon"><Mail size={20} /></div>
                  <div>
                    <div style={{ color: '#a1a1aa', fontSize: '11px' }}>EMAIL</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14.5px' }}>{siteConfig.contactSection.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <strong style={{ color: '#ffffff' }}>
          {siteConfig.brand.namePrefix}<span style={{ color: '#f97316' }}>{siteConfig.brand.nameHighlight}</span>
        </strong>{' '}
        — {siteConfig.hero.headlineLine1} {siteConfig.hero.headlinePrefix}{siteConfig.hero.headlineAccent}
        <br /><br />
        <span>{siteConfig.contactSection.footerText}</span>
        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#f97316] transition cursor-pointer bg-transparent border-0"
          >
            <Settings size={13} /> ตั้งค่าเว็บไซต์ (Admin CMS)
          </button>
        </div>
      </footer>

      {/* ================= ระบบหลังบ้าน (ADMIN CMS DRAWER) ================= */}
      {adminOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative flex h-[92vh] max-h-[850px] w-full max-w-4xl flex-col rounded-2xl bg-[#121217] text-white shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden">
            
            {/* ส่วนหัว Admin */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#181820]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f97316] text-white">
                  <Settings size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white m-0">ระบบจัดการหลังบ้าน (Admin CMS)</h2>
                  <p className="text-xs text-zinc-400 m-0">แก้ไขโลโก้ ข้อความ ทริป และลิงก์ระบบจองที่นั่งแบบ Real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSiteConfig(INITIAL_SITE_CONFIG)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10 cursor-pointer"
                  title="รีเซ็ตกลับเป็นค่าเริ่มต้น"
                >
                  <RotateCcw size={13} /> รีเซ็ตค่าเริ่มต้น
                </button>
                <button
                  type="button"
                  onClick={() => setAdminOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-[#f97316] cursor-pointer border-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* แถบเมนูเลือกหมวดหมู่การตั้งค่า */}
            <div className="flex overflow-x-auto border-b border-white/10 bg-[#15151c] px-6 py-2.5 gap-2">
              {[
                { id: 'brand', label: '1. โลโก้ & ลิงก์จองทริป', icon: ImageIcon },
                { id: 'hero', label: '2. ข้อความหน้าแรก (Hero)', icon: Type },
                { id: 'trips', label: '3. จัดการทริป (01)', icon: Compass },
                { id: 'sections', label: '4. เนื้อหาส่วนอื่น ๆ (02-05)', icon: Layers },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAdminTab(t.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition cursor-pointer border-0 ${
                      adminTab === t.id
                        ? 'bg-[#f97316] text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={14} /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* เนื้อหาฟอร์มการตั้งค่า */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: โลโก้ & ลิงก์จองทริป */}
              {adminTab === 'brand' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-4">
                    <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                      เปลี่ยนรูปโลโก้ & ชื่อแบรนด์
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        URL รูปโลโก้ (เว้นว่างไว้หากต้องการใช้โลโก้กราฟิก SVG ต้นฉบับ)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.brand.logoImageUrl}
                        onChange={(e) => updateSectionField('brand', 'logoImageUrl', e.target.value)}
                        placeholder="https://example.com/my-logo.png"
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2.5 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ชื่อแบรนด์ส่วนหน้า (สีขาว)</label>
                        <input
                          type="text"
                          value={siteConfig.brand.namePrefix}
                          onChange={(e) => updateSectionField('brand', 'namePrefix', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ชื่อแบรนด์ส่วนท้าย (สีส้ม)</label>
                        <input
                          type="text"
                          value={siteConfig.brand.nameHighlight}
                          onChange={(e) => updateSectionField('brand', 'nameHighlight', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">URL รูปวอลเปเปอร์พื้นหลังหน้าแรก (ภูเขาหิมะ)</label>
                      <input
                        type="text"
                        value={siteConfig.brand.heroWallpaper}
                        onChange={(e) => updateSectionField('brand', 'heroWallpaper', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#f97316]/30 bg-[#181820] p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                        ตั้งค่าลิงก์ติดต่อจองทริป / ระบบจองที่นั่งออนไลน์
                      </h3>
                      <span className="rounded-full bg-[#f97316]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#f97316]">
                        รองรับอนาคต
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed m-0">
                      สามารถใส่เป็น <code className="text-orange-400">#contact</code> เพื่อเลื่อนลงไปส่วนติดต่อด้านล่าง หรือใส่เป็นลิงก์เว็บไซต์ระบบจองที่นั่ง เช่น <code className="text-orange-400">https://booking.pajaipaikhao.com</code> หรือลิงก์ LINE Official ได้เลยครับ
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ข้อความบนปุ่มมุมขวาบน</label>
                      <input
                        type="text"
                        value={siteConfig.booking.navButtonText}
                        onChange={(e) => updateSectionField('booking', 'navButtonText', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        ลิงก์ปลายทางเมื่อกดปุ่มจองทริป (URL เว็บจองที่นั่ง หรือ #contact)
                      </label>
                      <input
                        type="text"
                        value={siteConfig.booking.primaryBookingUrl}
                        onChange={(e) => updateSectionField('booking', 'primaryBookingUrl', e.target.value)}
                        placeholder="เช่น #contact หรือ https://booking.pajaipaikhao.com"
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2.5 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={siteConfig.booking.openInNewTab}
                        onChange={(e) => updateSectionField('booking', 'openInNewTab', e.target.checked)}
                        className="h-4 w-4 accent-[#f97316] rounded"
                      />
                      <span>เปิดลิงก์เว็บจองที่นั่งในแท็บใหม่ (Open in new tab)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: ข้อความหน้าแรก (Hero Section) */}
              {adminTab === 'hero' && (
                <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                    แก้ไขข้อความส่วนหน้าแรก (Hero Section)
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ป้ายแคปซูลด้านบน (แสดงบนคอมพิวเตอร์)</label>
                    <input
                      type="text"
                      value={siteConfig.hero.badgeFull}
                      onChange={(e) => updateSectionField('hero', 'badgeFull', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ป้ายแคปซูลแบบสั้น (แสดงบนมือถือ ไม่ให้ล้นกรอบ)</label>
                    <input
                      type="text"
                      value={siteConfig.hero.badgeShort}
                      onChange={(e) => updateSectionField('hero', 'badgeShort', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">พาดหัวบรรทัดที่ 1</label>
                      <input
                        type="text"
                        value={siteConfig.hero.headlineLine1}
                        onChange={(e) => updateSectionField('hero', 'headlineLine1', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">คำเชื่อมบรรทัด 2</label>
                      <input
                        type="text"
                        value={siteConfig.hero.headlinePrefix}
                        onChange={(e) => updateSectionField('hero', 'headlinePrefix', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ข้อความไฮไลต์สีส้ม</label>
                      <input
                        type="text"
                        value={siteConfig.hero.headlineAccent}
                        onChange={(e) => updateSectionField('hero', 'headlineAccent', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ข้อความบนปุ่มกลางหน้าจอ</label>
                    <input
                      type="text"
                      value={siteConfig.hero.ctaText}
                      onChange={(e) => updateSectionField('hero', 'ctaText', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">ข้อความเกริ่นนำ (กล่องข้อความด้านล่าง)</label>
                    <textarea
                      rows={4}
                      value={siteConfig.hero.ledeText}
                      onChange={(e) => updateSectionField('hero', 'ledeText', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2.5 text-sm text-white focus:border-[#f97316] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: จัดการทริป (01) */}
              {adminTab === 'trips' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-4">
                    <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                      หัวข้อส่วนที่ 01 (ทริปต่าง ๆ)
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">ป้ายกำกับ (Tag)</label>
                      <input
                        type="text"
                        value={siteConfig.tripsSection.tag}
                        onChange={(e) => updateSectionField('tripsSection', 'tag', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">หัวข้อหลัก (Title)</label>
                      <input
                        type="text"
                        value={siteConfig.tripsSection.title}
                        onChange={(e) => updateSectionField('tripsSection', 'title', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">คำอธิบาย (Description)</label>
                      <textarea
                        rows={2}
                        value={siteConfig.tripsSection.desc}
                        onChange={(e) => updateSectionField('tripsSection', 'desc', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white m-0">
                      รายการการ์ดทริปทั้งหมด ({siteConfig.tripsSection.items.length} ทริป)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddTrip}
                      className="flex items-center gap-1.5 rounded-xl bg-[#f97316] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ea580c] cursor-pointer border-0"
                    >
                      <Plus size={15} /> เพิ่มทริปใหม่
                    </button>
                  </div>

                  {siteConfig.tripsSection.items.map((trip, index) => (
                    <div key={trip.id} className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <span className="text-xs font-bold text-[#f97316]">ทริปที่ #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="flex items-center gap-1 rounded-lg bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/30 cursor-pointer border-0"
                        >
                          <Trash2 size={13} /> ลบทริปนี้
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">ชื่อทริป</label>
                          <input
                            type="text"
                            value={trip.title}
                            onChange={(e) => handleTripChange(trip.id, 'title', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">หมวดหมู่ (ใช้กรองปุ่ม)</label>
                          <select
                            value={trip.category}
                            onChange={(e) => handleTripChange(trip.id, 'category', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          >
                            <option value="beginner">มือใหม่สายชิล (beginner)</option>
                            <option value="intermediate">สายลุยกำลังดี (intermediate)</option>
                            <option value="hardcore">สายโหดพิชิตยอด (hardcore)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">ป้ายระดับบนภาพ (Badge)</label>
                          <input
                            type="text"
                            value={trip.badge}
                            onChange={(e) => handleTripChange(trip.id, 'badge', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">สถานที่ (Location)</label>
                          <input
                            type="text"
                            value={trip.location}
                            onChange={(e) => handleTripChange(trip.id, 'location', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">ระยะเวลา (Duration)</label>
                          <input
                            type="text"
                            value={trip.duration}
                            onChange={(e) => handleTripChange(trip.id, 'duration', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">ราคา (Price)</label>
                          <input
                            type="text"
                            value={trip.price}
                            onChange={(e) => handleTripChange(trip.id, 'price', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-400 mb-1">สถานะที่ว่าง (Slots)</label>
                          <input
                            type="text"
                            value={trip.slots}
                            onChange={(e) => handleTripChange(trip.id, 'slots', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">รายละเอียดทริป</label>
                          <textarea
                            rows={2}
                            value={trip.desc}
                            onChange={(e) => handleTripChange(trip.id, 'desc', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-zinc-400 mb-1">URL รูปปกทริป</label>
                          <input
                            type="text"
                            value={trip.image}
                            onChange={(e) => handleTripChange(trip.id, 'image', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-[#f97316] font-semibold mb-1">
                            ลิงก์จองที่นั่งเฉพาะทริปนี้ (หากเว้นว่างจะใช้ลิงก์จองหลักของเว็บ)
                          </label>
                          <input
                            type="text"
                            value={trip.bookingUrl || ''}
                            onChange={(e) => handleTripChange(trip.id, 'bookingUrl', e.target.value)}
                            placeholder="เช่น https://booking.pajaipaikhao.com/trip-1 หรือเว้นว่างไว้"
                            className="w-full rounded-xl border border-[#f97316]/30 bg-[#101015] px-3 py-2 text-sm text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: เนื้อหาส่วนอื่น ๆ (02 - 05) */}
              {adminTab === 'sections' && (
                <div className="space-y-6">
                  {/* 02 ABOUT */}
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-3">
                    <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                      02 // รู้จักกับเรา (About Us)
                    </h3>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">หัวข้อหลัก (Title)</label>
                      <input
                        type="text"
                        value={siteConfig.aboutSection.title}
                        onChange={(e) => updateSectionField('aboutSection', 'title', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">คำโปรย (Description)</label>
                      <textarea
                        rows={2}
                        value={siteConfig.aboutSection.desc}
                        onChange={(e) => updateSectionField('aboutSection', 'desc', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">เนื้อหาประวัติ (Story)</label>
                      <textarea
                        rows={3}
                        value={siteConfig.aboutSection.storyText}
                        onChange={(e) => updateSectionField('aboutSection', 'storyText', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  {/* 03 SERVICES */}
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-3">
                    <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                      03 // บริการอื่น ๆ (Other Services)
                    </h3>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">หัวข้อหลัก (Title)</label>
                      <input
                        type="text"
                        value={siteConfig.servicesSection.title}
                        onChange={(e) => updateSectionField('servicesSection', 'title', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                      />
                    </div>
                    {siteConfig.servicesSection.items.map((srv, idx) => (
                      <div key={srv.id || idx} className="rounded-xl border border-white/5 bg-[#121217] p-3.5 space-y-2">
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const updated = [...siteConfig.servicesSection.items];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            updateSectionField('servicesSection', 'items', updated);
                          }}
                          className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-1.5 text-sm font-semibold text-white"
                        />
                        <textarea
                          rows={2}
                          value={srv.desc}
                          onChange={(e) => {
                            const updated = [...siteConfig.servicesSection.items];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            updateSectionField('servicesSection', 'items', updated);
                          }}
                          className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-1.5 text-xs text-zinc-300"
                        />
                      </div>
                    ))}
                  </div>

                  {/* 05 CONTACT */}
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-3">
                    <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                      05 // ข้อมูลการติดต่อ (Contact Us)
                    </h3>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">หัวข้อหลัก (Title)</label>
                      <input
                        type="text"
                        value={siteConfig.contactSection.title}
                        onChange={(e) => updateSectionField('contactSection', 'title', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">ข้อความชวนคุยในกล่องติดต่อ</label>
                      <input
                        type="text"
                        value={siteConfig.contactSection.boxTitle}
                        onChange={(e) => updateSectionField('contactSection', 'boxTitle', e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">LINE Official</label>
                        <input
                          type="text"
                          value={siteConfig.contactSection.line}
                          onChange={(e) => updateSectionField('contactSection', 'line', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">เบอร์โทรศัพท์ (Hotline)</label>
                        <input
                          type="text"
                          value={siteConfig.contactSection.phone}
                          onChange={(e) => updateSectionField('contactSection', 'phone', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">จุดนัดพบหลัก</label>
                        <input
                          type="text"
                          value={siteConfig.contactSection.pickup}
                          onChange={(e) => updateSectionField('contactSection', 'pickup', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">อีเมล (Email)</label>
                        <input
                          type="text"
                          value={siteConfig.contactSection.email}
                          onChange={(e) => updateSectionField('contactSection', 'email', e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ส่วนท้าย Admin */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#181820] px-6 py-4">
              <div className="text-xs text-zinc-400">
                {saveToast ? (
                  <span className={`inline-flex items-center gap-1.5 font-semibold ${saveStatus.includes('ผิดพลาด') ? 'text-red-400' : 'text-emerald-400'}`}>
                    <Check size={15} /> {saveStatus}
                  </span>
                ) : (
                  <span>การแก้ไขทั้งหมดจะถูกบันทึกลงฐานข้อมูล (Firebase) ถาวร</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveToCloud}
                  className="rounded-xl bg-[#f97316] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#ea580c] transition cursor-pointer border-0"
                >
                  บันทึกข้อมูลลง Cloud
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox Modal สำหรับรูปแกลลอรี่ */}
      {modalState.isOpen && (
        <div className="modal-backdrop" onClick={() => setModalState({ isOpen: false })}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalState({ isOpen: false })}><X size={18} /></button>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f97316', marginBottom: '6px' }}>PAJAIPAIKHAO GALLERY</div>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>{modalState.data?.title}</h3>
            <img src={modalState.data?.imgUrl} alt={modalState.data?.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover', borderRadius: '14px' }} />
          </div>
        </div>
      )}
    </div>
  );
}