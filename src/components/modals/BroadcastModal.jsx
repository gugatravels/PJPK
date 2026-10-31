import React from 'react';
import { MessageCircle, X, CheckCircle, Copy } from 'lucide-react';

/**
 * BroadcastModal — แสดงข้อความประกาศที่ระบบสร้างให้ พร้อมปุ่มคัดลอก
 *
 * Props:
 *  - text:       string  ข้อความที่จะ broadcast
 *  - copied:     boolean
 *  - t:          (key)=>string
 *  - onCopy:     ()=>void
 *  - onClose:    ()=>void
 */
export default function BroadcastModal({ text, copied, t, onCopy, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#131812]/90 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out] no-print">
      <div className="bg-[#181d17] border border-[#cfa474]/30 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#323d2f] flex justify-between items-center bg-[#20271e]/50 rounded-t-3xl">
          <h3 className="text-lg font-bold text-[#d1dbcd] flex items-center"><MessageCircle className="text-[#cfa474] mr-2" size={22} />{t('broadcastTitle')}</h3>
          <button onClick={onClose} className="text-[#72826c] hover:text-[#d1dbcd] transition"><X size={20} /></button>
        </div>
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <p className="text-sm text-[#98a892] mb-4">คัดลอกข้อความด้านล่างนี้ ไปวางใน Line Group ของทริปได้เลย</p>
          <textarea readOnly value={text} className="w-full flex-1 min-h-[300px] bg-[#131812] border border-[#323d2f] rounded-xl p-5 text-sm text-[#d1dbcd] focus:outline-none focus:border-[#cfa474] resize-none font-mono shadow-inner" />
        </div>
        <div className="p-6 border-t border-[#323d2f] bg-[#20271e]/50 rounded-b-3xl flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-[#98a892] hover:text-[#d1dbcd] hover:bg-[#323d2f] transition">ปิด</button>
          <button onClick={onCopy} className="px-6 py-3 bg-gradient-to-r from-[#859c7b] to-[#677b5e] text-white rounded-xl text-sm font-bold transition flex items-center shadow-lg shadow-[#859c7b]/20">
            {copied ? <CheckCircle size={16} className="mr-2"/> : <Copy size={16} className="mr-2"/>} {copied ? t('copySuccess') : t('copyMessage')}
          </button>
        </div>
      </div>
    </div>
  );
}
