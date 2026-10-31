// ==========================================
// 🛠 UTILITY HELPERS
// ==========================================
// รวมฟังก์ชัน format / render text ที่ใช้ซ้ำๆ ทั่วแอป
// ทุกตัวเป็น pure function — ทดสอบง่าย ไม่ขึ้นกับ state

/**
 * แปลง object i18n หรือ string ธรรมดาให้กลายเป็นข้อความที่แสดงได้
 * รองรับรูปแบบ { th: '...', en: '...' } และ string ดิบ
 */
export const renderText = (objOrString, currentLang) => {
  if (!objOrString) return '';
  if (typeof objOrString === 'string') return objOrString;
  return objOrString[currentLang] || objOrString.th || '';
};

/**
 * คืนข้อความระยะเวลาเดินทางเช่น "(5 วัน 4 คืน)" / "(5 Days 4 Nights)"
 * ถ้าเป็นไปเช้าเย็นกลับ → "(ไปเช้าเย็นกลับ)"
 */
export const getDurationText = (start, end, lang = 'th') => {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = e - s;
  if (diffTime < 0) return '';
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const days = diffDays + 1;
  const nights = diffDays;
  if (nights === 0) return lang === 'th' ? '(ไปเช้าเย็นกลับ)' : '(One Day Trip)';
  return lang === 'th'
    ? `(${days} วัน ${nights} คืน)`
    : `(${days} Days ${nights} Nights)`;
};

/**
 * แปลงวันที่เป็นข้อความที่อ่านง่าย
 *  - TH: "26 เม.ย. 2569" (พ.ศ.)
 *  - EN: "26 Apr 2026"
 */
export const formatDateDisplay = (dateString, lang = 'th') => {
  if (!dateString || dateString === 'N/A') return dateString;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    if (lang === 'th') {
      const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
  } catch (e) {
    return dateString;
  }
};

/**
 * แปลงช่วงวันที่ เช่น "26 เม.ย. - 30 เม.ย. 2569 (5 วัน 4 คืน)"
 * ถ้า start === end (วันเดียว) จะแสดงแค่วันเดียว + (ไปเช้าเย็นกลับ)
 */
export const formatDateRangeDisplay = (start, end, lang = 'th') => {
  if (!start) return '';
  const startStr = formatDateDisplay(start, lang);
  if (!end || start === end) {
    const duration = getDurationText(start, start, lang);
    return `${startStr} ${duration}`;
  }
  const endStr = formatDateDisplay(end, lang);
  const duration = getDurationText(start, end, lang);
  return `${startStr} - ${endStr} ${duration}`;
};
