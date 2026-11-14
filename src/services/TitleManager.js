// تعیین عنوان و نام صفحه برای هدر مدال‌ها از روی آدرس صفحه‌ی قبل؛ در Header مدال و ErrorReportTab استفاده می‌شود و برای مسیر ناشناخته مقدار پیش‌فرض برمی‌گرداند.
import { getTranslation } from "./Utility";

const DEFAULT_TITLE = "905";
const DEFAULT_PAGE = "148";

const pageTranslations = {
  Documents: "1315",
  profile: "243",
  settings: "642",
  store: "30",
  dynasty: "234",
  search: "232",
  verification: "867",
  feature: "345",
};

const titleTranslations = {
  "list-sent": "1336",
  "list-received": "1335",
  "property-houses": "58",

  "dynasty-establish": "807",
  "dynasty-estate": "819",
  "dynasty-send": "113",
  "dynasty-recieved": "114",

  "suggestion-sent": "765",
  "suggestion-recieved": "764",

  "feature-buy": "353",
  "buy-price": "524",
  "buy-suggest": "527",
  "sell-PriceDefine": "519",
  "sell-lowest": "517",

  // fallback (no subTab)
  write: "241",
  total: "62",
  notes: "1317",
  transactions: "61",
  public: "639",
  account: "640",
  security: "641",
  about: "95",
  confirmation: "31",
  citizen: "470",
  property: "471",
  profit: "27",
  challenges: "231",
  identity: "867",
  bank: "868",
  tools: "109",
  currency: "110",
  notifications: "238",
  connectWallet: "1760",
  following: "55",
  followers: "38",
  members: "112",
  send: "1386",
  list: "22",
  info: "516",
  enter: "354",
  physic: "356",
  participation: "357",
  building: "355",
  history: "1780",
};

// فقط کلیدهای خود آبجکت؛ جلوی مقدارهایی مثل constructor یا __proto__ که از آدرس می‌آیند را می‌گیرد
const lookup = (map, key) => (Object.hasOwn(map, key) ? map[key] : undefined);

const isId = (seg) => /^\d+$/.test(seg);
const isDynamicSegment = (seg) => /^packet-/.test(seg);

const getSegments = (path) =>
  (path ?? "")
    .replace(/^https?:\/\/[^/]+/, "")
    .split(/[?#]/)[0]
    .split("/")
    .filter(Boolean);

const getModalHeaderFromPrevious = (path = "") => {
  const segments = getSegments(path);

  // بخش‌های متنی بدون آیدی و بخش‌های پویا؛ آخری عنوان است و ماقبلش پیشوند کلید
  const textSegments = segments.filter(
    (seg) => !isId(seg) && !isDynamicSegment(seg),
  );
  const last = textSegments.at(-1);
  const prev = textSegments.at(-2);

  const titleId =
    lookup(titleTranslations, prev ? `${prev}-${last}` : last) ??
    lookup(titleTranslations, last) ??
    DEFAULT_TITLE;

  const pageKey = segments.find((seg) => seg !== "metaverse" && !isId(seg));
  const pageId = lookup(pageTranslations, pageKey) ?? DEFAULT_PAGE;

  return {
    title: getTranslation(titleId),
    page: getTranslation(pageId),
  };
};

export default getModalHeaderFromPrevious;
