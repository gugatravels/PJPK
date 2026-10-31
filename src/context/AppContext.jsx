import React, { createContext, useContext } from 'react';

/**
 * AppContext — รวมข้อมูลและฟังก์ชันที่ทุกหน้าจอใช้ร่วมกัน
 *
 * จุดประสงค์: หลีกเลี่ยง prop drilling ในหน้าใหญ่ๆ (CustomerView, AdminPanel, PaymentPortal)
 * ผู้เป็นเจ้าของ state จริงๆ ยังคือ App.jsx — context แค่ทำหน้าที่กระจายให้ลูกอ่าน/เขียนได้
 *
 * Sections ของ context (ดู createAppContextValue ใน App.jsx):
 *  1. i18n: lang, setLang, t
 *  2. routing: viewMode, setViewMode, step, setStep
 *  3. data (Firebase live): bookings, trips, siteSettings, setSiteSettings, authUser, isSettingsLoaded
 *  4. UI flags: isProcessing, setIsProcessing, copied, setCopied
 *  5. helpers (pure): copyToClipboard, todayStr, getAvailableSeats, getMonthsUntilTrip
 *  6. API helpers: uploadToGoogleDrive, performOCR, sendTelegramNotification, sendEmailConfirmation
 *  7. export helpers: exportToImage, handlePrint, isSavingImage, isExportMode, setIsExportMode
 */
const AppContext = createContext(null);

export const AppProvider = AppContext.Provider;

/**
 * Hook สำหรับ component ใดๆ ที่ต้องอ่าน/เขียนข้อมูลแชร์
 * โยน error ที่ชัดเจนถ้าใช้นอก provider (กันบั๊กยุ่งยาก)
 */
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside <AppProvider>. ตรวจสอบว่า component อยู่ภายใต้ App.jsx');
  }
  return ctx;
};

export default AppContext;
