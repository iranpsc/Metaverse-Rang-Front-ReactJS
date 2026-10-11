const DEFAULT_CONFIG = {
  size: 100, // اندازهٔ مربع viewBox
  padding: 6, // حاشیه دور شکل
};

export const getPolygonShape = (coordinates, config = {}) => {
  const { size, padding } = { ...DEFAULT_CONFIG, ...config };
  const viewBox = `0 0 ${size} ${size}`;

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { points: "", viewBox, hasXGreaterThan50: false };
  }

  // تبدیل رشته به عدد
  const pts = coordinates
    .map((c) => ({ x: Number(c.x), y: Number(c.y) }))
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));

  if (!pts.length) return { points: "", viewBox, hasXGreaterThan50: false };

  // اصلاح فشردگی طول جغرافیایی نسبت به عرض جغرافیایی
  const meanLat = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const kx = Math.cos((meanLat * Math.PI) / 180);

  const xs = pts.map((p) => p.x * kx);
  const ys = pts.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const rangeX = maxX - minX || 1e-9;
  const rangeY = maxY - minY || 1e-9;

  // یک مقیاس برای هر دو محور تا نسبت واقعی حفظ شود
  const inner = size - padding * 2;
  const scale = inner / Math.max(rangeX, rangeY);

  // وسط‌چین
  const offsetX = padding + (inner - rangeX * scale) / 2;
  const offsetY = padding + (inner - rangeY * scale) / 2;

  const points = pts
    .map((p, i) => {
      const nx = offsetX + (xs[i] - minX) * scale;
      const ny = offsetY + (maxY - p.y) * scale; // شمال بالا
      return `${nx.toFixed(2)},${ny.toFixed(2)}`;
    })
    .join(" ");

  return {
    points,
    viewBox,
    hasXGreaterThan50: pts.some((p) => p.x > 50),
  };
};