// رجیستری کانفیگ‌های GenericList؛ برای اضافه کردن بخش جدید یک فایل کانفیگ بساز و اینجا ثبتش کن

import { ticketsConfig } from "./ticketsConfig";
import { transactionsConfig } from "./transactionsConfig";
import { requestsConfig } from "./requestsConfig";
import { reportsConfig } from "./reportsConfig";

export const LIST_CONFIG = {
  tickets: ticketsConfig,
  transactions: transactionsConfig,
  requests: requestsConfig,
  reports: reportsConfig,
};