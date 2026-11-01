import Lottie from "lottie-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import SvgAni from "../../assets/Json/AniBackSvg.json";
import { getTranslation } from "../../services/Utility";
const Container = styled.div`
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 100000000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  fill-opacity: 1;
  background-color: #7777779e;
`;

const TextContainer = styled.div`
  z-index: 1200;
  position: absolute;
  display: flex;
  flex-direction: column;
  margin-right: 30px;
  align-items: center;
  justify-content: center;
`;

const LottieTitle = styled.span`
  color: white;
  font-size: 2rem;
`;

const LottieDescription = styled.span`
  color: white;
  font-size: 1.2rem;
`;

export default function SignupLottie() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const TimeOut = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(TimeOut);
  }, [navigate]);

  return (
    <Container>
      <Lottie
        animationData={SvgAni}
        style={{
          position: "absolute",
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="808.768"
        height="411.59"
        viewBox="0 0 808.768 411.59"
        style={{ zIndex: 1199 }}
      >
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0.008"
            x2="2.191"
            y1="0.043"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stopColor="#872592"></stop>
            <stop offset="0.045" stopColor="#9338b4"></stop>
            <stop offset="0.226" stopColor="#f6adff"></stop>
            <stop offset="0.259" stopColor="#ed97f5"></stop>
            <stop offset="0.287" stopColor="#de73e5"></stop>
            <stop offset="0.433" stopColor="#e655e1"></stop>
            <stop offset="1" stopColor="#701776"></stop>
          </linearGradient>
          <filter
            id="Polygon_32"
            width="341"
            height="118"
            x="197.681"
            y="293.59"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodColor="#707070"></feFlood>
            <feComposite in2="blur" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Polygon_35"
            width="118"
            height="203.545"
            x="690.768"
            y="103.772"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-2" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodColor="#707070"></feFlood>
            <feComposite in2="blur-2" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Polygon_34"
            width="341"
            height="118"
            x="190.767"
            y="0"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-3" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodColor="#707070"></feFlood>
            <feComposite in2="blur-3" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_666"
            width="82.703"
            height="145.357"
            x="2.01"
            y="132.821"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-4" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodColor="#707070"></feFlood>
            <feComposite in2="blur-4" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <linearGradient
            id="linear-gradient-5"
            x1="0.008"
            x2="1"
            y1="0.043"
            y2="0.956"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stopColor="#872592"></stop>
            <stop offset="0.043" stopColor="#8635a3"></stop>
            <stop offset="0.137" stopColor="#e37bef"></stop>
            <stop offset="0.241" stopColor="#de73e5"></stop>
            <stop offset="0.447" stopColor="#e69ceb"></stop>
            <stop offset="0.501" stopColor="#d56cdd"></stop>
            <stop offset="0.666" stopColor="#cd61d1"></stop>
            <stop offset="0.905" stopColor="#ef7be3"></stop>
            <stop offset="1" stopColor="#701776"></stop>
          </linearGradient>
          <filter
            id="Path_664"
            width="695.174"
            height="185"
            x="20.595"
            y="113.045"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-5" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodColor="#707070"></feFlood>
            <feComposite in2="blur-5" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_653"
            width="47.954"
            height="48.834"
            x="675.653"
            y="106.416"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-6" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-6" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_667"
            width="47.954"
            height="48.834"
            x="674.653"
            y="255.082"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-7" stdDeviation="2.5"></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-7" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
        </defs>
        <g data-name="Group 1060" transform="translate(-573.596 -334.5)">
          <g filter="url(#Polygon_32)" transform="translate(573.6 334.5)">
            <g
              fill="url(#linear-gradient)"
              data-name="Polygon 32"
              transform="rotate(-180 265.59 202.045)"
            >
              <path d="M298.364 99H27.636c-2.79 0-3.646-2.21-3.842-2.888-.196-.677-.653-3.003 1.705-4.493L160.863 6.082a3.995 3.995 0 014.274 0L300.5 91.619c2.358 1.49 1.901 3.816 1.705 4.493-.196.678-1.053 2.888-3.842 2.888z"></path>
              <path
                fill="#cdcdcd"
                d="M163 1.463v8L27.636 95h270.728L163 9.463v-8m0 0c1.484 0 2.968.413 4.273 1.237l135.364 85.537c6.777 4.283 3.744 14.763-4.273 14.763H27.636c-8.017 0-11.05-10.48-4.273-14.763L158.727 2.7A7.993 7.993 0 01163 1.463z"
              ></path>
            </g>
          </g>
          <g filter="url(#Polygon_35)" transform="translate(573.6 334.5)">
            <g
              fill="url(#linear-gradient)"
              data-name="Polygon 35"
              transform="rotate(90 345 456.27)"
            >
              <path d="M170.378 99H18.168c-.849 0-1.608-.225-2.256-.67a4.053 4.053 0 01-1.406-1.718 4.053 4.053 0 01-.317-2.197c.109-.778.455-1.49 1.027-2.116L91.322 9.15a3.956 3.956 0 012.95-1.3c1.136 0 2.184.461 2.951 1.3l76.105 83.15c.573.626.919 1.338 1.028 2.116a4.053 4.053 0 01-.317 2.197c-.311.706-.797 1.3-1.406 1.718-.649.445-1.407.67-2.255.67z"></path>
              <path
                fill="#cdcdcd"
                d="M94.272 11.849L18.167 95h152.21L94.284 11.85l-.01-.001m0-8a7.97 7.97 0 015.9 2.599l76.106 83.15c4.698 5.133 1.057 13.402-5.901 13.402H18.168c-6.959 0-10.6-8.269-5.902-13.401L88.37 6.448a7.97 7.97 0 015.901-2.599z"
              ></path>
            </g>
          </g>
          <g filter="url(#Polygon_34)" transform="translate(573.6 334.5)">
            <g
              fill="url(#linear-gradient)"
              data-name="Polygon 34"
              transform="translate(198.27 7.5)"
            >
              <path d="M298.364 99H27.636c-2.79 0-3.646-2.21-3.842-2.888-.196-.677-.653-3.003 1.705-4.493L160.863 6.082a3.995 3.995 0 014.274 0L300.5 91.619c2.358 1.49 1.901 3.816 1.705 4.493-.196.678-1.053 2.888-3.842 2.888z"></path>
              <path
                fill="#cdcdcd"
                d="M163 1.463v8L27.636 95h270.728L163 9.463v-8m0 0c1.484 0 2.968.413 4.273 1.237l135.364 85.537c6.777 4.283 3.744 14.763-4.273 14.763H27.636c-8.017 0-11.05-10.48-4.273-14.763L158.727 2.7A7.993 7.993 0 01163 1.463z"
              ></path>
            </g>
          </g>
          <g
            fill="#e1e1e1"
            stroke="#707070"
            strokeWidth="1"
            data-name="Rectangle 1161"
            opacity="0.92"
            transform="translate(573.596 436.5)"
          >
            <rect width="722.535" height="207.089" stroke="none" rx="20"></rect>
            <rect
              width="721.535"
              height="206.089"
              x="0.5"
              y="0.5"
              fill="none"
              rx="19.5"
            ></rect>
          </g>
          <g data-name="Group 1059">
            <g filter="url(#Path_666)" transform="translate(573.6 334.5)">
              <path
                fill="url(#linear-gradient)"
                d="M72.567 4.854a8 8 0 0110.733 0l57.162 51.7A8 8 0 01135.1 70.49H20.771A8 8 0 0115.4 56.557z"
                data-name="Path 666"
                transform="rotate(90 -23.785 103.785)"
              ></path>
            </g>
            <g filter="url(#Path_664)" transform="translate(573.6 334.5)">
              <g
                fill="url(#linear-gradient-5)"
                data-name="Path 664"
                transform="translate(28.27 120.54)"
              >
                <path d="M668 169.5H12c-3.704 0-7.491-1.789-9.65-4.558-1.189-1.526-2.431-4.044-1.593-7.375.268-1.064 2.247-4.345 10.153-13.933 5.113-6.2 12.11-14.322 20.8-24.144 14.8-16.725 29.57-32.79 29.717-32.95l.29-.315-.267-.335c-.515-.647-51.549-64.829-58.751-73.208C.46 10.079-.2 7.725.737 5.687 2.227 2.44 7.634.5 12 .5h656c3.072 0 5.96 1.196 8.132 3.368A11.425 11.425 0 01679.5 12v146c0 3.072-1.196 5.96-3.368 8.132A11.425 11.425 0 01668 169.5z"></path>
                <path
                  fill="#929292"
                  d="M12 1c-2.115 0-4.467.478-6.452 1.312-2.167.91-3.714 2.183-4.357 3.584-.847 1.845-.212 4.018 1.887 6.46 7.209 8.386 58.249 72.575 58.763 73.223l.533.67-.58.63c-.147.16-14.914 16.22-29.709 32.943-8.686 9.817-15.68 17.935-20.789 24.13-8.26 10.018-9.845 12.907-10.054 13.737-.789 3.135.382 5.508 1.503 6.946C4.812 167.287 8.445 169 12 169h656c2.938 0 5.7-1.144 7.778-3.222A10.928 10.928 0 00679 158V12c0-2.938-1.144-5.7-3.222-7.778A10.928 10.928 0 00668 1H12m0-1h656c6.627 0 12 5.373 12 12v146c0 6.627-5.373 12-12 12H12c-6.628 0-13.516-5.45-11.728-12.555C2.06 150.341 61.06 86.201 61.06 86.201S9.599 21.477 2.319 13.008C-4.96 4.539 5.372 0 12 0z"
                ></path>
              </g>
            </g>
            <g filter="url(#Path_653)" transform="translate(573.6 334.5)">
              <path
                fill="#c3c3c3"
                stroke="#707070"
                strokeWidth="0.5"
                d="M715.86 147.502h-11.276v-13.773l-7.941-8.58h-13.238v-10.98h19.61l12.844 14.924z"
                data-name="Path 653"
              ></path>
            </g>
            <g filter="url(#Path_667)" transform="translate(573.6 334.5)">
              <path
                fill="#c3c3c3"
                stroke="#707070"
                strokeWidth="0.5"
                d="M714.86 262.83h-11.276v13.773l-7.941 8.58h-13.238v10.98h19.61l12.844-14.924z"
                data-name="Path 667"
              ></path>
            </g>
          </g>
        </g>
      </svg>
      <TextContainer>
        <LottieTitle>{getTranslation(1845)}</LottieTitle>
        <LottieDescription>{getTranslation(1846)} </LottieDescription>
      </TextContainer>
    </Container>
  );
}
