import React from 'react';
import { Download, X, CheckCircle, Copy, Zap } from 'lucide-react';
import BillingCard from '../BillingCard';
import { formatDateDisplay } from '../../utils';

/**
 * BillingModal — แสดงบิลพร้อมปุ่มเซฟ PNG / Copy ลิงก์ / จำลอง portal ลูกค้า
 *
 * Props:
 *  - billingData:    { booking, installmentIndex } | null
 *  - siteSettings:   object
 *  - lang:           'th' | 'en'
 *  - copied:         boolean  สถานะ "คัดลอกแล้ว"
 *  - isSavingImage:  boolean
 *  - onExportImage:  (elementId, fileName)=>void
 *  - onClose:        ()=>void
 *  - onCopy:         (text)=>void
 *  - onSimulatePortal:({ bookingId, installmentIndex })=>void
 */
export default function BillingModal({
  billingData, siteSettings, lang, copied, isSavingImage,
  onExportImage, onClose, onCopy, onSimulatePortal,
}) {
  if (!billingData) return null;

  const isBalance = billingData.installmentIndex === 'balance';
  const inst = !isBalance ? billingData.booking.paymentSchedule[billingData.installmentIndex] : null;
  const billAmount = isBalance ? billingData.booking.totalBalance : inst.amount;
  const billTitle = isBalance ? 'ยอดคงเหลือทั้งหมด (ปิดยอด)' : `งวดที่ ${inst.installment}`;
  const billDueDate = isBalance ? 'ชำระทันที' : formatDateDisplay(inst.dueDate, lang);
  const fileName = `Bill_${billingData.booking.id}_${isBalance ? 'Balance' : `Inst${inst.installment}`}.png`;
  const portalUrl = `${window.location.origin}/pay/${billingData.booking.id}/${billingData.installmentIndex}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#131812]/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-full flex justify-between mb-3 items-center">
          <button onClick={() => onExportImage('billing-card', fileName)} disabled={isSavingImage} className="bg-gradient-to-r from-[#cfa474] to-[#a6825c] text-[#131812] px-5 py-2 rounded-xl text-sm font-bold flex items-center transition shadow-lg shadow-[#cfa474]/20 disabled:opacity-50">
            <Download size={16} className="mr-2"/> {isSavingImage ? 'กำลังบันทึก...' : 'เซฟรูปบิลนี้'}
          </button>
          <button onClick={onClose} className="text-[#98a892] hover:text-white bg-[#20271e] p-2 rounded-full border border-[#323d2f]"><X size={20}/></button>
        </div>

        <BillingCard
          booking={billingData.booking}
          billTitle={billTitle}
          billAmount={billAmount}
          billDueDate={billDueDate}
          siteSettings={siteSettings}
          lang={lang}
        />

        <div className="mt-6 w-full space-y-3">
          <div className="bg-[#181d17] p-3 rounded-xl border border-[#cfa474]/30 flex items-center justify-between shadow-inner">
            <div className="truncate text-xs text-[#98a892] max-w-[200px] font-mono">{portalUrl}</div>
            <button onClick={() => onCopy(portalUrl)} className="text-[#cfa474] hover:text-white flex items-center text-xs font-bold bg-[#cfa474]/10 px-3 py-1.5 rounded-lg transition-colors">
              {copied ? <CheckCircle size={14} className="mr-1"/> : <Copy size={14} className="mr-1"/>} Copy
            </button>
          </div>
          <button onClick={() => onSimulatePortal({ bookingId: billingData.booking.id, installmentIndex: billingData.installmentIndex })} className="w-full bg-[#20271e] border border-[#323d2f] hover:border-[#cfa474]/50 text-[#d1dbcd] py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center shadow-lg">
            <Zap size={16} className="mr-2 text-[#cfa474]"/> จำลองมุมมองลูกค้า (เข้าลิงก์จ่ายเงิน)
          </button>
        </div>
      </div>
    </div>
  );
}
