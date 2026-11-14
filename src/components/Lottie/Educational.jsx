// Educational building lottie page (blue frame). Route page shown after an educational build, redirects home after 5s.
import { BuildingFilters, CenterPanel, CornerDetails, FRAME, Glow, INNER_PATH, InnerShadow, OUTER_PATH, RoofDetails } from "./Components/BuildingParts";
import LottieLayout from "./Components/LottieLayout";

const ARROWS = [
  {
    id: "Path_648",
    a: "M-1106.545-16642.852h-8.56v10.457l-6.029 6.516h-10.05v8.336h14.888l9.751-11.332z",
    b: "M-1115.105-16642.852h8.56v13.977l-9.752 11.332h-14.887v-8.336h10.05l6.029-6.516v-10.457z",
    t1: "translate(1594.31 16758.39)",
    t2: "translate(2149.545 17035.107)",
  },
  {
    id: "Path_657",
    a: "M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332z",
    b: "M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332v-13.977z",
    t1: "translate(1447.31 16758.39)",
    t2: "translate(2002.545 17035.107)",
  },
];

function Arrow({ id, a, b, t1, t2 }) {
  return (
    <>
      <g filter={`url(#${id})`} transform={FRAME}>
        <g fill="url(#linear-gradient-4)" transform={t1}>
          <path d={a} />
          <path fill="#ecdeea" d={b} />
        </g>
      </g>
      <g fill="url(#linear-gradient-4)" transform={t2}>
        <path d={a} />
        <path d={b} />
      </g>
      <g filter={`url(#${id}-2)`} transform={FRAME}>
        <g fill="#fff" transform={t1}>
          <path d={a} />
          <path d={b} />
        </g>
      </g>
      <g fill="none" transform={t2}>
        <path d={a} />
        <path fill="#ecdeea" d={b} />
      </g>
    </>
  );
}

export default function Educational() {
  return (
    <LottieLayout title={1843}>
      <svg width="804.402" height="489.704" viewBox="0 0 804.402 489.704">
        <defs>
          <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1">
            <stop offset="0" stopColor="#b5d2ff" />
            <stop offset="1" stopColor="#07009c" />
          </linearGradient>
          <linearGradient id="linear-gradient-3" y1="1" y2="-0.408" xlinkHref="#linear-gradient" />
          <linearGradient id="linear-gradient-4" y1="1" y2="-0.103" xlinkHref="#linear-gradient" />
          <Glow id="Path_643" x={0} y={0} width={804.402} height={489.704} shadowOnly />
          <InnerShadow id="Path_643-2" x={0} y={0} width={804.402} height={489.704} />
          <InnerShadow id="Path_644-2" x={305.77} y={5.211} width={191.998} height={146} />
          <Glow id="Path_648" x={448.129} y={100.543} width={54.639} height={55.309} shadowOnly />
          <InnerShadow id="Path_648-2" x={448.129} y={100.543} width={54.639} height={55.309} />
          <Glow id="Path_657" x={301.129} y={100.543} width={54.639} height={55.309} shadowOnly />
          <InnerShadow id="Path_657-2" x={301.129} y={100.543} width={54.639} height={55.309} />
          <BuildingFilters />
        </defs>
        <g transform="translate(-555.231 -276.713)">
          <g filter="url(#Path_643)" transform={FRAME}>
            <g fill="url(#linear-gradient)" transform="translate(1150.95 16769.58)">
              <path d={OUTER_PATH} />
              <path fill="#ecdeea" d={INNER_PATH} />
            </g>
          </g>
          <g fill="url(#linear-gradient)" transform="translate(1706.181 17046.289)">
            <path d={OUTER_PATH} />
            <path d={INNER_PATH} />
          </g>
          <g filter="url(#Path_643-2)" transform={FRAME}>
            <g fill="#fff" transform="translate(1150.95 16769.58)">
              <path d={OUTER_PATH} />
              <path d={INNER_PATH} />
            </g>
          </g>
          <g fill="none" transform="translate(1706.181 17046.289)">
            <path d={OUTER_PATH} />
            <path fill="#ecdeea" d={INNER_PATH} />
          </g>
          <RoofDetails />
          <CenterPanel filter="Path_644" fill="url(#linear-gradient-3)" />
          <CenterPanel filter="Path_644-2" fill="#fff" />
          {ARROWS.map((arrow) => (
            <Arrow key={arrow.id} {...arrow} />
          ))}
          <CornerDetails />
        </g>
      </svg>
    </LottieLayout>
  );
}