import React from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import { renderText, formatDateRangeDisplay } from '../../utils';

/**
 * ManualBookingModal — เพิ่มรายการจองด้วยตนเอง (Admin only)
 *
 * Props:
 *  - manualBook:    object  state ของฟอร์ม (controlled by parent)
 *  - onChange:      (newObj)=>void
 *  - onSubmit:      (event)=>void
 *  - onClose:       ()=>void
 *  - trips:         Trip[]
 *  - lang:          'th' | 'en'
 *  - isProcessing:  boolean
 */
export default function ManualBookingModal({
  manualBook, onChange, onSubmit, onClose, trips, lang, isProcessing,
}) {
  const set = (patch) => onChange({ ...manualBook, ...patch });
  const selectedTrip = manualBook.tripId ? trips.find(t => t.id === manualBook.tripId) : null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#131812]/90 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[#323d2f] flex justify-between items-center bg-gradient-to-r from-[#20271e] to-[#181d17]">
          <h3 className="text-lg font-black text-[#cfa474] flex items-center"><Plus className="mr-2" size={20} /> เพิ่มรายการจอง (Manual Booking)</h3>
          <button onClick={onClose} className="text-[#72826c] hover:text-white transition p-2 bg-[#131812] rounded-full"><X size={18} /></button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm text-[#d1dbcd]">
          {manualBook.paymentSchedule && manualBook.paymentMode === 'installment' && (
            <div className="text-xs text-[#859c7b] bg-[#859c7b]/10 border border-[#859c7b]/30 p-3 rounded-xl flex items-center font-bold shadow-inner">
              <CheckCircle size={16} className="mr-2"/>
              ระบบคัดลอกตารางผ่อนชำระ {manualBook.paymentSchedule.length} งวด และยอดเงินทั้งหมดมาจากรายการต้นฉบับแล้ว (พร้อมบันทึกทันที)
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] text-[#859c7b] font-bold uppercase tracking-widest block mb-1.5">เลือกทริป</label>
              <select value={manualBook.tripId} onChange={e => set({ tripId: e.target.value, travelDateId: '' })} className="w-full bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#cfa474] font-bold cursor-pointer appearance-none">
                <option value="">-- เลือกทริป --</option>
                {trips.map(t => <option key={t.id} value={t.id}>{renderText(t.title, lang)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#859c7b] font-bold uppercase tracking-widest block mb-1.5">เลือกรอบเดินทาง</label>
              <select value={manualBook.travelDateId} onChange={e => set({ travelDateId: e.target.value })} disabled={!manualBook.tripId} className="w-full bg-[#131812] border border-[#323d2f] rounded-xl px-4 py-3 focus:outline-none focus:border-[#cfa474] font-bold cursor-pointer disabled:opacity-50 appearance-none">
                <option value="">-- เลือกรอบ --</option>
                {selectedTrip?.availableDates?.map(d => (
                  <option key={d.id} value={d.id}>{formatDateRangeDisplay(d.start, d.end, lang)} {d.flight && `(${d.flight})`}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 bg-[#20271e]/50 border border-[#323d2f] rounded-2xl shadow-inner space-y-4">
            <h4 className="font-bold text-[#b4c7ab] text-xs uppercase tracking-widest border-b border-[#323d2f] pb-2">ข้อมูลลูกค้า</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><input type="text" placeholder="ชื่อ-นามสกุล" value={manualBook.name} onChange={e => set({ name: e.target.value })} className="w-full bg-[#131812] border border-[#323d2f] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#cfa474]" required autoFocus/></div>
              <div><input type="text" placeholder="เบอร์โทรศัพท์" value={manualBook.phone} onChange={e => set({ phone: e.target.value })} className="w-full bg-[#131812] border border-[#323d2f] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#cfa474]"/></div>
              <div><input type="email" placeholder="อีเมล (ถ้ามี)" value={manualBook.email} onChange={e => set({ email: e.target.value })} className="w-full bg-[#131812] border border-[#323d2f] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#cfa474]"/></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-[10px] text-[#859c7b] font-bold uppercase tracking-widest block mb-1.5">ผู้ใหญ่</label><input type="number" min="1" value={manualBook.adultPax} onChange={e => set({ adultPax: e.target.value })} className="w-full bg-[#131812] border border-[#323d2f] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#cfa474] text-center font-bold text-[#cfa474]"/></div>
            <div><label className="text-[10px] text-[#859c7b] font-bold uppercase tracking-widest block mb-1.5">เด็ก</label><input type="number" min="0" value={manualBook.childPax} onChange={e => set({ childPax: e.target.value })} className="w-full bg-[#131812] border border-[#323d2f] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#cfa474] text-center font-bold text-[#cfa474]"/></div>
            <div><label className="text-[10px] text-[#859c7b] font-bold uppercase tracking-widest block mb-1.5">พักเดี่ยว</label><input type="number" min="0" value={manualBook.singleRooms} onChange={e => set({ singleRooms: e.target.value })} className="w-full bg-[#131812] border border-[#323d2f] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#cfa474] text-center font-bold text-[#cfa474]"/></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={`p-4 border rounded-xl cursor-pointer transition-colors ${manualBook.paymentMode === 'deposit' ? 'border-[#cfa474] bg-[#cfa474]/10' : 'border-[#323d2f] bg-[#131812]'}`}>
              <input type="radio" name="manualPaymentMode" value="deposit" checked={manualBook.paymentMode === 'deposit'} onChange={e => set({ paymentMode: e.target.value })} className="hidden" />
              <div className="font-bold text-center">มัดจำล้วน</div>
            </label>
            <label className={`p-4 border rounded-xl cursor-pointer transition-colors ${manualBook.paymentMode === 'installment' ? 'border-[#cfa474] bg-[#cfa474]/10' : 'border-[#323d2f] bg-[#131812]'}`}>
              <input type="radio" name="manualPaymentMode" value="installment" checked={manualBook.paymentMode === 'installment'} onChange={e => set({ paymentMode: e.target.value })} className="hidden" />
              <div className="font-bold text-center">ผ่อนชำระ</div>
            </label>
          </div>

          <div className="p-4 bg-[#131812] border border-[#323d2f] rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-[#cfa474] text-xs uppercase tracking-widest">สรุปยอดเงิน</h4>
              <label className="flex items-center text-xs text-[#98a892] cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={manualBook.overridePrice} onChange={e => set({ overridePrice: e.target.checked })} className="mr-2 accent-[#cfa474] rounded" /> แก้ไขยอดเงินเอง (Override)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#72826c] font-bold uppercase tracking-widest block mb-1">ยอดรวมทั้งสิ้น (Grand Total)</label>
                <input type="number" value={manualBook.grandTotal} onChange={e => set({ grandTotal: e.target.value })} disabled={!manualBook.overridePrice} className="w-full bg-[#20271e] border border-[#455241] rounded-lg px-3 py-2 focus:outline-none focus:border-[#cfa474] font-black text-lg disabled:opacity-60 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] text-[#72826c] font-bold uppercase tracking-widest block mb-1">ยอดที่รับมาแล้ว (Paid Amount)</label>
                <input type="number" value={manualBook.paidAmount} onChange={e => set({ paidAmount: e.target.value })} disabled={!manualBook.overridePrice} className="w-full bg-[#20271e] border border-[#455241] rounded-lg px-3 py-2 focus:outline-none focus:border-[#cfa474] font-black text-[#859c7b] text-lg disabled:opacity-60 transition-colors" />
              </div>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-[#323d2f] bg-[#181d17] flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#98a892] hover:bg-[#323d2f] transition-colors">ยกเลิก</button>
          <button onClick={onSubmit} disabled={isProcessing} className="px-8 py-2.5 rounded-xl text-sm font-black text-[#131812] bg-gradient-to-r from-[#d1dbcd] to-[#b4c7ab] hover:from-white hover:to-[#d1dbcd] transition-all shadow-lg shadow-[#d1dbcd]/10 disabled:opacity-50">
            {isProcessing ? 'กำลังบันทึก...' : 'บันทึกรายการจอง'}
          </button>
        </div>
      </div>
    </div>
  );
}
