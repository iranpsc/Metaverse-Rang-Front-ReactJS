import { getTranslation } from "./Utility";

const t = (id) => getTranslation(id);

const DEFAULT_TITLE = "905";
const DEFAULT_PAGE = "148";

const getSegments = (path = "") => {
  const pathname = path.split("?")[0].split("#")[0];
  return pathname.split("/").filter(Boolean);
};

const isId = (seg) => /^\d+$/.test(seg);
const isDynamicSegment = (seg) => /^packet-/.test(seg);

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
};
const getLastTextSegment = (segments) => {
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];

    if (isId(seg)) continue;
    if (isDynamicSegment(seg)) continue;

    return {
      value: seg,
      index: i,
    };
  }

  return null;
};

const getPrevTextSegment = (segments, index) => {
  for (let i = index - 1; i >= 0; i--) {
    const seg = segments[i];

    if (isId(seg)) continue;
    if (isDynamicSegment(seg)) continue;

    return seg;
  }

  return null;
};

const getPageKey = (segments) =>
  segments.find((seg) => seg !== "metaverse" && !isId(seg));

const getModalHeaderFromPrevious = (pathname = "") => {
  const segments = getSegments(pathname);

  if (!segments.length) {
    return {
      title: t(DEFAULT_TITLE),
      page: t(DEFAULT_PAGE),
    };
  }

  const lastObj = getLastTextSegment(segments);

  if (!lastObj) {
    return {
      title: t(DEFAULT_TITLE),
      page: t(DEFAULT_PAGE),
    };
  }

  const { value: last, index } = lastObj;

  const prev = getPrevTextSegment(segments, index);

  const titleKey = prev ? `${prev}-${last}` : last;

  const titleId =
    titleTranslations[titleKey] ??
    titleTranslations[last] ??
    DEFAULT_TITLE;

  const pageKey = getPageKey(segments);

  const pageId =
    pageTranslations[pageKey] ??
    DEFAULT_PAGE;

  return {
    title: t(titleId),
    page: t(pageId),
  };
};

export default getModalHeaderFromPrevious;