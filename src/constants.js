// ==========================================
// 📌 CONSTANTS — ตัวแปรค่าคงที่ทั้งหมดของแอป
// ==========================================
// ⚠️ TODO (รอบถัดไป): API keys ทั้งหมดด้านล่างควรย้ายไปอยู่ใน .env / Firebase Functions
// เพราะตอนนี้ใครเปิด DevTools ก็เห็นได้ทันที
// แต่รอบนี้คงไว้เพื่อไม่ให้ระบบที่ deploy แล้วพัง

// ------------------------------------------
// 🔐 API KEYS & TOKENS (ย้ายไป .env ในรอบหน้า)
// ------------------------------------------
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPklhT8bqHxLVRmJ19VCNau0peNdY27Yt5KA5FsRBxHmwgMl4UlnaoSEUe-xo_rXGn/exec';
export const TELEGRAM_BOT_TOKEN = '8606306442:AAEpgQ8exqK8Ox7awkxwqoBX3dmjnkD0go0';
export const TELEGRAM_CHAT_ID = '-5111771494';
export const OCR_API_KEY = 'K82508445988957';
export const ADMIN_PASSWORD = 'ASD@1234';

// ------------------------------------------
// 💰 BUSINESS RULES
// ------------------------------------------
export const FLIGHT_SERVICE_FEE = 1500;

export const PROMO_CODES = {
  'GUGA2026': 1000,
  'EARLYBIRD': 2000,
  'VIP': 5000,
};

// ------------------------------------------
// 🌐 i18n TRANSLATIONS (TH / EN)
// ------------------------------------------
export const TRANSLATIONS = {
  th: {
    adminMode: 'ระบบหลังบ้าน', backToHome: 'กลับหน้าหลัก', searchTitle: 'ค้นหาจุดหมายปลายทาง', searchCountry: 'เลือกประเทศ...', searchDate: 'เลือกรอบเดินทาง...',
    searchBtn: 'ค้นหาทริป', allCountries: 'ทุกประเทศ', allDates: 'ทุกรอบเดินทาง', startingPrice: 'เริ่มต้น', bookNow: 'จองตอนนี้',
    step1: 'เลือกทริป', step2: 'รายละเอียด', step3: 'ชำระเงิน', step4: 'เสร็จสิ้น',
    passengerInfo: 'ผู้เดินทางท่านที่ 1 (ผู้จองหลัก)', additionalPassengers: 'ข้อมูลผู้เดินทางท่านอื่นๆ',
    nameTh: 'ชื่อ-นามสกุล (ภาษาไทย)', nameEn: 'ชื่อ-นามสกุล (ภาษาอังกฤษ)', phone: 'เบอร์โทรศัพท์', email: 'อีเมล (สำหรับรับใบยืนยัน)',
    adults: 'ผู้ใหญ่ (ท่าน)', children: 'เด็ก ไม่มีเตียง (ท่าน)', singleRoom: 'พักเดี่ยว (ห้อง)', travelRound: 'รอบการเดินทาง',
    flightService: 'บริการจัดการตั๋วเครื่องบิน', flightDesc: 'ให้ทีมงานจัดการตั๋วเครื่องบินให้คุณ', addFlight: 'เพิ่มบริการจองตั๋ว',
    visaService: 'บริการยื่นเอกสารวีซ่า', visaDesc: 'ทีมงานดูแลตั้งแต่เตรียมเอกสารจนถึงวันยื่น', addVisa: 'เพิ่มบริการวีซ่า',
    paymentMethod: 'รูปแบบการชำระเงิน', payDeposit: 'ชำระมัดจำยืนยันสิทธิ์', payInstallment: 'ผ่อนชำระ 0%', months: 'งวด', flexInstallment: 'ผ่อนยืดหยุ่นจนกว่าจะบิน',
    selectDateFirst: '*กรุณาเลือกรอบเดินทางก่อน', grandTotal: 'ยอดรวมทั้งสิ้น', depositAmount: 'ยอดมัดจำ', monthlyAmount: 'ยอดชำระต่องวด',
    proceedPayment: 'ดำเนินการชำระเงิน', confirmPay: 'ยืนยันและแจ้งโอนเงิน', uploadSlip: 'อัปโหลดสลิป', successTitle: 'จองทริปสำเร็จ', successDesc: 'ขอบคุณที่เลือกเดินทางกับเรา ระบบได้ส่งอีเมลยืนยันการจองไปให้ท่านแล้ว',
    adminDashboard: 'ระบบจัดการ (Admin)', addNewTrip: 'เพิ่มทริปใหม่', editTrip: 'แก้ไขทริป', tripList: 'รายการทริปทั้งหมด', saveTrip: 'บันทึกข้อมูล', cancelEdit: 'ยกเลิก', delete: 'ลบ',
    statusConfirmed: 'การันตีเดินทาง', statusUpcoming: 'โค้งสุดท้าย', statusNormal: 'เปิดรับจอง', viewItinerary: 'ดูแผนการเดินทาง',
    tabTrips: 'จัดการทริป', tabBookings: 'รายการจอง', tabSettings: 'ตั้งค่าเว็บไซต์', brandSettings: 'ตั้งค่าแบรนด์ & โลโก้', contactChannels: 'ช่องทางการติดต่อ',
    exportExcel: 'Export Excel', printTable: 'Print / Save Image', noBookings: 'ยังไม่มีข้อมูลการจองสำหรับรอบนี้', addRound: 'เพิ่มรอบเดินทาง',
    termsTitle: 'เงื่อนไขและข้อตกลงก่อนการจอง', acceptTerms: 'ข้าพเจ้ารับทราบและยอมรับเงื่อนไข', bankAccountInfo: 'ข้อมูลบัญชีสำหรับโอนเงิน',
    bankName: 'ธนาคารกสิกรไทย (KBank)', accName: 'ชื่อบัญชี: บจก. กูก้า ทราเวลส์', copySuccess: 'คัดลอกแล้ว', joinLineGroup: 'เข้ากลุ่ม Line ของทริปนี้', lineGroupDesc: 'พูดคุย แลกเปลี่ยนข้อมูล และรับอัปเดตจากหัวหน้าทัวร์',
    filterByTrip: 'กรองตามทริป...', filterByRound: 'กรองตามรอบเดินทาง...', generateBill: 'เรียกเก็บเงิน', broadcastBtn: 'สร้างข้อความแจ้งยอด', broadcastTitle: 'ข้อความประกาศ (Broadcast Message)',
    copyMessage: 'คัดลอกข้อความ', maxPaxLabel: 'รับสูงสุด (คน)', seatsAvailable: 'ว่าง', seatsFull: 'เต็ม', paxExceedWarning: 'จำนวนผู้เดินทางเกินที่นั่งว่าง', managePayment: 'จัดการยอดชำระ',
    passportInfo: 'ข้อมูลหนังสือเดินทาง', scanPassport: 'สแกนพาสปอร์ต', passportNo: 'เลขพาสปอร์ต', dob: 'วันเกิด', expiryDate: 'วันหมดอายุ', scanning: 'AI สแกน...',
    tabAllTrips: 'ทริปทั้งหมด', tabHotTrips: '🔥 ทริปยอดฮิต', tabUpcomingTrips: '⏳ โค้งสุดท้าย', filterYear: 'เลือกปี...', filterMonth: 'เลือกเดือน...', isHotLabel: 'ตั้งเป็นทริปยอดฮิต (Hot Trip)',
    promoCode: 'รหัสส่วนลด', applyCode: 'ใช้สิทธิ์', discount: 'ส่วนลด', pdpaText: 'ข้าพเจ้ายินยอมให้บริษัทจัดเก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัว (PDPA) เพื่อใช้ในการดำเนินการจองทริปและบริการที่เกี่ยวข้อง',
  },
  en: {
    adminMode: 'Admin Panel', backToHome: 'Back to Home', searchTitle: 'Find Your Destiny', searchCountry: 'Select Country...', searchDate: 'Select Travel Date...',
    searchBtn: 'Search Trips', allCountries: 'All Countries', allDates: 'All Dates', startingPrice: 'From', bookNow: 'Book Now',
    step1: 'Explore', step2: 'Details', step3: 'Payment', step4: 'Confirmed',
    passengerInfo: 'Passenger 1 (Main Contact)', additionalPassengers: 'Additional Passengers',
    nameTh: 'Full Name (Thai)', nameEn: 'Full Name (English)', phone: 'Phone Number', email: 'Email Address',
    adults: 'Adults (Pax)', children: 'Children No Bed (Pax)', singleRoom: 'Single Room', travelRound: 'Travel Date',
    flightService: 'Flight Concierge', flightDesc: 'Let us handle your flights', addFlight: 'Add Flight Service',
    visaService: 'Visa Processing Service', visaDesc: 'End-to-end visa application support', addVisa: 'Add Visa Service',
    paymentMethod: 'Payment Method', payDeposit: 'Deposit Payment (Transfer)', payInstallment: 'Installment Plan (Transfer)', months: 'Installments', flexInstallment: 'Flexible Installment',
    selectDateFirst: '*Please select travel date first', grandTotal: 'Grand Total', depositAmount: 'Deposit Amount', monthlyAmount: 'Amount per Installment',
    proceedPayment: 'Proceed to Payment', confirmPay: 'Confirm & Pay', uploadSlip: 'Upload Slip', successTitle: 'Booking Confirmed', successDesc: 'Thank you for choosing us. We have sent a confirmation email to you.',
    adminDashboard: 'Admin Panel', addNewTrip: 'Add New Trip', editTrip: 'Edit Trip', tripList: 'All Trips', saveTrip: 'Save', cancelEdit: 'Cancel', delete: 'Delete',
    statusConfirmed: 'Guaranteed Departure', statusUpcoming: 'Upcoming Soon', statusNormal: 'Open for Booking', viewItinerary: 'View Itinerary',
    tabTrips: 'Manage Trips', tabBookings: 'Bookings', tabSettings: 'Site Settings', brandSettings: 'Brand & Logo Settings', contactChannels: 'Contact Channels',
    exportExcel: 'Export Excel', printTable: 'Print / Save Image', noBookings: 'No bookings found', addRound: 'Add Date',
    termsTitle: 'Pre-Booking Terms & Conditions', acceptTerms: 'I acknowledge and accept the terms', bankAccountInfo: 'Bank Account Information',
    bankName: 'Kasikornbank (KBank)', accName: 'Account Name: GUGA Travels Co., Ltd.', copySuccess: 'Copied', joinLineGroup: 'Join Trip Line Group', lineGroupDesc: 'Chat with your tour leader and fellow travelers',
    filterByTrip: 'Filter by Trip...', filterByRound: 'Filter by Round...', generateBill: 'Generate Bill', broadcastBtn: 'Broadcast Message', broadcastTitle: 'Broadcast Message',
    copyMessage: 'Copy Message', maxPaxLabel: 'Max Pax', seatsAvailable: 'Avail.', seatsFull: 'Full', paxExceedWarning: 'Passengers exceed available seats', managePayment: 'Manage Payment',
    passportInfo: 'Passport Information', scanPassport: 'Upload (AI Scan)', passportNo: 'Passport No.', dob: 'Date of Birth', expiryDate: 'Expiry Date', scanning: 'AI Scanning...',
    tabAllTrips: 'All Trips', tabHotTrips: '🔥 Hot Trips', tabUpcomingTrips: '⏳ Upcoming', filterYear: 'Select Year...', filterMonth: 'Select Month...', isHotLabel: 'Mark as Hot Trip',
    promoCode: 'Promo Code', applyCode: 'Apply', discount: 'Discount', pdpaText: 'I consent to the collection, use, and disclosure of my personal data in accordance with the Privacy Policy (PDPA) for booking processing and related services.',
  }
};

// ------------------------------------------
// ⚙️ DEFAULT SITE SETTINGS
// ------------------------------------------
export const INITIAL_SETTINGS = {
  brandName: 'GUGA', brandSubName: 'Inter', logoUrl: '', facebook: '', line: '', instagram: '', tiktok: '',
  bankName: 'ธนาคารกสิกรไทย (KBank)', accName: 'บจก. กูก้า ทราเวลส์', accNumber: '123-4-56789-0', promptPayId: '0123456789012', qrCodeUrl: '',
  bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=2000',
  terms: {
    th: [
      'หนังสือเดินทาง (Passport) ต้องมีอายุเหลือไม่น้อยกว่า 6 เดือน นับจากวันเดินทาง และมีหน้าว่างอย่างน้อย 2 หน้า',
      'การจองจะสมบูรณ์เมื่อบริษัทได้รับเงินมัดจำแล้วเท่านั้น (สงวนสิทธิ์ไม่คืนเงินมัดจำในทุกกรณี)',
    ],
    en: [
      'Passport must be valid for at least 6 months from the date of travel and have at least 2 blank pages.',
      'Booking is confirmed only upon receipt of the deposit. (Deposits are strictly non-refundable).',
    ],
  },
};

// ------------------------------------------
// 🎨 UI TOKENS — ชื่อคลาสที่ใช้ซ้ำๆ
// ------------------------------------------
// ใช้คู่กับ <style> block ใน App.jsx (ดู class .gx-* ใน return ของ App)
export const UI = {
  // Inputs
  input:        'gx-input',
  inputLg:      'gx-input gx-input--lg',
  inputCenter:  'gx-input text-center',
  inputGold:    'gx-input gx-input--gold',
  // Labels
  labelTiny:    'gx-label',
  // Buttons
  btnGold:      'gx-btn gx-btn--gold',
  btnGreen:     'gx-btn gx-btn--green',
  btnGhost:     'gx-btn gx-btn--ghost',
  btnDanger:    'gx-btn gx-btn--danger',
  iconBtn:      'gx-icon-btn',
  // Cards / Surfaces
  card:         'gx-card',
  cardSoft:     'gx-card gx-card--soft',
  // Modals
  overlay:      'gx-overlay',
  modal:        'gx-modal',
  // Misc
  scroll:       'gx-scroll',
  badge:        'gx-badge',
};
