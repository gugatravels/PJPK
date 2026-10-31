import React from 'react';
import { X, Zap, MapPin, Calendar, CreditCard, Plane, FileText, ShieldCheck } from 'lucide-react';
import { renderText, formatDateRangeDisplay } from '../../utils';

/**
 * TripPreviewModal — แสดงรายละเอียดทริปก่อนกดจอง (Customer view)
 *
 * Props:
 *  - trip:               object  ข้อมูลทริปที่จะแสดง
 *  - lang:               'th' | 'en'
 *  - t:                  (key)=>string
 *  - todayStr:           string  YYYY-MM-DD วันนี้ (สำหรับกรองรอบเดินทาง)
 *  - getAvailableSeats:  (tripId, dateId)=>number
 *  - onClose:            ()=>void
 *  - onProceed:          (trip)=>void  เริ่มขั้นตอนจอง
 */
export default function TripPreviewModal({
  trip, lang, t, todayStr, getAvailableSeats, onClose, onProceed,
}) {
  if (!trip) return null;
  const upcomingDates = trip.availableDates?.filter(d => d.start >= todayStr) || [];

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center bg-[#131812]/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="relative h-64 sm:h-80 w-full shrink-0">
          <img src={trip.image} alt="Trip Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181d17] via-[#181d17]/40 to-transparent"></div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-[#131812]/80 text-[#d1dbcd] hover:text-white p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-colors z-10"><X size={20} /></button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex gap-2 flex-wrap mb-2">
              {trip.isHot && <span className="text-[10px] bg-gradient-to-br from-red-500 to-orange-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-md flex items-center"><Zap size={10} className="mr-1"/> HOT</span>}
              <span className="text-[10px] bg-[#cfa474]/20 border border-[#cfa474]/30 text-[#cfa474] px-3 py-1 rounded-full font-bold flex items-center"><MapPin size={10} className="mr-1"/> {trip.country}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-lg">{renderText(trip.title, lang)}</h2>
            <div className="text-sm text-[#98a892] mt-1 font-medium">{renderText(trip.duration, lang)}</div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-[#d1dbcd] space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131812] p-4 rounded-2xl border border-[#323d2f] shadow-inner">
              <p className="text-[10px] text-[#72826c] uppercase tracking-widest font-bold mb-1">{t('startingPrice')}</p>
              <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#cfa474] to-[#e6c49e]">฿{(trip.price || 0).toLocaleString()}</p>
              {trip.allowChild !== false && <p className="text-[10px] text-[#98a892] mt-1 font-medium">เด็ก: ฿{(trip.childPrice || trip.price || 0).toLocaleString()}</p>}
            </div>
            <div className="bg-[#131812] p-4 rounded-2xl border border-[#323d2f] shadow-inner">
              <p className="text-[10px] text-[#72826c] uppercase tracking-widest font-bold mb-1">ยอดมัดจำ</p>
              <p className="text-xl font-black text-[#d1dbcd]">฿{(trip.deposit || 0).toLocaleString()}</p>
              {trip.installmentMonths > 0 && <p className="text-[10px] text-[#98a892] mt-1 font-medium flex items-center"><CreditCard size={10} className="mr-1"/> ผ่อนได้สูงสุด {trip.installmentMonths} งวด</p>}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[#b4c7ab] mb-3 flex items-center border-b border-[#323d2f] pb-2"><Calendar size={16} className="mr-2 text-[#859c7b]"/> รอบเดินทางที่เปิดรับ</h4>
            <div className="space-y-2">
              {upcomingDates.map((d, i) => {
                const avail = getAvailableSeats(trip.id, d.id);
                const isFull = avail <= 0;
                return (
                  <div key={i} className={`flex justify-between items-center p-3.5 rounded-xl border ${isFull ? 'bg-[#131812] border-[#323d2f] opacity-60' : 'bg-[#20271e] border-[#455241] shadow-sm'}`}>
                    <div>
                      <div className="text-sm font-bold text-[#d1dbcd]">{formatDateRangeDisplay(d.start, d.end, lang)}</div>
                      <div className="text-[10px] text-[#98a892] mt-1 flex items-center"><Plane size={10} className="mr-1 -rotate-45"/> {d.flight} {d.price && Number(d.price) !== Number(trip.price) ? ` (฿${Number(d.price).toLocaleString()})` : ''}</div>
                    </div>
                    <div className={`text-xs font-black px-3 py-1.5 rounded-lg ${isFull ? 'bg-red-500/10 text-red-400' : 'bg-[#859c7b]/20 text-[#b4c7ab]'}`}>{isFull ? 'เต็มแล้ว' : `ว่าง ${avail} ที่`}</div>
                  </div>
                );
              })}
              {upcomingDates.length === 0 && (
                <div className="text-center py-6 text-[#72826c] text-sm bg-[#131812] rounded-xl border border-[#323d2f] border-dashed font-medium">ยังไม่มีรอบเดินทางที่เปิดรับในขณะนี้</div>
              )}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-[#323d2f] bg-[#181d17] grid grid-cols-2 gap-4 shrink-0">
          {trip.itineraryLink ? (
            <a href={trip.itineraryLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#20271e] hover:bg-[#323d2f] text-[#d1dbcd] border border-[#455241] py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
              <FileText size={16} className="mr-2"/> แผนการเดินทาง (PDF)
            </a>
          ) : (
            <button disabled className="flex items-center justify-center bg-[#131812] text-[#72826c] border border-[#323d2f] py-3.5 rounded-xl font-bold text-sm cursor-not-allowed">
              <FileText size={16} className="mr-2"/> ไม่มีแผนการเดินทาง
            </button>
          )}
          <button onClick={() => onProceed(trip)} disabled={upcomingDates.length === 0} className="flex items-center justify-center bg-gradient-to-r from-[#cfa474] to-[#a6825c] hover:from-[#b88c5a] hover:to-[#8f6a45] text-[#131812] py-3.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-[#cfa474]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]">
            <ShieldCheck size={16} className="mr-2"/> จองทริปนี้
          </button>
        </div>
      </div>
    </div>
  );
}
