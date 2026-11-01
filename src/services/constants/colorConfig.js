// تنها جایی که گیف‌های رنگ/موجودی ایمپورت می‌شوند؛ کلید هر آیتم همان کلید داخل walletData و مقدار asset تراکنش‌هاست

import effectGif from "../../assets/gif/limit-of-influence.gif";
import yellowGif from "../../assets/gif/yellow-color.gif";
import redGif from "../../assets/gif/red-color.gif";
import blueGif from "../../assets/gif/blue-color.gif";
import irrGif from "../../assets/gif/rial.gif";
import pscGif from "../../assets/gif/psc.gif";

export const COLOR_CONFIG = {
  effect: { gif: effectGif, labelKey: "723" },
  yellow: { gif: yellowGif, labelKey: "51" },
  red: { gif: redGif, labelKey: "50" },
  blue: { gif: blueGif, labelKey: "49" },
  irr: { gif: irrGif, labelKey: "48" },
  psc: { gif: pscGif, labelKey: "47" },
};

export const COLOR_KEYS = Object.keys(COLOR_CONFIG);