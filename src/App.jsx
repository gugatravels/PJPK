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
  Check,
  Lock,
  BookOpen,
  Upload,
  Loader2
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const DISC = 46; 
const BLOCK = 58; 
const FILLET = 20; 

// --- ข้อมูลเริ่มต้นของเว็บไซต์ทั้งหมด ---
const INITIAL_SITE_CONFIG = {
  brand: {
    namePrefix: 'PAJAI',
    nameHighlight: 'PAIKHAO',
    logoImageUrl: '', 
    heroWallpaper: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
  booking: {
    navButtonText: 'ติดต่อจองทริป',
    primaryBookingUrl: '#contact', 
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
        bookingUrl: '', 
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
    title: 'บันทึกการเดินทาง — เรื่องเล่าและภาพความทรงจำบนยอดเขา',
    desc: 'ภาพบรรยากาศจริงและเรื่องราวความประทับใจจากทริปที่ผ่านมา กดที่การ์ดเพื่ออ่านเรื่องราวแบบเต็มๆ ได้เลย',
    items: [
      {
        id: 1,
        location: 'จ.เชียงใหม่ • 2,225 MASL',
        date: 'ทริปธันวาคม',
        name: 'แสงแรกเหนือทะเลหมอก — ดอยหลวงเชียงดาว',
        image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80',
        story: 'เช้าวันนั้นอากาศหนาวจัด อุณหภูมิเลขตัวเดียว เราตื่นกันตั้งแต่ตีสี่เพื่อเดินขึ้นมายังจุดชมวิวสูงสุดเพื่อรอแสงแรก...\n\nพอพระอาทิตย์เริ่มแตะขอบฟ้า ทะเลหมอกที่หนาแน่นก็ค่อยๆ เผยตัวให้เห็นเป็นสีทองอร่าม ทุกความเหนื่อยล้าจากการเดินขึ้นเขาเมื่อวานมันหายไปเป็นปลิดทิ้ง มีแต่เสียงกดชัตเตอร์และรอยยิ้มของทุกคนในแก๊ง ธรรมชาติมันมีเวทมนตร์แบบนี้นี่เอง'
      },
      {
        id: 2,
        location: 'จ.จันทบุรี • เขาผาหินกูบ',
        date: 'ทริปพฤศจิกายน',
        name: 'บทสนทนาใต้หมู่ดาวและมิตรภาพรอบกองไฟ',
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80',
        story: 'หลังกินมื้อค่ำสุดฟินเสร็จ ทุกคนมานั่งล้อมวงกันหน้าเต็นท์ บนยอดเขาที่ไม่มีสัญญาณโทรศัพท์ ไม่มีแจ้งเตือนเรื่องงานให้กวนใจ\n\nมีแค่เสียงลมหนาวพัดผ่านยอดไม้ และบทสนทนาของคนที่เพิ่งรู้จักกันบนรถตู้เมื่อเช้า แต่กลับคุยกันถูกคอและหัวเราะด้วยกันเหมือนเพื่อนสนิทที่รู้จักกันมานานหลายปี'
      },
      {
        id: 3,
        location: 'จ.ตาก • เลอกวาเดาะ',
        date: 'ทริปมกราคม',
        name: 'ก้าวไปพร้อมกันบนสันเขา — ไม่มีใครถูกทิ้งไว้ข้างหลัง',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
        story: 'ช่วงทางชันสุดท้ายก่อนถึงจุดกางเต็นท์ ทุกคนหอบแฮ่กแต่ไม่มีใครยอมแพ้ เสียง "สู้ๆ นะ อีกนิดเดียวถึงแล้ว!" ดังส่งต่อกันมาเป็นทอดๆ จากหัวขบวนถึงท้ายขบวน\n\nการเดินป่ากับพาใจไปเขาสอนให้เรารู้จักจังหวะก้าวเดินของตัวเอง และได้เห็นน้ำใจของเพื่อนร่วมทางที่คอยยื่นมือช่วยดึงกันขึ้นไปจนถึงยอดเขาพร้อมกัน'
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

// --- Firebase Configuration (โปรเจกต์ webpajai สำหรับเก็บภาพและข้อมูลเว็บหลัก) ---
const userFirebaseConfig = {
  apiKey: "AIzaSyACc9AJtNY_iZYbP8c_itekoPKN68C0Lkg",
  authDomain: "webpajai.firebaseapp.com",
  databaseURL: "https://webpajai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webpajai",
  storageBucket: "webpajai.firebasestorage.app",
  messagingSenderId: "885378805538",
  appId: "1:885378805538:web:2f0ebe506063007c763f7b"
};

let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  app = !getApps().length ? initializeApp(userFirebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.warn('Firebase initialization skipped or failed, running in local cache mode.');
}

// --- ฟังก์ชันบีบอัดภาพอัตโนมัติ (ปรับขนาดให้เหมาะสมกับ Firestore 100% ไม่เกินลิมิต 1MB) ---
const compressImageFile = (file, maxWidth = 900, quality = 0.72) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // แปลงเป็น JPEG คุณภาพสูงที่มีขนาดไฟล์กะทัดรัด ताकिเซฟลง Firestore ได้แน่นอน
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// --- ปุ่มอัปโหลดรูปภาพจากเครื่อง (รองรับทั้ง Firebase Storage + Smart Fallback) ---
function ImageUploadField({ label, value, onChange, folder = 'uploads', maxWidth = 900, placeholder = 'https://...' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadInfo('');
    try {
      // 1. ลองอัปโหลดขึ้น Firebase Storage เข้าโฟลเดอร์ pajai/... ให้ตรงกับ Storage Rules
      if (storage) {
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const fileRef = storageRef(storage, `pajai/${folder}/${Date.now()}_${safeName}`);
          await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(fileRef);
          onChange(downloadUrl);
          setUploadInfo('✅ อัปโหลดขึ้น Firebase Storage สำเร็จ! (อย่าลืมกดปุ่มบันทึกด้านล่าง)');
          setUploading(false);
          return;
        } catch (storageErr) {
          console.warn('Storage upload fallback to compressed data URL:', storageErr);
        }
      }
      // 2. Fallback: บีบอัดภาพให้ขนาดพอเหมาะเพื่อบันทึกลง Firestore Database โดยตรง
      const compressedDataUrl = await compressImageFile(file, maxWidth, 0.72);
      onChange(compressedDataUrl);
      setUploadInfo('เตรียมรูปภาพพร้อมแล้ว! กดปุ่ม "บันทึกข้อมูลลง Cloud" ด้านล่างเพื่อเซฟขึ้น Firebase');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadInfo('เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-zinc-300">{label}</label>}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-white/10 bg-[#101015] px-3.5 py-2 text-sm text-white focus:border-[#f97316] focus:outline-none"
        />
        <label
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition cursor-pointer shrink-0 border border-[#f97316]/40 ${
            uploading ? 'bg-zinc-700 cursor-wait' : 'bg-[#f97316]/20 hover:bg-[#f97316] text-[#f97316] hover:text-white'
          }`}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          <span>{uploading ? 'กำลังประมวลผล...' : 'อัปโหลดรูปภาพ'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
      </div>
      {value && (
        <div className="flex items-center gap-3 pt-1">
          <img
            src={value}
            alt="Preview"
            className="h-12 w-20 rounded-lg object-cover border border-white/10 bg-black/40"
          />
          <span className="text-[11px] text-emerald-400 truncate max-w-md">
            {uploadInfo || (value.startsWith('data:image') ? 'รูปภาพจากเครื่องพร้อมบันทึกขึ้น Firebase' : 'ลิงก์รูปภาพพร้อมใช้งาน')}
          </span>
        </div>
      )}
    </div>
  );
}

// --- รหัสผ่านสำหรับเข้าระบบหลังบ้าน ---
const SECRET_ADMIN_PASSWORD = 'pajai1234'; 

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
        <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#1a1a20]">
          <img
            src={trip.image}
            alt={trip.title}
            className={`absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] ${tone}`}
          />
          <div aria-hidden className="absolute inset-0 bg-black/25 transition-opacity duration-500 group-hover:bg-black/10" />
          
          {trip.badge && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-3 z-10">
              <span className="rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                {trip.badge}
              </span>
            </div>
          )}
        </div>

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

        <span
          aria-hidden
          className="absolute bottom-0 right-0 z-20 flex items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:scale-105 group-hover:bg-[#f97316] group-hover:text-white"
          style={{ width: DISC, height: DISC }}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

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

// --- การ์ดเรื่องเล่าแกลลอรี่ (Minimalist Story Card อ่านง่ายสบายตา) ---
function StoryGalleryCard({ item, onReadMore }) {
  return (
    <article
      onClick={() => onReadMore(item)}
      className="group flex flex-col rounded-[22px] bg-[#14141a] border border-white/[0.07] overflow-hidden cursor-pointer hover:border-[#f97316]/45 transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1a1a22]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141a] via-transparent to-transparent opacity-60" />
        {item.location && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1 text-[10.5px] font-semibold text-white">
              <MapPin size={11} className="text-[#f97316]" /> {item.location}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-5 sm:p-6">
        {item.date && (
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#f97316] mb-1.5">
            {item.date}
          </div>
        )}
        <h3 className="text-[17px] sm:text-[18px] font-bold text-white leading-snug mb-2.5 group-hover:text-[#f97316] transition-colors">
          {item.name}
        </h3>
        <p className="text-[13.5px] sm:text-[14px] text-[#a1a1aa] leading-[1.75] line-clamp-3 mb-4 flex-grow font-normal">
          {item.story || 'คลิกเพื่ออ่านเรื่องราวความประทับใจจากทริปนี้...'}
        </p>
        <div className="pt-3 border-t border-white/[0.07] flex items-center justify-between text-xs font-semibold text-zinc-300 group-hover:text-white">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} className="text-[#f97316]" /> อ่านบันทึกทริปนี้ต่อ
          </span>
          <ArrowUpRight size={15} className="text-[#f97316] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [siteConfig, setSiteConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('pajai_siteConfig_cache');
      if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
      }
    }
    return INITIAL_SITE_CONFIG;
  });

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  // States สำหรับระบบหลังบ้าน
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('brand');
  const [saveToast, setSaveToast] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [cloudSyncState, setCloudSyncState] = useState('connecting'); // 'connected' | 'error' | 'connecting'
  const [cloudErrorDetail, setCloudErrorDetail] = useState('');

  // --- Auth & Sync (เชื่อมต่อ Firestore ทันทีโดยไม่บล็อกหากไม่ได้เปิด Anonymous Auth) ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        // ไม่ต้องบล็อกการทำงานหากยังไม่ได้เปิด Anonymous Auth ใน Console
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ซิงค์ข้อมูลจาก Firestore ทันทีที่เปิดเว็บ (ไม่รอตัวแปร user)
  useEffect(() => {
    if (!db) {
      setCloudSyncState('error');
      setCloudErrorDetail('ไม่พบการเชื่อมต่อฐานข้อมูล Firestore');
      return;
    }
    
    const configDocRef = doc(db, 'pajai_landing_settings', 'mainConfig');
    const unsubscribe = onSnapshot(
      configDocRef,
      (docSnap) => {
        setCloudSyncState('connected');
        setCloudErrorDetail('');
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          setSiteConfig(cloudData);
          localStorage.setItem('pajai_siteConfig_cache', JSON.stringify(cloudData));
        } else {
          setDoc(configDocRef, INITIAL_SITE_CONFIG).catch((err) => {
            console.warn('Initial Firestore creation error:', err);
          });
        }
      },
      (error) => {
        console.warn('Firestore sync error:', error);
        setCloudSyncState('error');
        setCloudErrorDetail(error.code || error.message || 'ไม่สามารถเข้าถึงฐานข้อมูลได้');
      }
    );

    return () => unsubscribe();
  }, []);

  // --- Functions ---
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

  const handlePrimaryBookingClick = (e) => {
    const url = siteConfig.booking.primaryBookingUrl.trim();
    if (url.startsWith('#')) {
      e.preventDefault();
      if (mobileMenuOpen) setMobileMenuOpen(false);
      smoothScrollTo(url);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === SECRET_ADMIN_PASSWORD) {
      setShowLoginModal(false);
      setAdminPassword('');
      setLoginError(false);
      setAdminOpen(true);
    } else {
      setLoginError(true);
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
  }, [activeCategory, siteConfig.tripsSection.items, siteConfig.gallerySection.items]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (modalState.isOpen) setModalState({ isOpen: false, type: null, data: null });
        if (showLoginModal) { setShowLoginModal(false); setAdminPassword(''); setLoginError(false); }
        if (adminOpen) setAdminOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, modalState.isOpen, adminOpen, showLoginModal]);

  const filteredTrips = activeCategory === 'all'
    ? siteConfig.tripsSection.items
    : siteConfig.tripsSection.items.filter((trip) => trip.category === activeCategory);

  const openLightbox = (item) => {
    setModalState({ isOpen: true, type: 'gallery', data: item });
  };

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
      desc: 'คำอธิบายไฮไลต์ของทริปบรรยากาศธรรมชาติ',
      price: '฿3,590',
      priceSub: '/ ท่าน',
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

  const handleGalleryChange = (itemId, field, value) => {
    setSiteConfig((prev) => ({
      ...prev,
      gallerySection: {
        ...prev.gallerySection,
        items: prev.gallerySection.items.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleAddGalleryItem = () => {
    const newItem = {
      id: Date.now(),
      location: 'จ.เชียงใหม่',
      date: 'บันทึกทริปล่าสุด',
      name: 'เรื่องราวการเดินทางครั้งใหม่บนยอดดอย',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
      story: 'ทุกการเดินทางมีเรื่องราวซ่อนอยู่เสมอ พิมพ์เล่าความประทับใจ มิตรภาพ หรือความสวยงามของธรรมชาติในทริปนี้ให้ทุกคนได้อ่านที่นี่...\n\nสามารถเว้นบรรทัดเพื่อให้อ่านง่ายสบายตาได้เลยครับ'
    };
    setSiteConfig((prev) => ({
      ...prev,
      gallerySection: {
        ...prev.gallerySection,
        items: [newItem, ...prev.gallerySection.items],
      },
    }));
  };

  const handleDeleteGalleryItem = (itemId) => {
    setSiteConfig((prev) => ({
      ...prev,
      gallerySection: {
        ...prev.gallerySection,
        items: prev.gallerySection.items.filter((item) => item.id !== itemId),
      },
    }));
  };

  const triggerSaveNotification = (message = 'อัปเดตข้อมูลเรียบร้อยแล้ว!') => {
    setSaveStatus(message);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 5000);
  };

  const handleSaveToCloud = async () => {
    setIsSavingCloud(true);
    // 1. บันทึกสำรองลงในเครื่องก่อนเสมอ
    try {
      localStorage.setItem('pajai_siteConfig_cache', JSON.stringify(siteConfig));
    } catch (e) {
      console.warn('LocalStorage quota exceeded:', e);
    }
    
    // 2. บันทึกขึ้น Firebase Firestore (โปรเจกต์ webpajai) โดยตรง
    if (db) {
      try {
        const configDocRef = doc(db, 'pajai_landing_settings', 'mainConfig');
        await setDoc(configDocRef, {
          ...siteConfig,
          lastUpdated: new Date().toISOString()
        });
        setCloudSyncState('connected');
        setCloudErrorDetail('');
        triggerSaveNotification('✅ บันทึกขึ้น Firebase (webpajai) สำเร็จเรียบร้อยแล้ว!');
      } catch (error) {
        console.error('Firebase Save Error:', error);
        setCloudSyncState('error');
        const reason = error?.code === 'permission-denied'
          ? 'ติดสิทธิ์ Permission Denied (กรุณาเปิด Rules ใน Firebase Console เมนู Firestore Database)'
          : (error?.message || 'เกิดข้อผิดพลาดในการส่งข้อมูลขึ้น Firebase');
        setCloudErrorDetail(reason);
        triggerSaveNotification(`⚠️ ผิดพลาด: ${reason}`);
      }
    } else {
      triggerSaveNotification('⚠️ ผิดพลาด: ไม่พบการเชื่อมต่อ Firebase');
    }
    setIsSavingCloud(false);
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

        /* TRIPS GRID */
        .filter-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
        .filter-btn { padding: 10px 20px; font-size: 13px; font-weight: 600; border-radius: var(--radius-pill); background: #1a1a20; color: #d4d4d8; border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; transition: all 0.25s ease; }
        .filter-btn.active { background: linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%); color: #ffffff; border-color: transparent; }
        .trips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 340px)); gap: 22px; justify-content: center; }

        /* STORY GALLERY GRID (Minimalist Editorial Cards) */
        .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 26px; }

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

        /* CONTACT */
        .contact-wrapper { display: flex; justify-content: center; }
        .contact-info { width: 100%; max-width: 820px; background: #1b1b22; padding: clamp(26px, 4vw, 40px); border-radius: var(--radius-xl); border-top: 5px solid var(--orange); }
        .contact-channels { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin: 28px 0 0; }
        .channel-item { display: flex; align-items: center; gap: 14px; background: rgba(9, 9, 11, 0.5); padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05); }
        .channel-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(249, 115, 22, 0.14); color: var(--orange); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .footer { background: #060608; color: #a1a1aa; padding: 36px var(--pad-x); text-align: center; font-size: 13.5px; border-top: 1px solid rgba(255,255,255,0.06); }

        @media (max-width: 820px) {
          .nav__links, .btn--nav.desktop { display: none; }
          .nav__burger { display: flex; }
          .badge { padding: 6px 14px 6px 12px; gap: 8px; max-width: 92vw; }
          .badge-full { display: none; }
          .badge-short { display: inline; font-size: 11.5px; letter-spacing: 0.01em; }
          .headline { font-size: clamp(1.9rem, 8vw, 2.8rem); }
          .lede { padding: 22px 18px; font-size: 14px; margin-top: 28px; }
          .trips-grid { grid-template-columns: minmax(250px, 330px); }
          .stories-grid, .about-grid, .stats-grid { grid-template-columns: 1fr; }
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

      {/* ================= 1. ทริปต่าง ๆ ================= */}
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

      {/* ================= 2. รู้จักกับเรา ================= */}
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

      {/* ================= 3. บริการอื่น ๆ ================= */}
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

      {/* ================= 4. รูปแกลลอรี่ & เรื่องเล่าการเดินทาง ================= */}
      <section id="gallery" className="section section--dark">
        <div className="container-box">
          <div className="sec-header reveal-on-scroll">
            <span className="sec-tag">{siteConfig.gallerySection.tag}</span>
            <h2 className="sec-title">{siteConfig.gallerySection.title}</h2>
            <p className="sec-desc">
              {siteConfig.gallerySection.desc || 'ภาพบรรยากาศจริงและเรื่องราวความประทับใจจากทริปที่ผ่านมา กดที่การ์ดเพื่ออ่านเรื่องราวแบบเต็มๆ ได้เลย'}
            </p>
          </div>

          <div className="stories-grid">
            {siteConfig.gallerySection.items.map((item) => (
              <div key={item.id} className="reveal-on-scroll">
                <StoryGalleryCard item={item} onReadMore={openLightbox} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. ติดต่อเรา ================= */}
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

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <strong style={{ color: '#ffffff' }}>
          {siteConfig.brand.namePrefix}<span style={{ color: '#f97316' }}>{siteConfig.brand.nameHighlight}</span>
        </strong>{' '}
        — {siteConfig.hero.headlineLine1} {siteConfig.hero.headlinePrefix}{siteConfig.hero.headlineAccent}
        <br /><br />
        <span 
          onDoubleClick={() => setShowLoginModal(true)} 
          className="cursor-default select-none transition-colors hover:text-zinc-400"
          title="PaJaiPaiKhao"
        >
          {siteConfig.contactSection.footerText}
        </span>
      </footer>

      {/* ================= LOGIN MODAL สำหรับเข้าระบบหลังบ้าน ================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => { setShowLoginModal(false); setAdminPassword(''); setLoginError(false); }}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121217] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <Lock size={24} />
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">Admin Access</h3>
            <p className="mb-5 text-sm text-zinc-400">กรุณาใส่รหัสผ่านเพื่อเข้าสู่ระบบจัดการเว็บไซต์</p>
            
            <input 
              type="password" 
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setLoginError(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdminLogin(); }}
              className={`w-full rounded-xl border bg-[#0a0a0c] px-4 py-3 text-sm text-white focus:outline-none transition ${loginError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#f97316]'}`}
              placeholder="••••••••"
              autoFocus
            />
            {loginError && <p className="mt-2 text-xs text-red-400">รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง</p>}
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => { setShowLoginModal(false); setAdminPassword(''); setLoginError(false); }} 
                className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button 
                type="button"
                onClick={handleAdminLogin} 
                className="rounded-lg bg-[#f97316] px-5 py-2 text-sm font-bold text-white hover:bg-[#ea580c] transition cursor-pointer shadow-lg"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ระบบหลังบ้าน (ADMIN CMS DRAWER) ================= */}
      {adminOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div className="relative flex h-[92vh] max-h-[850px] w-full max-w-4xl flex-col rounded-2xl bg-[#121217] text-white shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#181820]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f97316] text-white">
                  <Settings size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white m-0">ระบบจัดการหลังบ้าน (Admin CMS)</h2>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        cloudSyncState === 'connected'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : cloudSyncState === 'error'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${cloudSyncState === 'connected' ? 'bg-emerald-400' : cloudSyncState === 'error' ? 'bg-red-400' : 'bg-amber-400'}`} />
                      {cloudSyncState === 'connected' ? 'เชื่อมต่อ Firebase (webpajai) แล้ว' : cloudSyncState === 'error' ? 'ยังไม่ได้เปิดสิทธิ์ Firestore Rules' : 'กำลังเช็คการเชื่อมต่อ...'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 m-0">
                    {cloudErrorDetail ? `สาเหตุ: ${cloudErrorDetail}` : 'แก้ไขโลโก้ รูปภาพ ข้อความ ทริป และบันทึกขึ้น Firebase แบบ Real-time'}
                  </p>
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

            <div className="flex overflow-x-auto border-b border-white/10 bg-[#15151c] px-6 py-2.5 gap-2">
              {[
                { id: 'brand', label: '1. โลโก้ & ลิงก์จองทริป', icon: ImageIcon },
                { id: 'hero', label: '2. ข้อความหน้าแรก (Hero)', icon: Type },
                { id: 'trips', label: '3. จัดการทริป (01)', icon: Compass },
                { id: 'sections', label: '4. แกลลอรี่ & เนื้อหา (02-05)', icon: Layers },
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1 */}
              {adminTab === 'brand' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-4">
                    <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                      เปลี่ยนรูปโลโก้ & ชื่อแบรนด์
                    </h3>
                    <ImageUploadField
                      label="รูปโลโก้แบรนด์ (อัปโหลดไฟล์รูปจากเครื่อง หรือวาง URL — เว้นว่างไว้หากใช้โลโก้ SVG ต้นฉบับ)"
                      value={siteConfig.brand.logoImageUrl}
                      onChange={(val) => updateSectionField('brand', 'logoImageUrl', val)}
                      folder="brand"
                      maxWidth={500}
                      placeholder="https://example.com/my-logo.png"
                    />
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
                    <ImageUploadField
                      label="รูปวอลเปเปอร์พื้นหลังหน้าแรก (อัปโหลดรูปภูเขาจากเครื่อง หรือวาง URL)"
                      value={siteConfig.brand.heroWallpaper}
                      onChange={(val) => updateSectionField('brand', 'heroWallpaper', val)}
                      folder="wallpapers"
                      maxWidth={1100}
                    />
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

              {/* TAB 2 */}
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

              {/* TAB 3 */}
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
                          <ImageUploadField
                            label="รูปปกทริป (กดอัปโหลดรูปภาพจากเครื่อง หรือวาง URL)"
                            value={trip.image}
                            onChange={(val) => handleTripChange(trip.id, 'image', val)}
                            folder="trips"
                            maxWidth={850}
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

              {/* TAB 4 (Sections 02-05 + Gallery Story Manager) */}
              {adminTab === 'sections' && (
                <div className="space-y-6">
                  {/* 04 GALLERY STORY MANAGER */}
                  <div className="rounded-2xl border border-[#f97316]/40 bg-[#181820] p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#f97316] uppercase tracking-wider m-0">
                          04 // จัดการแกลลอรี่ & บทความเรื่องเล่าจากทริป
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 mb-0">เพิ่มรูปภาพและเขียนบทความเล่าเรื่องราวความประทับใจแบบอ่านง่ายสบายตา</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="flex items-center gap-1.5 rounded-xl bg-[#f97316] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ea580c] transition border-0 cursor-pointer"
                      >
                        <Plus size={15} /> เพิ่มเรื่องเล่าทริปใหม่
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">หัวข้อส่วนแกลลอรี่ (Title)</label>
                        <input
                          type="text"
                          value={siteConfig.gallerySection.title}
                          onChange={(e) => updateSectionField('gallerySection', 'title', e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">คำโปรย (Description)</label>
                        <input
                          type="text"
                          value={siteConfig.gallerySection.desc || ''}
                          onChange={(e) => updateSectionField('gallerySection', 'desc', e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {siteConfig.gallerySection.items.map((item, index) => (
                        <div key={item.id} className="rounded-xl border border-white/10 bg-[#121217] p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs font-bold text-[#f97316]">เรื่องเล่าทริปที่ #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="text-xs text-red-400 hover:text-red-300 transition bg-transparent border-0 cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 size={13} /> ลบรายการนี้
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <ImageUploadField
                                label="รูปภาพปกเรื่องเล่า (กดอัปโหลดรูปภาพจากเครื่อง หรือวาง URL)"
                                value={item.image}
                                onChange={(val) => handleGalleryChange(item.id, 'image', val)}
                                folder="gallery"
                                maxWidth={900}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-zinc-400 mb-1">สถานที่ / ยอดเขา</label>
                              <input
                                type="text"
                                value={item.location || ''}
                                onChange={(e) => handleGalleryChange(item.id, 'location', e.target.value)}
                                placeholder="เช่น จ.เชียงใหม่ • ดอยหลวงเชียงดาว"
                                className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-zinc-400 mb-1">ช่วงเวลา / ชื่อรอบทริป</label>
                              <input
                                type="text"
                                value={item.date || ''}
                                onChange={(e) => handleGalleryChange(item.id, 'date', e.target.value)}
                                placeholder="เช่น ทริปธันวาคม"
                                className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-zinc-400 mb-1">ชื่อเรื่อง / พาดหัวความทรงจำ</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleGalleryChange(item.id, 'name', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-[#101015] px-3 py-2 text-sm text-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs text-emerald-400 font-semibold mb-1">
                                เนื้อหาบทความเล่าเรื่อง (สามารถกด Enter เว้นย่อหน้าให้อ่านสบายตาได้เลย)
                              </label>
                              <textarea
                                rows={4}
                                value={item.story || ''}
                                onChange={(e) => handleGalleryChange(item.id, 'story', e.target.value)}
                                placeholder="เขียนเล่าบรรยากาศความประทับใจจากทริปนี้..."
                                className="w-full rounded-lg border border-emerald-500/30 bg-[#101015] px-3.5 py-2.5 text-sm text-white leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

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
                  <div className="rounded-2xl border border-white/10 bg-[#181820] p-5 space-y-3 mt-6">
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

            <div className="flex items-center justify-between border-t border-white/10 bg-[#181820] px-6 py-4">
              <div className="text-xs text-zinc-400">
                {saveToast ? (
                  <span className={`inline-flex items-center gap-1.5 font-semibold ${saveStatus.includes('ผิดพลาด') ? 'text-red-400' : 'text-emerald-400'}`}>
                    <Check size={15} /> {saveStatus}
                  </span>
                ) : (
                  <span>เมื่ออัปโหลดรูปหรือแก้ไขเสร็จแล้ว กดปุ่มสีส้มด้านขวาเพื่อเซฟขึ้น Firebase</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveToCloud}
                  disabled={isSavingCloud}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f97316] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#ea580c] transition cursor-pointer border-0 disabled:opacity-60"
                >
                  {isSavingCloud && <Loader2 size={14} className="animate-spin" />}
                  <span>{isSavingCloud ? 'กำลังบันทึกขึ้น Firebase...' : 'บันทึกข้อมูลลง Cloud'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= ARTICLE READER MODAL (เรียงบนลงล่าง อ่านง่ายสบายตา 100%) ================= */}
      {modalState.isOpen && modalState.type === 'gallery' && (
        <div
          className="fixed inset-0 z-[260] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={() => setModalState({ isOpen: false, type: null, data: null })}
        >
          <article
            className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-[26px] bg-[#14141a] text-white border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.75)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalState({ isOpen: false, type: null, data: null })}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md border border-white/20 hover:bg-[#f97316] hover:border-[#f97316] transition cursor-pointer"
              aria-label="ปิดหน้าต่าง"
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#0e0e12]">
                <img
                  src={modalState.data?.image}
                  alt={modalState.data?.name}
                  className="w-full h-full object-cover block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141a] via-transparent to-transparent opacity-80" />
              </div>

              <div className="px-6 py-6 sm:px-10 sm:py-8">
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  {modalState.data?.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f97316]/15 border border-[#f97316]/30 px-3 py-1 text-xs font-semibold text-[#f97316]">
                      <MapPin size={12} /> {modalState.data.location}
                    </span>
                  )}
                  {modalState.data?.date && (
                    <span className="text-xs font-medium text-zinc-400">
                      • {modalState.data.date}
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-white leading-snug mb-5">
                  {modalState.data?.name}
                </h2>

                <div className="h-[1px] w-full bg-white/10 mb-6" />

                <div className="text-[15.5px] sm:text-[16.5px] text-zinc-200 leading-[1.95] whitespace-pre-line font-normal tracking-wide">
                  {modalState.data?.story || 'ไม่มีเนื้อหาเพิ่มเติมสำหรับรูปภาพนี้'}
                </div>

                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">บันทึกการเดินทางโดย PaJaiPaiKhao</span>
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: false, type: null, data: null })}
                    className="rounded-full bg-white/10 hover:bg-[#f97316] px-5 py-2 text-xs font-semibold text-white transition cursor-pointer border-0"
                  >
                    ปิดหน้าต่างอ่าน
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}