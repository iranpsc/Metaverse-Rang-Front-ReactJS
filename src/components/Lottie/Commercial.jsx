// Commercial building lottie page (red frame). Route page shown after a commercial build, redirects home after 5s.
import { Arrows, ArrowFilters, BuildingFilters, CenterPanel, CornerDetails, FRAME, Glow, InnerShadow, RoofDetails } from "./Components/BuildingParts";
import LottieLayout from "./Components/LottieLayout";

const OUTER = "M-754.674-16305.598l-371.275-146.246v-263.69l33.817-28.478 690.488-.56 30.097 28.672v263.98l-383.127 146.322z";
const INNER = "M-754.618-16316.323l373.071-142.484v-252.808l-24.094-22.955-682.838.556-27.47 23.133v252.229l361.33 142.329m-.111 21.45l-381.22-150.162v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z";

export default function Commercial() {
  return (
    <LottieLayout title={1842}>
      <svg width="804.402" height="489.704" viewBox="0 0 804.402 489.704">
        <defs>
          <linearGradient id="linear-gradient" x1="0.5" x2="0.492" y1="0.011" y2="1">
            <stop offset="0" stopColor="#ff3593" />
            <stop offset="1" stopColor="#b70000" />
          </linearGradient>
          <linearGradient id="linear-gradient-3" x2="0.5" y1="1" y2="0" xlinkHref="#linear-gradient" />
          <Glow id="Path_643" x={0} y={0} width={804.402} height={489.704} shadowOnly />
          <InnerShadow id="Path_643-2" x={0} y={0} width={804.402} height={489.704} />
          <InnerShadow id="Path_644-2" x={305.77} y={5.211} width={191.998} height={146} />
          <BuildingFilters />
          <ArrowFilters />
        </defs>
        <g transform="translate(-555.231 -276.713)">
          <g filter="url(#Path_643)" transform={FRAME}>
            <g fill="url(#linear-gradient)" transform="translate(1150.95 16769.58)">
              <path d={OUTER} />
              <path fill="#b70000" d={INNER} />
            </g>
          </g>
          <g fill="url(#linear-gradient)" transform="translate(1706.181 17046.289)">
            <path d={OUTER} />
            <path d={INNER} />
          </g>
          <g filter="url(#Path_643-2)" transform={FRAME}>
            <g fill="#fff" transform="translate(1150.95 16769.58)">
              <path d={OUTER} />
              <path d={INNER} />
            </g>
          </g>
          <g fill="none" transform="translate(1706.181 17046.289)">
            <path d={OUTER} />
            <path fill="#b70000" d={INNER} />
          </g>
          <RoofDetails />
          <CenterPanel filter="Path_644" fill="url(#linear-gradient-3)" />
          <CenterPanel filter="Path_644-2" fill="#fff" />
          <Arrows />
          <CornerDetails />
        </g>
      </svg>
    </LottieLayout>
  );
}