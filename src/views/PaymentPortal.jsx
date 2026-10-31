import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';
import { db, appId } from '../firebase';

/**
 * PaymentPortal — หน้าให้ลูกค้าเข้ามาแจ้งโอนเงินงวดถัดไป (เปิดผ่านลิงก์ที่ admin ส่งให้)
 *
 * Props:
 *  - portalData: { bookingId, installmentIndex }  ข้อมูลที่ส่งมาจาก URL routing หรือ admin
 *  - onBack:     ()=>void  callback กลับหน้าหลัก
 *
 * อ่าน/เรียกใช้จาก Context: bookings, siteSettings, t, isProcessing, setIsProcessing,
 *   authUser, uploadToGoogleDrive, sendTelegramNotification, sendEmailConfirmation, setStep
 *
 * หมายเหตุ: state ของ uploadedSlip เก็บภายใน component นี้เอง — ไม่แชร์กับ customer flow
 */
export default function PaymentPortal({ portalData, onBack }) {
  const {
    bookings, siteSettings, t,
    isProcessing, setIsProcessing,
    authUser, setStep,
    uploadToGoogleDrive, sendTelegramNotification, sendEmailConfirmation,
  } = useApp();

  const [uploadedSlip, setUploadedSlip] = useState(null);

  if (bookings.length === 0) {
    return <div className="text-center py-32 text-[#d1dbcd] text-xl animate-pulse">กำลังโหลดข้อมูล...</div>;
  }

  const b = bookings.find(x => x.id === portalData.bookingId);
  if (!b) {
    return <div className="text-center py-32 text-red-400 text-xl font-bold">❌ ไม่พบข้อมูลการจอง หรือลิงก์ไม่ถูกต้อง</div>;
  }

  const isDepositBalance = portalData.installmentIndex === 'balance';
  let inst = null;
  let amountToPay = 0;
  let installmentLabel = '';

  if (isDepositBalance) {
    amountToPay = b.totalBalance;
    installmentLabel = 'ยอดคงเหลือทั้งหมด (ปิดยอด)';
    if (amountToPay <= 0) {
      return <div className="text-center py-32 text-[#859c7b] text-xl font-bold">✅ รายการนี้ชำระเงินครบถ้วนแล้ว</div>;
    }
  } else {
    inst = b.paymentSchedule[portalData.installmentIndex];
    if (!inst) {
      return <div className="text-center py-32 text-red-400 text-xl font-bold">❌ ไม่พบข้อมูลงวดการชำระเงินนี้</div>;
    }
    amountToPay = inst.amount;
    installmentLabel = `งวดที่ ${inst.installment}`;
    if (inst.status === 'paid') {
      return <div className="text-center py-32 text-[#859c7b] text-xl font-bold">✅ งวดนี้ชำระเงินเรียบร้อยแล้ว</div>;
    }
  }

  const handleSlipUpload = (e) => {
    if (e.target.files && e.target.files[0]) setUploadedSlip(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!authUser) return;
    setIsProcessing(true);
    const slipUrl = await uploadToGoogleDrive(uploadedSlip);

    try {
      if (portalData.installmentIndex === 'balance') {
        const totalPaid = b.grandTotal;
        const updateObj = {
          totalPaid,
          totalBalance: 0,
          status: 'paid_full',
          balanceSlipUrl: slipUrl,
        };
        // หากปิดยอดเต็ม → mark งวดที่ค้างทั้งหมดเป็น paid
        if (b.paymentSchedule && b.paymentSchedule.length > 0) {
          updateObj.paymentSchedule = b.paymentSchedule.map(s =>
            s.status === 'pending' ? { ...s, status: 'paid', slipUrl } : s
          );
        }
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bookings', b.id), updateObj);
        await sendTelegramNotification('balance_paid', { bookingId: b.id, name: b.name, tripTitle: b.tripTitle, amount: b.totalBalance, slipUrl });
        await sendEmailConfirmation({ ...b, ...updateObj }, false);
      } else {
        const newSchedule = [...b.paymentSchedule];
        newSchedule[portalData.installmentIndex].status = 'paid';
        newSchedule[portalData.installmentIndex].slipUrl = slipUrl;

        const amt = newSchedule[portalData.installmentIndex].amount;
        const totalPaid = b.totalPaid + amt;

        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bookings', b.id), {
          paymentSchedule: newSchedule,
          totalPaid,
          totalBalance: b.grandTotal - totalPaid,
        });
        await sendTelegramNotification('installment_paid', { bookingId: b.id, name: b.name, tripTitle: b.tripTitle, installment: newSchedule[portalData.installmentIndex].installment, amount: newSchedule[portalData.installmentIndex].amount, slipUrl });
        await sendEmailConfirmation({ ...b, paymentSchedule: newSchedule, totalPaid, totalBalance: b.grandTotal - totalPaid }, false);
      }
      setIsProcessing(false);
      setStep(4);
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out] max-w-xl mx-auto">
      <button onClick={onBack} className="flex items-center text-[#98a892] hover:text-white mb-8 text-sm font-medium transition">
        <ArrowLeft size={16} className="mr-2" /> กลับหน้าหลัก
      </button>
      <div className="bg-[#181d17]/90 border border-[#cfa474]/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#859c7b] via-[#cfa474] to-[#859c7b]"></div>
        <div className="bg-[#cfa474]/10 border border-[#cfa474]/30 text-[#cfa474] px-4 py-2 rounded-lg text-center mb-8 text-xs font-black uppercase tracking-widest w-fit mx-auto shadow-sm">Customer View (มุมมองลูกค้า)</div>
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d1dbcd] to-[#cfa474] mb-2 text-center">แจ้งชำระเงิน - {installmentLabel}</h2>
        <p className="text-center text-[#98a892] text-sm mb-8 font-medium">Booking ID: <span className="text-[#d1dbcd]">{b.id}</span> <br/> {b.tripTitle}</p>

        <div className="space-y-8">
          <div className="bg-gradient-to-b from-[#131812] to-[#20271e] border border-[#323d2f] rounded-3xl overflow-hidden max-w-xs mx-auto shadow-2xl relative group hover:border-[#cfa474]/50 transition-colors">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#cfa474]/10 rounded-full blur-2xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
            <div className="bg-[#113A6B] p-3 text-center border-b-4 border-[#cfa474]">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/PromptPay-logo.png" alt="PromptPay" className="h-7 mx-auto" style={{ filter: 'brightness(0) invert(1)' }}/>
            </div>
            <div className="p-8 bg-white text-center relative z-10">
              {siteSettings?.qrCodeUrl ? (
                <img src={siteSettings.qrCodeUrl} alt="Bank QR" className="w-52 h-52 mx-auto object-contain p-2 border-2 border-dashed border-gray-300 rounded-xl" />
              ) : (
                <img src={`https://promptpay.io/${siteSettings?.promptPayId || '0123456789012'}/${Math.ceil(amountToPay)}.png`} alt="Bank QR" className="w-52 h-52 mx-auto mix-blend-multiply" />
              )}
              <div className="mt-5 text-[#131812] font-black text-lg">{siteSettings?.accName}</div>
              <div className="text-gray-500 text-xs mt-1 font-bold">{siteSettings?.bankName}</div>
            </div>
            <div className="bg-[#131812] p-5 text-center border-t border-[#323d2f]">
              <div className="text-[10px] text-[#859c7b] uppercase tracking-widest font-bold mb-1">ยอดชำระ {installmentLabel}</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#cfa474] to-[#e6c49e]">฿{Math.ceil(amountToPay).toLocaleString()}</div>
            </div>
          </div>

          <div className="relative border-2 border-dashed border-[#455241] rounded-2xl p-8 text-sm font-bold text-[#72826c] hover:bg-[#20271e] hover:border-[#cfa474] hover:text-[#d1dbcd] cursor-pointer transition-all text-center group bg-[#131812]/50">
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleSlipUpload} accept="image/*" />
            {uploadedSlip ? (
              <div className="flex flex-col items-center text-[#cfa474]">
                <CheckCircle size={36} className="mb-3 drop-shadow-[0_0_10px_rgba(207,164,116,0.5)]" />
                <span className="text-base text-[#d1dbcd] font-black">{uploadedSlip.name}</span>
                <span className="text-xs text-[#98a892] font-medium mt-2 bg-[#20271e] px-3 py-1 rounded-full border border-[#323d2f]">อัปโหลดสำเร็จ (คลิกเพื่อเปลี่ยนไฟล์)</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-[#20271e] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-[#323d2f] group-hover:border-[#cfa474]/50">
                  <Upload size={24} className="text-[#859c7b] group-hover:text-[#cfa474]" />
                </div>
                <p className="text-base text-[#d1dbcd]">{t('uploadSlip')}</p>
                <p className="text-xs font-medium text-[#72826c] mt-2">คลิกที่นี่เพื่อเลือกรูปภาพสลิปโอนเงิน</p>
              </div>
            )}
          </div>
        </div>
        <button onClick={handleSubmit} disabled={isProcessing || !uploadedSlip} className="w-full mt-8 py-4 bg-gradient-to-r from-[#859c7b] to-[#677b5e] hover:from-[#a5bda3] hover:to-[#859c7b] text-white rounded-xl text-base font-black transition-all flex items-center justify-center disabled:opacity-30 disabled:from-[#323d2f] disabled:to-[#323d2f] disabled:text-[#72826c] shadow-lg shadow-[#859c7b]/20">
          {isProcessing ? 'กำลังยืนยันยอด...' : 'ยืนยันและแจ้งโอนเงินงวดนี้'}
        </button>
      </div>
    </div>
  );
}
