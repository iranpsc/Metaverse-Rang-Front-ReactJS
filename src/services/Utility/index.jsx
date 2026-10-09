import { toast } from "react-hot-toast";
import i18n from "../../i18n/i18n";
import DOMPurify from "dompurify";
import { toGregorian, isValidJalaaliDate } from "jalaali-js";
export const SanitizeHTML = (html) => {
  if (!html) return "";

  const cleanHTML = DOMPurify.sanitize(html, {
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

  return temp.textContent || "";
};
export const getPlainText = (htmlString) => {
  if (!htmlString) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

export function TextShorter(content, endStr = 20) {
  if (content?.length > endStr) {
    return `${SanitizeHTML(content).substring(0, endStr)}...`;
  }

  return SanitizeHTML(content);
}
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

  return parsedDate.toLocaleDateString(isPersian ? "fa-IR" : "en-US");
}

const BIRTHDATE_REGEX = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/;
const JALALI_MAX_YEAR = 1700;

// تاریخ شمسی یا میلادی به شکل YYYY/MM/DD یا YYYY-MM-DD رو می‌گیره
// اگه سال کمتر از 1700 باشه شمسی حساب می‌شه، وگرنه میلادی
// خروجی: سن به سال کامل (برای ورودی نامعتبر یا تاریخ آینده، 0)
export function TimeAgo(time) {
  if (typeof time !== "string") return 0;

  const match = fixNumbers(time.trim()).match(BIRTHDATE_REGEX);
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
    seconds
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
export function EmailValidator(email) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
}
// این تابع برای فرمت اعداد اعشاری هست و فقط در صورتی که اعداد اعشار داشته باشد باشند
// اعشار ان نمایش داده میشود در غیر این صورت اعداد بدون اعشار نمایش داده میشوند
export const normalizeDecimalInput = (value) => {
  if (value === "") return "";

  const normalized = value
    .replace(/[٫]/g, ".")
    .replace(/[۰-۹]/g, (digit) => {
      const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
      return String(persianDigits.indexOf(digit));
    })
    .replace(/[^0-9.]/g, "");

  if (!normalized.includes(".")) return normalized;

  const [wholePart, ...decimalParts] = normalized.split(".");
  const cleanDecimal = decimalParts.join("").replace(/\./g, "");
  return `${wholePart || "0"}.${cleanDecimal}`;
};

export const sanitizePriceInputValue = (value) => {
  if (value === "" || value === null || value === undefined) return "";

  const raw = String(value).trim().replace(/,/g, "");
  if (!/\d/.test(raw)) return "";

  if (!/^\d*\.?\d*$/.test(raw)) return "";

  if (raw.startsWith("0") && raw.length > 1 && !raw.startsWith("0.")) {
    return "";
  }

  const [wholePart = "", decimalPart = ""] = raw.split(".");
  const normalizedWhole = wholePart.replace(/^0+(?=\d)/, "") || "0";
  const normalizedDecimal = decimalPart.replace(/0+$/, "");

  if (!normalizedDecimal) return normalizedWhole;

  return `${normalizedWhole}.${normalizedDecimal}`;
};

export const formatNumber = (value, decimals = 2) => {
  const num = Number(value);

  if (Number.isNaN(num)) return "";

  return Number.isInteger(num) ? num : Number(num.toFixed(decimals));
};

export const calculateFee = (number = 100, percent = 5) => {
  const parseNumber = parseInt(number);
  return (parseNumber * percent) / 100 + parseNumber;
};

export const persianNumbers = [
  /۰/g,
  /۱/g,
  /۲/g,
  /۳/g,
  /۴/g,
  /۵/g,
  /۶/g,
  /۷/g,
  /۸/g,
  /۹/g,
],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  fixNumbers = function (str) {
    if (typeof str === "string") {
      for (var i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
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
}; export const convertToEnglish = (value) => {
  if (value == null) return "";

  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";

  return String(value).replace(/[۰-۹]/g, (d) => {
    return englishDigits[persianDigits.indexOf(d)];
  });
};
export const ToastError = (message) => {
  return toast.error(message, {
    style: {
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

  if (translationData.translation && typeof translationData.translation === "object") {
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

      return (
        !Number.isNaN(id) &&
        id >= minId &&
        id <= maxId
      );
    })
    .map(([key, value]) => ({
      unique_id: Number(key),
      translation: value,
    }));
};


export const isMobile =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;
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
