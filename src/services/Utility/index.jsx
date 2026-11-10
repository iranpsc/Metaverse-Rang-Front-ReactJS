import { toast } from "react-hot-toast";
import i18n from "../../i18n/i18n";
import DOMPurify from "dompurify";
import { toGregorian, isValidJalaaliDate } from "jalaali-js";
export const SanitizeHTML = (html) => {
  if (!html) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "div",
      "p",
      "br",
      "hr",
      "span",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "s",
      "mark",
      "small",
      "sub",
      "sup",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "dl",
      "dt",
      "dd",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    ALLOWED_ATTR: [
      "href",
      "title",
      "target",
      "src",
      "alt",
      "colspan",
      "rowspan",
      "width",
      "height",
      "style",
    ],

    FORBID_TAGS: ["script", "iframe", "object", "embed"],
  });

  const temp = document.createElement("div");
  temp.innerHTML = cleanHTML;

  return cleanHTML;
};

// تاریخ شمسی بگیره میلادی بر میگردونه و میلادی بگیره شمسی بر میگردونه
export function ConvertJalali(date) {
  const isPersian = i18n.language === "fa";

  const isJalali = /^\d{4}\/\d{1,2}\/\d{1,2}/.test(date);

  let parsedDate;

  if (isJalali) {
    const [year, month, day] = date.split("/").map(Number);

    const gregorian = toGregorian(year, month, day);

    parsedDate = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
  } else {
    parsedDate = new Date(date);
  }

  return parsedDate.toLocaleDateString(
    isPersian ? "fa-IR" : i18n.language || "en-US",
  );
}

const BIRTHDATE_REGEX = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/;
const JALALI_MAX_YEAR = 1700;

// تاریخ شمسی یا میلادی به شکل YYYY/MM/DD یا YYYY-MM-DD رو می‌گیره
// اگه سال کمتر از 1700 باشه شمسی حساب می‌شه، وگرنه میلادی
// خروجی: سن به سال کامل (برای ورودی نامعتبر یا تاریخ آینده، 0)
export function TimeAgo(time) {
  if (typeof time !== "string") return 0;

  const match = convertToEnglish(time.trim()).match(BIRTHDATE_REGEX);
  if (!match) return 0;

  const [year, month, day] = match.slice(1).map(Number);
  let gy = year;
  let gm = month;
  let gd = day;

  if (year < JALALI_MAX_YEAR) {
    if (!isValidJalaaliDate(year, month, day)) return 0;
    ({ gy, gm, gd } = toGregorian(year, month, day));
  }

  // رد کردن تاریخ‌های میلادی نامعتبر مثل 1990/02/31
  const birthDate = new Date(gy, gm - 1, gd);
  if (
    birthDate.getFullYear() !== gy ||
    birthDate.getMonth() !== gm - 1 ||
    birthDate.getDate() !== gd
  ) {
    return 0;
  }

  const today = new Date();
  const hadBirthdayThisYear =
    today.getMonth() > gm - 1 ||
    (today.getMonth() === gm - 1 && today.getDate() >= gd);

  const age = today.getFullYear() - gy - (hadBirthdayThisYear ? 0 : 1);

  return Math.max(0, age);
}

//تابع محاسبه  زمان باقیمانده
export const parseServerDate = (value) => {
  const text = convertToEnglish(String(value ?? "").trim());
  const match = text.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );

  // میلادی و ISO را خود Date درست می‌خواند
  if (!match || Number(match[1]) >= JALALI_MAX_YEAR) {
    return new Date(text).getTime();
  }

  const [year, month, day, hours, minutes, seconds] = match
    .slice(1)
    .map((part) => Number(part ?? 0));

  if (!isValidJalaaliDate(year, month, day)) return NaN;

  const { gy, gm, gd } = toGregorian(year, month, day);

  return new Date(gy, gm - 1, gd, hours, minutes, seconds).getTime();
};
export function GetTimeElapsed(date) {
  if (!date) return null;

  const [datePart, timePart = "00:00:00"] = date.split(" ");

  const [year, month, day] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  const gregorian = toGregorian(year, month, day);

  const pastDate = new Date(
    gregorian.gy,
    gregorian.gm - 1,
    gregorian.gd,
    hours,
    minutes,
    seconds,
  );

  const now = new Date();

  const diff = Math.max(0, now - pastDate);

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const remainingAfterDays = totalSeconds % 86400;

  const hoursDiff = Math.floor(remainingAfterDays / 3600);
  const remainingAfterHours = remainingAfterDays % 3600;

  const minutesDiff = Math.floor(remainingAfterHours / 60);
  const secondsDiff = remainingAfterHours % 60;

  return {
    days,
    hours: hoursDiff,
    minutes: minutesDiff,
    seconds: secondsDiff,
  };
}

export const formatNumber = (value, decimals = 2) => {
  const num = Number(value);

  if (Number.isNaN(num)) return "";

  return Number.isInteger(num) ? num : Number(num.toFixed(decimals));
};

export const calculateFee = (number = 100, percent = 5) => {
  const parseNumber = parseInt(number);
  return (parseNumber * percent) / 100 + parseNumber;
};

export const convertToPersian = (value) => {
  if (value == null) return "";

  const str = String(value);

  const isPersian = i18n.language === "fa";

  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";

  return isPersian
    ? str.replace(/\d/g, (d) => persianDigits[d])
    : str.replace(/[۰-۹]/g, (d) => englishDigits[persianDigits.indexOf(d)]);
};
export const convertToEnglish = (value) => {
  if (value == null) return "";

  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const englishDigits = "0123456789";

  return String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
    const index = persianDigits.indexOf(digit);
    return englishDigits[index !== -1 ? index : arabicDigits.indexOf(digit)];
  });
};
export const ToastError = (message) => {
  return toast.error(message, {
    style: {
      zIndex: 2147483647,
      direction: "rtl",
      textAlign: "right",
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      border: "2px solid red",
    },
    duration: 4000,
  });
};

export const ToastSuccess = (message) => {
  return toast.success(message, {
    style: {
      direction: "rtl",
      textAlign: "right",
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
      border: "2px solid green",
    },
    duration: 5000,
  });
};

// تبدیل عدد واقعی به فرمت K/M و 3 رقم اعشار (formatAmount)
export const formatAmount = (value) => {
  const num = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(num)) return "0";

  const format = (n) => {
    // حداکثر 3 رقم اعشار، حذف صفر اضافی
    return n.toFixed(3).replace(/\.?0+$/, "");
  };

  if (num >= 1_000_000) {
    return `${format(num / 1_000_000)}M`;
  }

  if (num >= 1_000) {
    return `${format(num / 1_000)}K`;
  }

  return format(num);
};

export const metarangUrl = (path = "") =>
  `https://metarang.com/${i18n.language}/${path}`;

export const metarangUrlCitizen = (path = "") =>
  `https://metarang.com/${i18n.language}/citizens/${path}`;

export const truncateText = (text, maxLength = 20) => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

const PSC_TO_IRR = 900;

export const pscToIrr = (psc) => {
  return (+psc || 0) * PSC_TO_IRR;
};
export const calculateTotalIrr = (irr, psc) => (+irr || 0) + pscToIrr(psc);

const KARBARI_UNIT_PRICE_IRR = {
  m: 10000, // مسکونی (زرد)
  t: 30000, // تجاری (قرمز)
  a: 60000, // آموزشی (آبی)
};

export const calculateFallbackPriceIrr = (karbari, stability) =>
  (+stability || 0) * (KARBARI_UNIT_PRICE_IRR[karbari] || 0);

export const getTranslation = (fieldId) => {
  const resources = i18n.store.data;
  const currentLanguage = i18n.language || "fa";
  const translationData =
    resources?.[currentLanguage]?.translation ??
    resources?.[currentLanguage] ??
    {};

  if (!translationData || Object.keys(translationData).length === 0) {
    return `E-Uniq${fieldId}`;
  }

  if (translationData.modals) {
    const modals = translationData.modals;

    for (const modal of modals) {
      for (const tab of modal.tabs || []) {
        const field = tab.fields?.find((field) => field.unique_id == fieldId);
        if (field?.translation) {
          return field.translation;
        }
      }
    }
  }

  const normalizedId = String(fieldId);
  const directValue = translationData[normalizedId] ?? translationData[fieldId];

  if (typeof directValue === "string" && directValue.trim()) {
    return directValue;
  }

  if (typeof directValue === "number" || typeof directValue === "boolean") {
    return String(directValue);
  }

  if (
    translationData.translation &&
    typeof translationData.translation === "object"
  ) {
    const nestedDirectValue =
      translationData.translation[normalizedId] ??
      translationData.translation[fieldId];

    if (typeof nestedDirectValue === "string" && nestedDirectValue.trim()) {
      return nestedDirectValue;
    }
  }

  return `E-Uniq${fieldId}`;
};
//getFieldsByTabName(112, 120)
// => ["متن 112" تا "متن 120"]
export const getFieldsByTabName = (firstParam, secondParam) => {
  const resources = i18n.store.data;
  const currentLanguage = i18n.language || "fa";

  const translationData =
    resources?.[currentLanguage]?.translation ??
    resources?.[currentLanguage] ??
    {};

  const firstId = Number(firstParam);
  const secondId = Number(secondParam);

  if (
    Number.isNaN(firstId) ||
    Number.isNaN(secondId) ||
    firstParam === undefined ||
    secondParam === undefined
  ) {
    return [];
  }

  const minId = Math.min(firstId, secondId);
  const maxId = Math.max(firstId, secondId);

  return Object.entries(translationData)
    .filter(([key]) => {
      const id = Number(key);

      return !Number.isNaN(id) && id >= minId && id <= maxId;
    })
    .map(([key, value]) => ({
      unique_id: Number(key),
      translation: value,
    }));
};

const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i;

const detectMobile = () => {
  if (typeof navigator === "undefined") return false;

  const { userAgentData, userAgent, platform, maxTouchPoints } = navigator;

  const isIPadOS = platform === "MacIntel" && maxTouchPoints > 1;

  return (
    Boolean(userAgentData?.mobile) || MOBILE_UA.test(userAgent) || isIPadOS
  );
};

export const isMobile = detectMobile();
export const getBrowser = async () => {
  const ua = navigator.userAgent;

  if (navigator.brave && (await navigator.brave.isBrave())) {
    return "Brave";
  }

  if (/Edg/i.test(ua)) {
    return "Edge";
  }

  if (/OPR/i.test(ua)) {
    return "Opera";
  }

  if (/Firefox/i.test(ua)) {
    return "Firefox";
  }

  if (/Chrome/i.test(ua)) {
    return "Chrome";
  }

  return "Unknown";
};
// عدد میگیرد به صورت ساعت دقیقه و ثانیه ریترن میکند
export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedMinutes = String(minutes).padStart(2, "۰");
  const formattedSeconds = String(seconds).padStart(2, "۰");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const levelIds = {
  شهروند: 382,
  "روزنامه نگار": 383,
  "مشارکت کننده": 589,
  "توسعه دهنده": 68,
  بازرس: 69,
  بازرگان: 590,
  دادخواه: 71,
  "اعضای شورای شهر": 591,
  شهردار: 592,
  فرماندار: 74,
  وزیر: 75,
  داور: 76,
  دادگذار: 77,
};
const LEVEL_SLUGS = {
  شهروند: "citizen-baguette",
  "روزنامه نگار": "reporter-baguette",
  "مشارکت کننده": "participation-baguette",
  "توسعه دهنده": "developer-baguette",
  بازرس: "inspector-baguette",
  بازرگان: "businessman-baguette",
  دادخواه: "lawyer-baguette",
  "اعضای شورای شهر": "city-council-baguette",
  شهردار: "the-mayor-baguette",
  فرماندار: "governor-baguette",
  وزیر: "minister-baguette",
  داور: "judge-baguette",
  دادگذار: "legislator-baguette",
};
const LEVEL_SLUGS_BY_ID = {
  1: "citizen-baguette",
  2: "reporter-baguette",
  3: "participation-baguette",
  4: "developer-baguette",
  5: "inspector-baguette",
  6: "businessman-baguette",
  7: "lawyer-baguette",
  8: "city-council-baguette",
  9: "the-mayor-baguette",
  10: "governor-baguette",
  11: "minister-baguette",
  12: "judge-baguette",
  13: "legislator-baguette",
};

// آدرس صفحه‌ی لول با زبان فعلی اپ؛ برای لولی که اسلاگ ندارد undefined برمی‌گرداند
export const metarangLevelUrl = (levelName) =>
  Object.hasOwn(LEVEL_SLUGS, levelName)
    ? metarangUrl(`levels/citizen/${LEVEL_SLUGS[levelName]}/general-info`)
    : undefined;

export const metarangLevelUrlById = (levelId) =>
  Object.hasOwn(LEVEL_SLUGS_BY_ID, levelId)
    ? metarangUrl(`levels/citizen/${LEVEL_SLUGS_BY_ID[levelId]}/general-info`)
    : undefined;

export const DATE_PATTERN = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}/;

const INVISIBLE_CHARS =
  /[\u200B\u200D-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g;

// بدون trim؛ برای وقتی که کاربر داره تایپ می‌کنه و ممکنه آخر متن فاصله بذاره
export const stripInvisibleChars = (text) =>
  (text || "").replace(INVISIBLE_CHARS, "");

// با trim؛ برای ارسال به سرور و جستجو
export const cleanSearchText = (text) => stripInvisibleChars(text).trim();

// فقط مسیر نسبی (بدون /api/) به Request داده می‌شود
export const normalizeRequestPath = (url) => {
  if (!url) return "";
  if (url.startsWith("/api/")) return url.substring(5);
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      return parsed.pathname.replace(/^\/api\//, "") + parsed.search;
    } catch {
      return url;
    }
  }
  return url;
};
