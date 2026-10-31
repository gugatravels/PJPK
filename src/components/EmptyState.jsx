import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * EmptyState — แสดงเมื่อไม่พบทริปที่ตรงกับเงื่อนไขการค้นหา
 *
 * Props:
 *  - onClear: () => void  callback ตอนกดปุ่ม "ล้างตัวกรอง"
 */
export default function EmptyState({ onClear }) {
  return (
    <div
      className="col-span-full text-center py-16 px-6 bg-[#131812]/60 rounded-3xl border border-[#323d2f] border-dashed backdrop-blur-md"
      style={{ animation: 'fadeIn .4s ease-out both' }}
    >
      <div className="w-16 h-16 rounded-full bg-[#20271e] border border-[#323d2f] flex items-center justify-center mx-auto mb-5">
        <Search size={28} className="text-[#72826c]" />
      </div>
      <p className="text-[#d1dbcd] font-bold text-base mb-2">ไม่พบทริปที่ตรงกับเงื่อนไข</p>
      <p className="text-[#72826c] text-sm mb-6">ลองเปลี่ยนตัวกรอง หรือสำรวจทริปทั้งหมด</p>
      <button onClick={onClear} className="gx-btn gx-btn--ghost text-sm">
        <X size={14} className="mr-1.5" /> ล้างตัวกรองทั้งหมด
      </button>
    </div>
  );
}
