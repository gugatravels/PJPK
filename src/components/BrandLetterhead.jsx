import React from 'react';
import { Globe } from 'lucide-react';
import { formatDateDisplay } from '../utils';

/**
 * BrandLetterhead — หัวกระดาษของรายงาน (ใช้ในโหมดพิมพ์ PDF + เซฟรูปภาพ)
 * ปรับธีมอัตโนมัติตามโหมด:
 *   - โหมดปกติ:    พื้นเข้ม + ตัดขอบทอง
 *   - isExportMode: พื้นขาว + ตัวอักษรเข้ม (เหมาะสำหรับเอกสาร)
 *   - print:       ใช้สีขาวเหมือน export
 *
 * Props:
 *  - siteSettings: object  ข้อมูลแบรนด์ (brandName, brandSubName, logoUrl)
 *  - isExportMode: boolean
 *  - lang:         'th' | 'en'
 *  - subtitle:     string?  คำอธิบายเพิ่มเติม (default: 'Booking Report · รายงานการจอง')
 */
export default function BrandLetterhead({
  siteSettings,
  isExportMode,
  lang,
  subtitle = 'Booking Report · รายงานการจอง',
}) {
  return (
    <div className={`${isExportMode ? 'bg-white border-b-4 border-[#cfa474]' : 'bg-gradient-to-r from-[#181d17] via-[#20271e] to-[#181d17] border-b-2 border-[#cfa474]/40'} print:bg-white print:border-b-4 print:border-[#cfa474] px-7 py-5 flex items-center justify-between gap-4`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${siteSettings?.logoUrl ? (isExportMode ? 'bg-white border border-gray-200' : 'bg-[#131812] border border-[#cfa474]/30') + ' print:bg-white print:border-gray-200' : 'bg-gradient-to-br from-[#cfa474] to-[#a6825c] shadow-md'}`}>
          {siteSettings?.logoUrl
            ? <img src={siteSettings.logoUrl} alt="Logo" crossOrigin="anonymous" className="w-full h-full object-contain" />
            : <Globe size={28} className={isExportMode ? 'text-white' : 'text-[#131812]'} />}
        </div>
        <div>
          <div className={`text-2xl font-black tracking-tight ${isExportMode ? 'text-[#181d17]' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#d1dbcd] to-[#cfa474]'} print:text-[#181d17]`}>
            {siteSettings?.brandName || 'GUGA'}
            <span className={`font-light ml-1 text-[#859c7b] print:text-[#859c7b]`}>{siteSettings?.brandSubName || 'Inter'}</span>
          </div>
          <div className={`text-[10px] uppercase tracking-[0.25em] font-bold mt-0.5 ${isExportMode ? 'text-[#a6825c]' : 'text-[#cfa474]'} print:text-[#a6825c]`}>{subtitle}</div>
        </div>
      </div>
      <div className={`text-right ${isExportMode ? 'text-gray-700' : 'text-[#98a892]'} print:text-gray-700`}>
        <div className="text-[10px] uppercase tracking-widest font-bold opacity-70">Generated</div>
        <div className="text-sm font-bold">{formatDateDisplay(new Date().toISOString().split('T')[0], lang)}</div>
        <div className="text-[10px] font-mono opacity-80">{new Date().toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  );
}
