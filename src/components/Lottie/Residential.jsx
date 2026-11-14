// Residential building lottie page (gold frame). Route page shown after a residential build, redirects home after 5s.
import { Arrows, ArrowFilters, BuildingFilters, CenterPanel, CornerDetails, FRAME, Glow, INNER_PATH, OUTER_PATH, RoofDetails } from "./Components/BuildingParts";
import LottieLayout from "./Components/LottieLayout";

export default function Residential() {
  return (
    <LottieLayout title={1844}>
      <svg width="804.402" height="489.704" viewBox="0 0 804.402 489.704">
        <defs>
          <linearGradient id="linear-gradient" x1="0.492" x2="0.492" y1="0.014" y2="0.988">
            <stop offset="0" stopColor="#ae8625" />
            <stop offset="0.246" stopColor="#f7ef8a" />
            <stop offset="0.904" stopColor="#d2ac47" />
            <stop offset="1" stopColor="#edc967" />
          </linearGradient>
          <linearGradient id="linear-gradient-2" x1="0.492" x2="0.492" y1="0.014" y2="0.988">
            <stop offset="0" stopColor="#ae8625" />
            <stop offset="0.277" stopColor="#f7ef8a" />
            <stop offset="0.904" stopColor="#d2ac47" />
            <stop offset="1" stopColor="#edc967" />
          </linearGradient>
          <Glow id="Path_643" x={0} y={0} width={804.402} height={489.704} />
          <BuildingFilters />
          <ArrowFilters />
        </defs>
        <g transform="translate(-555.231 -276.713)">
          <g filter="url(#Path_643)" transform={FRAME}>
            <g fill="url(#linear-gradient)" transform="translate(1150.95 16769.58)">
              <path d={OUTER_PATH} />
              <path fill="#edc967" d={INNER_PATH} />
            </g>
          </g>
          <RoofDetails />
          <CenterPanel filter="Path_644" fill="url(#linear-gradient-2)" />
          <Arrows />
          <CornerDetails />
        </g>
      </svg>
    </LottieLayout>
  );
}