import React from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';
import { renderText } from '../../utils';

/**
 * TermsModal — แสดงเงื่อนไขก่อนการจองและให้ลูกค้ากดยอมรับ
 *
 * Props:
 *  - trip:           object  pendingTrip ที่กำลังจะจอง
 *  - lang:           'th' | 'en'
 *  - t:              (key)=>string
 *  - terms:          string[]  ข้อความเงื่อนไข (siteSettings.terms[lang])
 *  - accepted:       boolean
 *  - onAcceptChange: (boolean)=>void
 *  - onClose:        ()=>void
 *  - onProceed:      ()=>void
 */
export default function TermsModal({ trip, lang, t, terms, accepted, onAcceptChange, onClose, onProceed }) {
  if (!trip) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#131812]/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#323d2f] flex justify-between items-center bg-gradient-to-r from-[#20271e] to-[#181d17]">
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#cfa474] to-[#e6c49e] flex items-center"><AlertTriangle className="text-[#cfa474] mr-2" size={22} /> {t('termsTitle')}</h3>
          <button onClick={onClose} className="text-[#72826c] hover:text-[#d1dbcd] transition bg-[#131812] p-2 rounded-full"><X size={18} /></button>
        </div>
        <div className="p-8 overflow-y-auto space-y-5 flex-1 text-sm text-[#d1dbcd] custom-scrollbar">
          <div className="bg-gradient-to-r from-[#cfa474]/10 to-transparent border-l-4 border-[#cfa474] rounded-r-lg p-4 mb-2">
            <span className="text-xs text-[#98a892] uppercase font-bold block mb-1">คุณกำลังทำรายการจอง:</span>
            <span className="font-black text-[#d1dbcd] text-base">{renderText(trip.title, lang)}</span>
          </div>
          <ul className="space-y-4 list-none mt-4">
            {terms?.map((term, idx) => (
              <li key={idx} className="flex items-start bg-[#131812]/50 p-3 rounded-xl border border-[#323d2f]">
                <div className="bg-[#20271e] p-1 rounded-full mr-3 border border-[#455241] mt-0.5"><CheckCircle size={14} className="text-[#859c7b]"/></div>
                <span className="leading-relaxed">{term}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 border-t border-[#323d2f] bg-[#131812]">
          <label className="flex items-center cursor-pointer mb-6 p-3 bg-[#20271e] rounded-xl border border-[#455241] hover:border-[#cfa474]/50 transition-colors group">
            <input type="checkbox" checked={accepted} onChange={(e) => onAcceptChange(e.target.checked)} className="w-5 h-5 rounded border-[#455241] bg-[#131812] text-[#cfa474] accent-[#cfa474] mr-3 cursor-pointer" />
            <span className="text-sm font-bold text-[#d1dbcd] group-hover:text-white transition-colors">{t('acceptTerms')}</span>
          </label>
          <button onClick={onProceed} disabled={!accepted} className="w-full py-4 bg-gradient-to-r from-[#d1dbcd] to-[#b4c7ab] text-[#131812] rounded-xl text-base font-black hover:from-white hover:to-[#d1dbcd] transition-all disabled:opacity-30 disabled:from-[#323d2f] disabled:to-[#323d2f] disabled:text-[#72826c] shadow-lg shadow-[#d1dbcd]/10">
            {t('proceedPayment')}
          </button>
        </div>
      </div>
    </div>
  );
}
