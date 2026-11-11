// Shared SVG pieces of the Commercial / Educational / Residential lottie pages (identical gray ornaments, arrows, center panel and their filters). Used only by those three pages.
export const FRAME = "translate(555.23 276.71)";

export const OUTER_PATH =
  "M-754.688-16302.916l-373.761-147.227v-266.554l35.403-29.813 692.401-.564 31.598 30.101v266.774l-385.641 147.283z";
export const INNER_PATH =
  "M-754.646-16310.96l378.1-144.403v-258.395l-27.097-25.812-686.662.558-30.644 25.805v257.959l366.303 144.287m-.084 16.089l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z";

export const Glow = ({ id, x, y, width, height, blur = 5, opacity, shadowOnly }) => (
  <filter id={id} x={x} y={y} width={width} height={height} filterUnits="userSpaceOnUse">
    <feOffset />
    <feGaussianBlur result="blur" stdDeviation={blur} />
    <feFlood floodOpacity={opacity} />
    <feComposite in2="blur" operator="in" />
    {!shadowOnly && <feComposite in="SourceGraphic" />}
  </filter>
);

export const InnerShadow = ({ id, x, y, width, height }) => (
  <filter id={id} x={x} y={y} width={width} height={height} filterUnits="userSpaceOnUse">
    <feOffset dy="3" />
    <feGaussianBlur result="blur" stdDeviation="1.5" />
    <feFlood result="color" />
    <feComposite in="SourceGraphic" in2="blur" operator="out" />
    <feComposite in="color" operator="in" />
    <feComposite in2="SourceGraphic" operator="in" />
  </filter>
);

const GLOWS = [
  { id: "Path_639", x: 500.563, y: 9.389, width: 78.09, height: 54.613, opacity: 0.702 },
  { id: "Path_638", x: 544.954, y: 9.389, width: 117.075, height: 54.328, opacity: 0.702 },
  { id: "Path_640", x: 466.273, y: 9.389, width: 55.041, height: 98.008, opacity: 0.702 },
  { id: "Path_639-2", x: 223.391, y: 9.389, width: 78.09, height: 54.613, opacity: 0.702 },
  { id: "Path_638-2", x: 140.015, y: 9.389, width: 117.075, height: 54.328, opacity: 0.702 },
  { id: "Path_640-2", x: 280.729, y: 9.389, width: 55.041, height: 98.008, opacity: 0.702 },
  { id: "Path_644", x: 305.77, y: 5.211, width: 191.998, height: 146 },
  { id: "Path_649", x: 27.434, y: 26.449, width: 67.466, height: 65.365, blur: 2.5, opacity: 0.8 },
  { id: "Path_650", x: 710.868, y: 26.037, width: 65.801, height: 63.621, blur: 2.5, opacity: 0.8 },
];

// Filters identical in all three pages
export const BuildingFilters = () =>
  GLOWS.map((glow) => <Glow key={glow.id} {...glow} />);

// Plain-arrow filters (Commercial + Residential only)
export const ArrowFilters = () => (
  <>
    <Glow id="Path_648" x={455.379} y={107.793} width={40.139} height={40.809} blur={2.5} opacity={0.8} />
    <Glow id="Path_657" x={308.379} y={107.793} width={40.139} height={40.809} blur={2.5} opacity={0.8} />
  </>
);

const arrow = { fill: "#c3c3c3", stroke: "#707070", strokeWidth: "0.5" };

// Plain-arrow shapes (Commercial + Residential only)
export const Arrows = () => (
  <>
    <g filter="url(#Path_648)" transform={FRAME}>
      <path {...arrow} d="M487.765 115.538h-8.56v10.457l-6.029 6.516h-10.05v8.336h14.888l9.751-11.332z" />
    </g>
    <g filter="url(#Path_657)" transform={FRAME}>
      <path {...arrow} d="M316.126 115.538h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332z" />
    </g>
  </>
);

export const CenterPanel = ({ filter, fill }) => (
  <g filter={`url(#${filter})`} transform={FRAME}>
    <path
      fill={fill}
      d="M-1135.949-16754.576v103.113l13.306 12.887h134.721l13.971-12.887v-103.113z"
      transform="translate(1456.72 16774.79)"
    />
  </g>
);

const gray = { fill: "#c3c3c3" };
const dot = { cx: "6.5", cy: "6.5", r: "6.5", fill: "#707070" };

// Gray top ornaments (right + left groups)
export const RoofDetails = () => (
  <>
    <g transform="translate(1036.505 301.102)">
      <g filter="url(#Path_639)" transform="translate(-481.27 -24.39)">
        <path {...gray} d="M-1219.545-16755.564v24.613h27.887l5.691-6.262h4.837l9.675-18.352z" transform="translate(1735.11 16779.95)" />
      </g>
      <g transform="translate(78.68)">
        <g filter="url(#Path_638)" transform="translate(-559.95 -24.39)">
          <path {...gray} d="M-1288.977-16755.564l-13.943 24.328h37.562l5.122-8.537h33.862l10.529-15.791z" transform="translate(1862.87 16779.95)" />
        </g>
        <circle {...dot} transform="translate(17.243 5.564)" />
      </g>
      <g>
        <g filter="url(#Path_640)" transform="translate(-481.27 -24.39)">
          <path {...gray} d="M-1137.166-16755.564v22.479l-12.521 11.953v22.2l-12.521 11.381v-68.008z" transform="translate(1643.48 16779.95)" />
        </g>
        <circle {...dot} transform="translate(5.923 5.564)" />
      </g>
    </g>
    <g transform="translate(710.247 301.102)">
      <g filter="url(#Path_639-2)" transform="translate(-155.02 -24.39)">
        <path {...gray} d="M-1171.455-16755.564v24.613h-27.887l-5.691-6.262h-4.837l-9.675-18.352z" transform="translate(1457.94 16779.95)" />
      </g>
      <g>
        <g filter="url(#Path_638-2)" transform="translate(-155.02 -24.39)">
          <path {...gray} d="M-1229.789-16755.564l13.943 24.328h-37.562l-5.122-8.537h-33.862l-10.529-15.791z" transform="translate(1457.94 16779.95)" />
        </g>
        <circle {...dot} transform="translate(56.832 5.564)" />
      </g>
      <g transform="translate(140.714)">
        <g filter="url(#Path_640-2)" transform="translate(-295.73 -24.39)">
          <path {...gray} d="M-1162.207-16755.564v22.479l12.521 11.953v22.2l12.521 11.381v-68.008z" transform="translate(1457.94 16779.95)" />
        </g>
        <circle {...dot} transform="translate(6.118 5.564)" />
      </g>
    </g>
  </>
);

// Corner pieces + frame outline
export const CornerDetails = () => (
  <>
    <g filter="url(#Path_649)" transform={FRAME}>
      <path {...arrow} d="M35.189 82.302l11.487.402.678-19.44L66.826 45.64l19.95.697.362-10.37-25.127-.878-25.995 23.507z" />
    </g>
    <g filter="url(#Path_650)" transform={FRAME}>
      <path {...arrow} d="M768.924 81.911H757.43V62.46l-18.845-18.293h-19.962V33.79h25.143l25.158 24.4z" />
    </g>
    <g fill="none" transform="translate(1706.181 17046.289)">
      <path d="M-1135.949-16445.035v-275.15l40.164-33.822 698.139-.568 36.1 34.391v275.15l-393.183 150.163z" />
      <path
        fill="#ecdeea"
        d="M-754.674-16305.598l383.127-146.322v-263.98l-30.097-28.672-690.488.56-33.817 28.479v263.69l371.275 146.245m-.056 10.726l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z"
      />
    </g>
  </>
);