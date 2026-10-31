import React from 'react';
import { Globe, Calendar } from 'lucide-react';
import { formatDateDisplay } from '../utils';

/**
 * BillingCard — บิลแจ้งชำระเงินสำหรับลูกค้า (เซฟเป็น PNG ได้)
 * เก็บ id="billing-card" ไว้เพื่อให้ exportToImage หาเจอ
 *
 * Props:
 *  - booking:       object  ข้อมูลการจอง (id, name, tripTitle, travelDate)
 *  - billTitle:     string  เช่น "งวดที่ 2" หรือ "ยอดคงเหลือทั้งหมด"
 *  - billAmount:    number
 *  - billDueDate:   string  ข้อความวันครบกำหนด
 *  - siteSettings:  object  brandName, logoUrl, bankName, accNumber
 *  - lang:          'th' | 'en'
 */
export default function BillingCard({ booking, billTitle, billAmount, billDueDate, siteSettings, lang }) {
  return (
    <div id="billing-card" className="bg-gradient-to-b from-[#e5eadf] to-[#d1dbcd] text-[#131812] w-full rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="bg-[#181d17] p-6 text-center border-b-4 border-[#cfa474]">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 overflow-hidden ${siteSettings?.logoUrl ? '' : 'bg-gradient-to-br from-[#cfa474] to-[#a6825c] shadow-inner'}`}>
          {siteSettings?.logoUrl
            ? <img src={siteSettings.logoUrl} crossOrigin="anonymous" className="w-full h-full object-contain" alt="Logo" />
            : <Globe className="text-[#131812]" size={28} />}
        </div>
        <h3 className="text-[#d1dbcd] font-black tracking-widest uppercase text-lg">{siteSettings?.brandName}</h3>
        <p className="text-xs text-[#859c7b] mt-1 font-medium tracking-wider">Payment Request</p>
      </div>
      <div className="p-6">
        <div className="mb-5 pb-5 border-b border-[#aabda4] border-dashed">
          <div className="text-xs text-[#52634a] mb-1 font-bold uppercase">Booking ID</div>
          <div className="font-black text-[#181d17] text-lg">{booking.id}</div>
          <div className="text-xs text-[#52634a] mt-4 mb-1 font-bold uppercase">Customer Name</div>
          <div className="font-bold text-[#181d17]">{booking.name}</div>
        </div>
        <div className="mb-6">
          <div className="text-xs text-[#52634a] mb-1 font-bold uppercase">Trip Details</div>
          <div className="font-bold text-[#181d17] leading-tight">{booking.tripTitle}</div>
          <div className="text-xs text-[#52634a] mt-2 font-bold flex items-center"><Calendar size={12} className="mr-1" /> {formatDateDisplay(booking.travelDate, lang)}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#aabda4] mb-6 text-center shadow-sm">
          <div className="text-xs text-[#859c7b] font-black uppercase tracking-widest mb-1">{billTitle}</div>
          <div className="text-4xl font-black text-[#2e3b2b] my-2">฿{Math.ceil(billAmount).toLocaleString()}</div>
          <div className="text-xs text-[#cfa474] font-bold">Due Date: {billDueDate}</div>
        </div>
        <div className="text-center text-xs text-[#52634a] bg-[#859c7b]/10 p-3 rounded-xl">
          ชำระเงินโดยสแกน QR Code หรือโอนเข้าบัญชี<br />
          <strong className="text-[#181d17] text-sm block mt-1">{siteSettings?.bankName} {siteSettings?.accNumber}</strong>
        </div>
      </div>
      <div className="h-4 w-full bg-[radial-gradient(circle,transparent_4px,#e5eadf_4px)] bg-[length:16px_16px] -mt-2 transform rotate-180 opacity-60"></div>
    </div>
  );
}
