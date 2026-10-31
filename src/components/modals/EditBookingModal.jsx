import React from 'react';
import { Edit3, X } from 'lucide-react';

/**
 * EditBookingModal — แก้ไขข้อมูลการจอง (ชื่อ, เบอร์, อีเมล, ยอดเงิน)
 *
 * Props:
 *  - booking:        object  ข้อมูลที่กำลังแก้ไข (controlled by parent)
 *  - onChange:       (newBookingObj)=>void
 *  - onSubmit:       (event)=>void
 *  - onClose:        ()=>void
 *  - isProcessing:   boolean
 */
export default function EditBookingModal({ booking, onChange, onSubmit, onClose, isProcessing }) {
  const set = (patch) => onChange({ ...booking, ...patch });
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#131812]/90 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#72826c] hover:text-[#d1dbcd]"><X size={20} /></button>
        <h3 className="text-lg font-bold text-[#d1dbcd] mb-6 flex items-center"><Edit3 size={20} className="mr-2 text-[#cfa474]" /> แก้ไขข้อมูลการจอง</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#98a892] font-bold uppercase">ชื่อ-นามสกุล</label>
            <input type="text" value={booking.name} onChange={e => set({ name: e.target.value })} className="w-full mt-1 bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-2.5 text-sm text-[#d1dbcd] focus:outline-none focus:border-[#cfa474]" required />
          </div>
          <div>
            <label className="text-xs text-[#98a892] font-bold uppercase">เบอร์โทรศัพท์</label>
            <input type="text" value={booking.phone} onChange={e => set({ phone: e.target.value })} className="w-full mt-1 bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-2.5 text-sm text-[#d1dbcd] focus:outline-none focus:border-[#cfa474]" required />
          </div>
          <div>
            <label className="text-xs text-[#98a892] font-bold uppercase">อีเมล</label>
            <input type="email" value={booking.email} onChange={e => set({ email: e.target.value })} className="w-full mt-1 bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-2.5 text-sm text-[#d1dbcd] focus:outline-none focus:border-[#cfa474]" required />
          </div>

          <h4 className="text-[#cfa474] font-bold text-xs mt-6 mb-2 border-b border-[#323d2f] pb-2">ข้อมูลการเงิน (แก้ไขยอดจัดเก็บ)</h4>
          <div>
            <label className="text-xs text-[#98a892] font-bold uppercase">ยอดรวมทั้งสิ้น (Grand Total)</label>
            <input type="number" value={booking.grandTotal} onChange={e => set({ grandTotal: Number(e.target.value) })} className="w-full mt-1 bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-2.5 text-sm font-bold text-[#cfa474] focus:outline-none focus:border-[#cfa474]" required />
          </div>
          <div>
            <label className="text-xs text-[#98a892] font-bold uppercase">ยอดรับแล้ว (Total Paid)</label>
            <input type="number" value={booking.totalPaid} onChange={e => set({ totalPaid: Number(e.target.value) })} className="w-full mt-1 bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-2.5 text-sm font-bold text-[#859c7b] focus:outline-none focus:border-[#cfa474]" required />
          </div>
          <div className="text-[10px] text-[#72826c]">
            ยอดค้างชำระ: <span className="text-red-400 font-bold">฿{Math.max(0, Number(booking.grandTotal) - Number(booking.totalPaid)).toLocaleString()}</span> (ระบบจะคำนวณอัตโนมัติ)
          </div>

          <button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-[#859c7b] to-[#677b5e] text-white font-bold py-3 rounded-xl transition mt-6 shadow-lg shadow-[#859c7b]/20">
            {isProcessing ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </form>
      </div>
    </div>
  );
}
