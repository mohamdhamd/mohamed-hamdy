// معادلات فلكية لحساب أطوار القمر والتاريخ الهجري بدقة
import { MoonData } from '../types';

const SYNODIC_MONTH = 29.530588853; // متوسط الشهر القمري بالأيام
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // محاق مرجعي دقيق سنة 2000

/**
 * دالة لحساب طور القمر ونسبة الإضاءة بناءً على التاريخ
 * @param date التاريخ المطلوب حساب الطور له (افتراضياً لحظة الاستدعاء)
 */
export function calculateMoonData(date: Date = new Date()): MoonData {
  // حساب عدد الأيام الفلكية منذ المحاق المرجعي
  const diffDays = (date.getTime() - REFERENCE_NEW_MOON) / 86400000;
  
  // الطور كنسبة من 0 إلى 1 (0 = محاق، 0.5 = بدر)
  const phase = ((diffDays % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH / SYNODIC_MONTH;
  
  // نسبة إضاءة القرص القمري (0% إلى 100%)
  const illuminationFraction = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const illumination = Math.round(illuminationFraction * 100);

  // هل القمر في حالة زيادة (Waxing)؟
  const isWaxing = phase < 0.5;

  // تحديد اسم الطور بالعربي والإنجليزي فلكياً
  let phaseNameAr = '';
  let phaseNameEn = '';

  if (phase < 0.03 || phase > 0.97) {
    phaseNameAr = 'محاق';
    phaseNameEn = 'New Moon';
  } else if (phase < 0.22) {
    phaseNameAr = 'هلال متزايد';
    phaseNameEn = 'Waxing Crescent';
  } else if (phase <= 0.28) {
    phaseNameAr = 'تربيع أول';
    phaseNameEn = 'First Quarter';
  } else if (phase < 0.47) {
    phaseNameAr = 'أحدب متزايد';
    phaseNameEn = 'Waxing Gibbous';
  } else if (phase <= 0.53) {
    phaseNameAr = 'بدر كامل';
    phaseNameEn = 'Full Moon';
  } else if (phase < 0.72) {
    phaseNameAr = 'أحدب متناقص';
    phaseNameEn = 'Waning Gibbous';
  } else if (phase <= 0.78) {
    phaseNameAr = 'تربيع أخير';
    phaseNameEn = 'Last Quarter';
  } else {
    phaseNameAr = 'هلال متناقص';
    phaseNameEn = 'Waning Crescent';
  }

  // حساب التاريخ الهجري باستخدام Intl
  let hijriDateAr = '';
  let hijriDateEn = '';

  try {
    const formatterAr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDateAr = formatterAr.format(date) + ' هـ';

    const formatterEn = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDateEn = formatterEn.format(date) + ' AH';
  } catch (e) {
    // حل بديل في حال عدم دعم التقويم الإسلامي في بعض المتصفحات القديمة
    const approxDay = Math.floor(phase * SYNODIC_MONTH) + 1;
    hijriDateAr = `اليوم ${approxDay} من الشهر القمري`;
    hijriDateEn = `Day ${approxDay} of Lunar Month`;
  }

  return {
    phase,
    illumination,
    phaseNameAr,
    phaseNameEn,
    hijriDateAr,
    hijriDateEn,
    isWaxing
  };
}

/**
 * تحويل الأرقام الإنجليزية إلى أرقام عربية مشرقية
 */
export function toArabicNumerals(num: number | string): string {
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (d) => arDigits[Number(d)]);
}
