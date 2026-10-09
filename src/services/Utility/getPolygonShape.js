// تنظیمات پیش‌فرض: زمین‌های «پهن» (x ≤ 50) و «بلند/باریک» (x > 50)
const DEFAULT_CONFIG = {
  wide: { width: 100, height: 100, viewBox: "-30 -110 150 120" },
  tall: { width: 40, height: 140, viewBox: "-15 -85 150 100" },
};

/**
 * مختصات زمین را به نقاط قابل رسم در SVG تبدیل می‌کند.
 *
 * @param {Array<{x:number,y:number}>} coordinates
 * @param {object} [config] برای تغییر ابعاد در جاهای دیگر (مثلاً { wide: {...}, tall: {...} })
 * @returns {{ points: string, viewBox: string, hasXGreaterThan50: boolean }}
 */
export const getPolygonShape = (coordinates, config = {}) => {
  const wide = { ...DEFAULT_CONFIG.wide, ...config.wide };
  const tall = { ...DEFAULT_CONFIG.tall, ...config.tall };

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { points: "", viewBox: wide.viewBox, hasXGreaterThan50: false };
  }

  const xs = coordinates.map((c) => c.x);
  const ys = coordinates.map((c) => c.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const hasXGreaterThan50 = xs.some((x) => x > 50);
  const { width, height, viewBox } = hasXGreaterThan50 ? tall : wide;

  // جلوگیری از تقسیم بر صفر وقتی همه نقاط روی یک خط هستند
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const points = coordinates
    .map((c) => {
      const nx = ((c.x - minX) / rangeX) * width;
      const ny = ((c.y - minY) / rangeY) * height;
      return `${nx},${ny}`;
    })
    .join(" ");

  return { points, viewBox, hasXGreaterThan50 };
};