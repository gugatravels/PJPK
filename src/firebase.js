// ==========================================
// 🔥 FIREBASE INITIALIZATION
// ==========================================
// แยกออกมาจาก App.jsx เพื่อให้ปรับเปลี่ยนง่าย และไม่ต้อง init ซ้ำเวลามีหลาย component ใช้ db
//
// หมายเหตุเรื่องตัวแปร global (__firebase_config, __app_id, __initial_auth_token):
// - ตัวแปรเหล่านี้ถูก inject เข้ามาตอน runtime (เช่น Firebase Studio / artifact env)
// - ใช้ typeof ... !== 'undefined' เป็น guard เพื่อให้ทำงานได้ทั้งแบบ inject และแบบ standalone
// - ตัวแปรเหล่านี้ไม่ถูกประกาศที่ไหน — ESLint อาจจะเตือน ให้เพิ่มใน .eslintrc:
//     "globals": { "__firebase_config": "readonly", "__app_id": "readonly", "__initial_auth_token": "readonly" }

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ⚠️ TODO (รอบหน้า): ย้าย config นี้ไปอยู่ใน .env / Firebase Functions
// ตอนนี้คงไว้แบบเดิมก่อน เพื่อไม่ให้ระบบที่ deploy ไว้แล้วพัง
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCaOHurDjXRJieIM3uFyf5EuhldQit8lwc",
  authDomain: "gugainter-8ee8d.firebaseapp.com",
  projectId: "gugainter-8ee8d",
  storageBucket: "gugainter-8ee8d.firebasestorage.app",
  messagingSenderId: "343202478778",
  appId: "1:343202478778:web:245c4ccf8598f7b942e083",
  measurementId: "G-PESTT1PPBJ",
};

export const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : DEFAULT_FIREBASE_CONFIG;

export const appId =
  typeof __app_id !== 'undefined' ? __app_id : 'guga-app-default';

export const initialAuthToken =
  typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize ครั้งเดียวสำหรับทั้งแอป
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
