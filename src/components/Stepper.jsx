import React from 'react';

/**
 * Stepper — แสดงขั้นตอนการจองทริป (เลือกทริป → รายละเอียด → ชำระเงิน → เสร็จสิ้น)
 *
 * Props:
 *  - step:  number  ขั้นปัจจุบัน (1-4)
 *  - t:     (key) => string  ฟังก์ชัน translator
 */
export default function Stepper({ step, t }) {
  const steps = [t('step1'), t('step2'), t('step3'), t('step4')];
  return (
    <div className="flex items-center justify-center mb-10 w-full max-w-lg mx-auto no-print relative z-10">
      {steps.map((label, idx) => {
        const sNum = idx + 1;
        const isActive = step === sNum;
        const isPassed = step > sNum;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center relative">
              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-[#cfa474] to-[#a6825c] scale-150 shadow-[0_0_15px_rgba(207,164,116,0.6)]' : isPassed ? 'bg-[#859c7b]' : 'bg-[#455241]'}`} />
              <span className={`absolute top-5 text-[10px] uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#d1dbcd] to-[#cfa474] font-bold' : 'text-[#72826c]'}`}>{label}</span>
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-[2px] mx-4 transition-all duration-500 ${step > sNum ? 'bg-gradient-to-r from-[#859c7b] to-[#cfa474]' : 'bg-[#323d2f]'}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
