import React from 'react';
import { CreditCard, X, Users, Receipt, Calendar, CheckCircle, Edit3, Trash2, Plus } from 'lucide-react';
import { formatDateDisplay } from '../../utils';

/**
 * ManageBookingModal — จัดการยอดชำระของลูกค้า 1 รายการ
 * (รายชื่อผู้เดินทาง, สรุปยอด, ตารางผ่อน, แก้ไข/เพิ่ม/ลบงวด)
 *
 * Props:
 *  - booking:               object  ข้อมูลการจอง (b)
 *  - lang:                  'th' | 'en'
 *  - editInstData:          { index, amount, dueDate } | null
 *  - isProcessing:          boolean
 *  - onClose:               ()=>void
 *  - onSetEditInstData:     (data|null)=>void
 *  - onToggleInstallment:   (bookingId, idx)=>void
 *  - onSaveInstEdit:        (bookingId, idx)=>void
 *  - onDeleteInstallment:   (bookingId, idx)=>void
 *  - onAddInstallment:      (bookingId)=>void
 *  - onRequestBilling:      ({ booking, installmentIndex })=>void
 */
export default function ManageBookingModal({
  booking: b, lang, editInstData, isProcessing,
  onClose, onSetEditInstData, onToggleInstallment, onSaveInstEdit,
  onDeleteInstallment, onAddInstallment, onRequestBilling,
}) {
  if (!b) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#323d2f] flex justify-between items-center bg-[#20271e]/80 rounded-t-3xl">
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d1dbcd] to-[#cfa474] flex items-center"><CreditCard className="text-[#cfa474] mr-2" size={20} /> จัดการยอดชำระ</h3>
            <p className="text-xs text-[#98a892] mt-1 font-medium">ลูกค้า: {b.name} ({b.id})</p>
          </div>
          <button onClick={onClose} className="text-[#98a892] hover:text-white transition bg-[#131812] p-2.5 rounded-full border border-[#323d2f]"><X size={18} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {b.passengers && b.passengers.length > 0 && (
            <div className="bg-[#131812]/80 border border-[#323d2f] rounded-2xl p-5 mb-5 shadow-inner">
              <h4 className="text-sm font-bold text-[#cfa474] mb-3 border-b border-[#323d2f] pb-2 flex items-center"><Users size={14} className="mr-2"/>รายชื่อผู้เดินทาง ({b.passengers.length} ท่าน)</h4>
              <div className="space-y-3">
                {b.passengers.map((p, i) => (
                  <div key={i} className="text-xs text-[#d1dbcd] flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#20271e] p-2.5 rounded-lg border border-[#323d2f]/50">
                    <span className="font-medium">{i+1}. {p.firstNameTh} {p.lastNameTh} {p.firstNameEn && `(${p.firstNameEn} ${p.lastNameEn})`}</span>
                    {p.passportNo && <span className="text-[#859c7b] mt-1 sm:mt-0 font-mono bg-[#131812] px-2 py-0.5 rounded">PP: {p.passportNo}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-[#20271e] to-[#181d17] border border-[#323d2f] rounded-2xl p-5 mb-5 shadow-lg">
            <div className="flex justify-between text-sm mb-3"><span className="text-[#98a892]">ทริป:</span><span className="text-[#d1dbcd] font-medium text-right max-w-[60%]">{b.tripTitle}</span></div>
            <div className="flex justify-between text-sm mb-3"><span className="text-[#98a892]">ยอดรวมทั้งสิ้น:</span><span className="text-[#d1dbcd] font-bold text-lg">฿{b.grandTotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm mb-3"><span className="text-[#859c7b]">รับแล้ว:</span><span className="text-[#859c7b] font-bold text-lg">฿{Math.ceil(b.totalPaid).toLocaleString()}</span></div>
            <div className="flex justify-between text-sm border-t border-[#323d2f] pt-3 mt-1"><span className="text-[#cfa474]">ค้างชำระ:</span><span className="text-[#cfa474] font-black text-xl">฿{Math.ceil(b.totalBalance).toLocaleString()}</span></div>

            {b.totalBalance > 0 && (
              <button
                onClick={() => onRequestBilling({ booking: b, installmentIndex: 'balance' })}
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#cfa474] to-[#a6825c] hover:from-[#e6c49e] hover:to-[#cfa474] text-[#131812] rounded-xl text-sm font-black flex items-center justify-center transition-all shadow-md"
              >
                <Receipt size={16} className="mr-2" /> สร้างลิงก์เก็บยอดคงเหลือ (ปิดยอด) ฿{Math.ceil(b.totalBalance).toLocaleString()}
              </button>
            )}
          </div>

          {b.paymentMode !== 'deposit' ? (
            <div className="bg-[#131812]/50 border border-[#323d2f] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-sm font-bold text-[#d1dbcd] flex items-center"><Calendar size={14} className="mr-2 text-[#859c7b]"/> ตารางผ่อนชำระ</h4>
                <span className="text-[10px] text-[#98a892] bg-[#20271e] px-2 py-1 rounded-md border border-[#323d2f]">คลิกเพื่อยืนยันยอด</span>
              </div>
              <div className="space-y-3">
                {b.paymentSchedule && b.paymentSchedule.map((s, idx) => {
                  const isPaid = s.status === 'paid';
                  const isEditing = editInstData && editInstData.index === idx;

                  if (isEditing) {
                    return (
                      <div key={s.installment} className="p-4 rounded-xl bg-[#20271e] border border-[#cfa474] shadow-md animate-[fadeIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-[#cfa474] font-bold">✏️ แก้ไขงวดที่ {s.installment}</span>
                          <button onClick={() => onDeleteInstallment(b.id, idx)} className="text-red-400 hover:text-red-300 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-colors" title="ลบงวดนี้"><Trash2 size={14}/></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <label className="text-[10px] text-[#859c7b] block mb-1 font-bold uppercase">ยอดชำระ (฿)</label>
                            <input type="number" value={editInstData.amount} onChange={e => onSetEditInstData({ ...editInstData, amount: e.target.value })} className="w-full bg-[#131812] border border-[#455241] rounded-lg px-3 py-2 text-sm text-[#d1dbcd] font-black focus:outline-none focus:border-[#cfa474]" />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#859c7b] block mb-1 font-bold uppercase">วันครบกำหนด</label>
                            <input type="date" value={editInstData.dueDate} onChange={e => onSetEditInstData({ ...editInstData, dueDate: e.target.value })} className="w-full bg-[#131812] border border-[#455241] rounded-lg px-3 py-2 text-sm text-[#d1dbcd] focus:outline-none focus:border-[#cfa474] css-date-picker" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onSetEditInstData(null)} className="px-4 py-2 bg-[#131812] text-[#98a892] rounded-lg text-xs font-bold hover:text-white transition border border-[#323d2f]">ยกเลิก</button>
                          <button onClick={() => onSaveInstEdit(b.id, idx)} disabled={isProcessing} className="px-4 py-2 bg-[#cfa474] text-[#131812] rounded-lg text-xs font-black hover:bg-[#b88c5a] transition shadow-md disabled:opacity-50">{isProcessing ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={s.installment} onClick={() => !editInstData && onToggleInstallment(b.id, idx)} className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${isPaid ? 'bg-gradient-to-r from-[#20271e] to-[#1b2e26] border-[#859c7b]/50 text-[#d1dbcd]' : 'bg-[#181d17] border-[#323d2f] text-[#98a892] hover:border-[#cfa474]/50 hover:bg-[#20271e]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isPaid ? 'bg-[#859c7b] text-[#131812]' : 'bg-[#323d2f] text-[#72826c]'}`}>{s.installment}</div>
                        <div>
                          <div className="font-bold text-sm text-[#d1dbcd]">งวดที่ {s.installment}</div>
                          <div className="text-[10px] opacity-70">ครบกำหนด: {formatDateDisplay(s.dueDate, lang)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-black tracking-wide text-lg ${isPaid ? 'text-[#859c7b]' : ''}`}>฿{Math.ceil(s.amount).toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          {isPaid ? (
                            <CheckCircle size={22} className="text-[#859c7b] drop-shadow-[0_0_8px_rgba(133,156,123,0.5)]" />
                          ) : (
                            <>
                              <CheckCircle size={22} className="text-[#455241] hover:text-[#cfa474] transition-colors" />
                              <button onClick={(e) => { e.stopPropagation(); onRequestBilling({ booking: b, installmentIndex: idx }); }} className="p-2 bg-[#20271e] border border-[#323d2f] text-[#cfa474] hover:bg-[#cfa474] hover:text-[#131812] rounded-lg transition-colors shadow-sm" title="เรียกเก็บเงิน"><Receipt size={14} /></button>
                            </>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); onSetEditInstData({ index: idx, amount: s.amount, dueDate: s.dueDate }); }} className="p-2 bg-[#20271e] border border-[#323d2f] text-[#98a892] hover:bg-[#cfa474] hover:text-[#131812] rounded-lg transition-colors shadow-sm" title="แก้ไขยอดชำระ"><Edit3 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => onAddInstallment(b.id)}
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 bg-[#131812] border border-[#323d2f] border-dashed hover:border-[#cfa474]/50 rounded-xl text-xs font-bold text-[#859c7b] hover:text-[#cfa474] transition-all flex items-center justify-center disabled:opacity-50"
                >
                  <Plus size={14} className="mr-1" /> เพิ่มงวดผ่อนชำระ (เพิ่มเอง)
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-[#98a892] bg-[#131812]/50 rounded-2xl border border-[#323d2f]">
              <CheckCircle size={48} className="mx-auto text-[#859c7b]/50 mb-4" />
              <p className="font-bold text-[#d1dbcd]">รายการนี้เป็นแบบมัดจำ</p>
              <p className="text-xs mt-1">{b.totalBalance > 0 ? 'ลูกค้ามียอดค้างชำระคงเหลือ (สามารถกดสร้างลิงก์ปิดยอดด้านบนได้)' : 'ได้รับยอดครบถ้วนแล้วสำหรับการยืนยันสิทธิ์'}</p>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-[#323d2f] bg-[#20271e]/80 rounded-b-3xl flex justify-end">
          <button onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold text-[#131812] bg-gradient-to-r from-[#d1dbcd] to-[#b4c7ab] hover:from-white hover:to-[#d1dbcd] transition shadow-lg">ปิดหน้าต่าง</button>
        </div>
      </div>
    </div>
  );
}
