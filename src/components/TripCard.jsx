import React from 'react';
import { Map, Plane, Zap } from 'lucide-react';
import { renderText } from '../utils';

/**
 * TripCard — แสดงการ์ดทริปท่องเที่ยว 1 ใบ ในหน้ารายการ (customer view)
 *
 * Props:
 *  - trip:    object  ข้อมูลทริป (title, image, country, duration, price, isHot, tags)
 *  - idx:     number  ลำดับ ใช้คำนวณ animation delay
 *  - lang:    'th' | 'en'
 *  - t:       (key) => string  translator
 *  - onClick: () => void  callback เมื่อกดที่การ์ด
 */
export default function TripCard({ trip, idx, lang, t, onClick }) {
  return (
    <div
      onClick={onClick}
      className="gx-trip-card group cursor-pointer bg-[#181d17]/90 border border-[#323d2f] rounded-[2rem] overflow-hidden hover:border-[#cfa474]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_48px_-16px_rgba(207,164,116,0.28)] flex flex-col backdrop-blur-xl"
      style={{ animationDelay: `${idx * 90}ms` }}
    >
      <div className="h-64 overflow-hidden relative m-3 rounded-[1.5rem] shadow-inner">
        <img src={trip.image} alt="Trip" className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131812] via-[#131812]/20 to-transparent opacity-90" />
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {trip.tags?.[lang]?.map(tag => (
            <span key={tag} className="text-[9px] uppercase font-black tracking-wider px-3 py-1.5 bg-[#131812]/60 backdrop-blur-md text-[#d1dbcd] rounded-lg border border-white/10 shadow-sm">{tag}</span>
          ))}
        </div>
        {trip.isHot && (
          <div className="absolute top-4 right-4 bg-gradient-to-br from-red-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center">
            <Zap size={10} className="mr-1"/> HOT
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between relative">
        <div className="absolute top-[-20px] right-6 w-12 h-12 bg-[#181d17] rounded-full border border-[#323d2f] flex items-center justify-center shadow-lg group-hover:border-[#cfa474]/50 group-hover:bg-[#cfa474]/10 transition-colors">
          <Plane size={20} className="text-[#859c7b] group-hover:text-[#cfa474] transition-colors -rotate-45 ml-1 mb-1"/>
        </div>
        <div>
          <div className="text-xs text-[#cfa474] mb-3 flex items-center font-bold tracking-wide">
            <span className="flex items-center bg-[#cfa474]/10 px-2.5 py-1 rounded-md border border-[#cfa474]/20"><Map size={12} className="mr-1.5" /> {trip.country}</span>
            <span className="mx-2 text-[#455241]">•</span>
            <span className="text-[#98a892]">{renderText(trip.duration, lang)}</span>
          </div>
          <h3 className="text-xl font-black text-[#d1dbcd] leading-snug group-hover:text-white transition-colors line-clamp-2">{renderText(trip.title, lang)}</h3>
        </div>
        <div className="mt-8 flex justify-between items-end border-t border-[#323d2f] pt-5">
          <div>
            <p className="text-[10px] text-[#72826c] uppercase tracking-widest font-bold mb-1">{t('startingPrice')}</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d1dbcd] to-[#859c7b]">฿{(trip.price || 0).toLocaleString()}</p>
          </div>
          <div className="text-xs font-black uppercase tracking-widest bg-[#20271e] text-[#859c7b] border border-[#455241] px-5 py-3 rounded-xl group-hover:bg-gradient-to-r group-hover:from-[#cfa474] group-hover:to-[#a6825c] group-hover:text-[#131812] group-hover:border-transparent transition-all shadow-md">Reserve</div>
        </div>
      </div>
    </div>
  );
}
