import Lottie from "lottie-react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import SvgAni from "../../assets/Json/AniBackSvg.json";
import LottieMessage from "./Components/LottieMessage";

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

export default function Educational() {
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
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="804.402"
        height="489.704"
        viewBox="0 0 804.402 489.704"
        style={{ zIndex: 1199 }}
      >
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0.5"
            x2="0.5"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stopColor="#b5d2ff"></stop>
            <stop offset="1" stopColor="#07009c"></stop>
          </linearGradient>
          <filter
            id="Path_643"
            width="804.402"
            height="489.704"
            x="0"
            y="0"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur" stdDeviation="5"></feGaussianBlur>
            <feFlood></feFlood>
            <feComposite in2="blur" operator="in"></feComposite>
          </filter>
          <filter
            id="Path_643-2"
            width="804.402"
            height="489.704"
            x="0"
            y="0"
            filterUnits="userSpaceOnUse"
          >
            <feOffset dy="3"></feOffset>
            <feGaussianBlur result="blur-2" stdDeviation="1.5"></feGaussianBlur>
            <feFlood result="color"></feFlood>
            <feComposite
              in="SourceGraphic"
              in2="blur-2"
              operator="out"
            ></feComposite>
            <feComposite in="color" operator="in"></feComposite>
            <feComposite in2="SourceGraphic" operator="in"></feComposite>
          </filter>
          <filter
            id="Path_639"
            width="78.09"
            height="54.613"
            x="500.563"
            y="9.389"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-3" stdDeviation="5"></feGaussianBlur>
            <feFlood floodOpacity="0.702"></feFlood>
            <feComposite in2="blur-3" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_638"
            width="117.075"
            height="54.328"
            x="544.954"
            y="9.389"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-4" stdDeviation="5"></feGaussianBlur>
            <feFlood floodOpacity="0.702"></feFlood>
            <feComposite in2="blur-4" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_640"
            width="55.041"
            height="98.008"
            x="466.273"
            y="9.389"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-5" stdDeviation="5"></feGaussianBlur>
            <feFlood floodOpacity="0.702"></feFlood>
            <feComposite in2="blur-5" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_639-2"
            width="78.09"
            height="54.613"
            x="223.391"
            y="9.389"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-6" stdDeviation="5"></feGaussianBlur>
            <feFlood floodOpacity="0.702"></feFlood>
            <feComposite in2="blur-6" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_638-2"
            width="117.075"
            height="54.328"
            x="140.015"
            y="9.389"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-7" stdDeviation="5"></feGaussianBlur>
            <feFlood floodOpacity="0.702"></feFlood>
            <feComposite in2="blur-7" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_640-2"
            width="55.041"
            height="98.008"
            x="280.729"
            y="9.389"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-8" stdDeviation="5"></feGaussianBlur>
            <feFlood floodOpacity="0.702"></feFlood>
            <feComposite in2="blur-8" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <linearGradient
            id="linear-gradient-3"
            y1="1"
            y2="-0.408"
            xlinkHref="#linear-gradient"
          ></linearGradient>
          <filter
            id="Path_644"
            width="191.998"
            height="146"
            x="305.77"
            y="5.211"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-9" stdDeviation="5"></feGaussianBlur>
            <feFlood></feFlood>
            <feComposite in2="blur-9" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_644-2"
            width="191.998"
            height="146"
            x="305.77"
            y="5.211"
            filterUnits="userSpaceOnUse"
          >
            <feOffset dy="3"></feOffset>
            <feGaussianBlur
              result="blur-10"
              stdDeviation="1.5"
            ></feGaussianBlur>
            <feFlood result="color-2"></feFlood>
            <feComposite
              in="SourceGraphic"
              in2="blur-10"
              operator="out"
            ></feComposite>
            <feComposite in="color-2" operator="in"></feComposite>
            <feComposite in2="SourceGraphic" operator="in"></feComposite>
          </filter>
          <linearGradient
            id="linear-gradient-4"
            y1="1"
            y2="-0.103"
            xlinkHref="#linear-gradient"
          ></linearGradient>
          <filter
            id="Path_648"
            width="54.639"
            height="55.309"
            x="448.129"
            y="100.543"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-11" stdDeviation="5"></feGaussianBlur>
            <feFlood></feFlood>
            <feComposite in2="blur-11" operator="in"></feComposite>
          </filter>
          <filter
            id="Path_648-2"
            width="54.639"
            height="55.309"
            x="448.129"
            y="100.543"
            filterUnits="userSpaceOnUse"
          >
            <feOffset dy="3"></feOffset>
            <feGaussianBlur
              result="blur-12"
              stdDeviation="1.5"
            ></feGaussianBlur>
            <feFlood result="color-3"></feFlood>
            <feComposite
              in="SourceGraphic"
              in2="blur-12"
              operator="out"
            ></feComposite>
            <feComposite in="color-3" operator="in"></feComposite>
            <feComposite in2="SourceGraphic" operator="in"></feComposite>
          </filter>
          <filter
            id="Path_657"
            width="54.639"
            height="55.309"
            x="301.129"
            y="100.543"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-13" stdDeviation="5"></feGaussianBlur>
            <feFlood></feFlood>
            <feComposite in2="blur-13" operator="in"></feComposite>
          </filter>
          <filter
            id="Path_657-2"
            width="54.639"
            height="55.309"
            x="301.129"
            y="100.543"
            filterUnits="userSpaceOnUse"
          >
            <feOffset dy="3"></feOffset>
            <feGaussianBlur
              result="blur-14"
              stdDeviation="1.5"
            ></feGaussianBlur>
            <feFlood result="color-4"></feFlood>
            <feComposite
              in="SourceGraphic"
              in2="blur-14"
              operator="out"
            ></feComposite>
            <feComposite in="color-4" operator="in"></feComposite>
            <feComposite in2="SourceGraphic" operator="in"></feComposite>
          </filter>
          <filter
            id="Path_651"
            width="228.12"
            height="92.566"
            x="284.708"
            y="333.023"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur result="blur-15" stdDeviation="5"></feGaussianBlur>
            <feFlood></feFlood>
            <feComposite in2="blur-15" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_652"
            width="34.538"
            height="35.055"
            x="474.435"
            y="385.973"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur
              result="blur-16"
              stdDeviation="2.5"
            ></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-16" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_653"
            width="34.538"
            height="35.055"
            x="474.435"
            y="337.037"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur
              result="blur-17"
              stdDeviation="2.5"
            ></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-17" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_654"
            width="34.538"
            height="35.055"
            x="290.127"
            y="337.037"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur
              result="blur-18"
              stdDeviation="2.5"
            ></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-18" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_655"
            width="34.538"
            height="35.055"
            x="290.127"
            y="385.592"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur
              result="blur-19"
              stdDeviation="2.5"
            ></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-19" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_649"
            width="67.466"
            height="65.365"
            x="27.434"
            y="26.449"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur
              result="blur-20"
              stdDeviation="2.5"
            ></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-20" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
          <filter
            id="Path_650"
            width="65.801"
            height="63.621"
            x="710.868"
            y="26.037"
            filterUnits="userSpaceOnUse"
          >
            <feOffset></feOffset>
            <feGaussianBlur
              result="blur-21"
              stdDeviation="2.5"
            ></feGaussianBlur>
            <feFlood floodOpacity="0.8"></feFlood>
            <feComposite in2="blur-21" operator="in"></feComposite>
            <feComposite in="SourceGraphic"></feComposite>
          </filter>
        </defs>
        <g data-name="Group 1066" transform="translate(-555.231 -276.713)">
          <g data-type="innerShadowGroup">
            <g filter="url(#Path_643)" transform="translate(555.23 276.71)">
              <g
                fill="url(#linear-gradient)"
                data-name="Path 643"
                transform="translate(1150.95 16769.58)"
              >
                <path d="M-754.688-16302.916l-373.761-147.227v-266.554l35.403-29.813 692.401-.564 31.598 30.101v266.774l-385.641 147.283z"></path>
                <path
                  fill="#ecdeea"
                  d="M-754.646-16310.96l378.1-144.403v-258.395l-27.097-25.812-686.662.558-30.644 25.805v257.959l366.303 144.287m-.084 16.089l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z"
                ></path>
              </g>
            </g>
            <g
              fill="url(#linear-gradient)"
              data-name="Path 643"
              transform="translate(1706.181 17046.289)"
            >
              <path d="M-754.688-16302.916l-373.761-147.227v-266.554l35.403-29.813 692.401-.564 31.598 30.101v266.774l-385.641 147.283z"></path>
              <path d="M-754.646-16310.96l378.1-144.403v-258.395l-27.097-25.812-686.662.558-30.644 25.805v257.959l366.303 144.287m-.084 16.089l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z"></path>
            </g>
            <g filter="url(#Path_643-2)" transform="translate(555.23 276.71)">
              <g fill="#fff" data-name="Path 643">
                <path
                  d="M-754.688-16302.916l-373.761-147.227v-266.554l35.403-29.813 692.401-.564 31.598 30.101v266.774l-385.641 147.283z"
                  transform="translate(1150.95 16769.58)"
                ></path>
                <path
                  d="M-754.646-16310.96l378.1-144.403v-258.395l-27.097-25.812-686.662.558-30.644 25.805v257.959l366.303 144.287m-.084 16.089l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z"
                  transform="translate(1150.95 16769.58)"
                ></path>
              </g>
            </g>
            <g fill="none" data-name="Path 643">
              <path
                d="M-754.688-16302.916l-373.761-147.227v-266.554l35.403-29.813 692.401-.564 31.598 30.101v266.774l-385.641 147.283z"
                transform="translate(1706.181 17046.289)"
              ></path>
              <path
                fill="#ecdeea"
                d="M-754.646-16310.96l378.1-144.403v-258.395l-27.097-25.812-686.662.558-30.644 25.805v257.959l366.303 144.287m-.084 16.089l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z"
                transform="translate(1706.181 17046.289)"
              ></path>
            </g>
          </g>
          <g data-name="Group 1034" transform="translate(1036.505 301.102)">
            <g filter="url(#Path_639)" transform="translate(-481.27 -24.39)">
              <path
                fill="#c3c3c3"
                d="M-1219.545-16755.564v24.613h27.887l5.691-6.262h4.837l9.675-18.352z"
                data-name="Path 639"
                transform="translate(1735.11 16779.95)"
              ></path>
            </g>
            <g data-name="Group 1032" transform="translate(78.68)">
              <g filter="url(#Path_638)" transform="translate(-559.95 -24.39)">
                <path
                  fill="#c3c3c3"
                  d="M-1288.977-16755.564l-13.943 24.328h37.562l5.122-8.537h33.862l10.529-15.791z"
                  data-name="Path 638"
                  transform="translate(1862.87 16779.95)"
                ></path>
              </g>
              <circle
                cx="6.5"
                cy="6.5"
                r="6.5"
                fill="#707070"
                data-name="Ellipse 176"
                transform="translate(17.243 5.564)"
              ></circle>
            </g>
            <g data-name="Group 1033">
              <g filter="url(#Path_640)" transform="translate(-481.27 -24.39)">
                <path
                  fill="#c3c3c3"
                  d="M-1137.166-16755.564v22.479l-12.521 11.953v22.2l-12.521 11.381v-68.008z"
                  data-name="Path 640"
                  transform="translate(1643.48 16779.95)"
                ></path>
              </g>
              <circle
                cx="6.5"
                cy="6.5"
                r="6.5"
                fill="#707070"
                data-name="Ellipse 177"
                transform="translate(5.923 5.564)"
              ></circle>
            </g>
          </g>
          <g data-name="Group 1038" transform="translate(710.247 301.102)">
            <g filter="url(#Path_639-2)" transform="translate(-155.02 -24.39)">
              <path
                fill="#c3c3c3"
                d="M-1171.455-16755.564v24.613h-27.887l-5.691-6.262h-4.837l-9.675-18.352z"
                data-name="Path 639"
                transform="translate(1457.94 16779.95)"
              ></path>
            </g>
            <g data-name="Group 1032">
              <g
                filter="url(#Path_638-2)"
                transform="translate(-155.02 -24.39)"
              >
                <path
                  fill="#c3c3c3"
                  d="M-1229.789-16755.564l13.943 24.328h-37.562l-5.122-8.537h-33.862l-10.529-15.791z"
                  data-name="Path 638"
                  transform="translate(1457.94 16779.95)"
                ></path>
              </g>
              <circle
                cx="6.5"
                cy="6.5"
                r="6.5"
                fill="#707070"
                data-name="Ellipse 176"
                transform="translate(56.832 5.564)"
              ></circle>
            </g>
            <g data-name="Group 1033" transform="translate(140.714)">
              <g
                filter="url(#Path_640-2)"
                transform="translate(-295.73 -24.39)"
              >
                <path
                  fill="#c3c3c3"
                  d="M-1162.207-16755.564v22.479l12.521 11.953v22.2l12.521 11.381v-68.008z"
                  data-name="Path 640"
                  transform="translate(1457.94 16779.95)"
                ></path>
              </g>
              <circle
                cx="6.5"
                cy="6.5"
                r="6.5"
                fill="#707070"
                data-name="Ellipse 177"
                transform="translate(6.118 5.564)"
              ></circle>
            </g>
          </g>
          <g data-name="Group 1041">
            <g data-type="innerShadowGroup">
              <g filter="url(#Path_644)" transform="translate(555.23 276.71)">
                <path
                  fill="url(#linear-gradient-3)"
                  d="M-1135.949-16754.576v103.113l13.306 12.887h134.721l13.971-12.887v-103.113z"
                  data-name="Path 644"
                  transform="translate(1456.72 16774.79)"
                ></path>
              </g>
              <g filter="url(#Path_644-2)" transform="translate(555.23 276.71)">
                <path
                  fill="#fff"
                  d="M-1135.949-16754.576v103.113l13.306 12.887h134.721l13.971-12.887v-103.113z"
                  data-name="Path 644"
                  transform="translate(1456.72 16774.79)"
                ></path>
              </g>
            </g>
            <g data-type="innerShadowGroup">
              <g filter="url(#Path_648)" transform="translate(555.23 276.71)">
                <g
                  fill="url(#linear-gradient-4)"
                  data-name="Path 648"
                  transform="translate(1594.31 16758.39)"
                >
                  <path d="M-1106.545-16642.852h-8.56v10.457l-6.029 6.516h-10.05v8.336h14.888l9.751-11.332z"></path>
                  <path
                    fill="#ecdeea"
                    d="M-1115.105-16642.852h8.56v13.977l-9.752 11.332h-14.887v-8.336h10.05l6.029-6.516v-10.457z"
                  ></path>
                </g>
              </g>
              <g
                fill="url(#linear-gradient-4)"
                data-name="Path 648"
                transform="translate(2149.545 17035.107)"
              >
                <path d="M-1106.545-16642.852h-8.56v10.457l-6.029 6.516h-10.05v8.336h14.888l9.751-11.332z"></path>
                <path d="M-1115.105-16642.852h8.56v13.977l-9.752 11.332h-14.887v-8.336h10.05l6.029-6.516v-10.457z"></path>
              </g>
              <g filter="url(#Path_648-2)" transform="translate(555.23 276.71)">
                <g fill="#fff" data-name="Path 648">
                  <path
                    d="M-1106.545-16642.852h-8.56v10.457l-6.029 6.516h-10.05v8.336h14.888l9.751-11.332z"
                    transform="translate(1594.31 16758.39)"
                  ></path>
                  <path
                    d="M-1115.105-16642.852h8.56v13.977l-9.752 11.332h-14.887v-8.336h10.05l6.029-6.516v-10.457z"
                    transform="translate(1594.31 16758.39)"
                  ></path>
                </g>
              </g>
              <g fill="none" data-name="Path 648">
                <path
                  d="M-1106.545-16642.852h-8.56v10.457l-6.029 6.516h-10.05v8.336h14.888l9.751-11.332z"
                  transform="translate(2149.545 17035.107)"
                ></path>
                <path
                  fill="#ecdeea"
                  d="M-1115.105-16642.852h8.56v13.977l-9.752 11.332h-14.887v-8.336h10.05l6.029-6.516v-10.457z"
                  transform="translate(2149.545 17035.107)"
                ></path>
              </g>
            </g>
            <g data-type="innerShadowGroup">
              <g filter="url(#Path_657)" transform="translate(555.23 276.71)">
                <g
                  fill="url(#linear-gradient-4)"
                  data-name="Path 657"
                  transform="translate(1447.31 16758.39)"
                >
                  <path d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332z"></path>
                  <path
                    fill="#ecdeea"
                    d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332v-13.977z"
                  ></path>
                </g>
              </g>
              <g
                fill="url(#linear-gradient-4)"
                data-name="Path 657"
                transform="translate(2002.545 17035.107)"
              >
                <path d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332z"></path>
                <path d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332v-13.977z"></path>
              </g>
              <g filter="url(#Path_657-2)" transform="translate(555.23 276.71)">
                <g fill="#fff" data-name="Path 657">
                  <path
                    d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332z"
                    transform="translate(1447.31 16758.39)"
                  ></path>
                  <path
                    d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332v-13.977z"
                    transform="translate(1447.31 16758.39)"
                  ></path>
                </g>
              </g>
              <g fill="none" data-name="Path 657">
                <path
                  d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332z"
                  transform="translate(2002.545 17035.107)"
                ></path>
                <path
                  fill="#ecdeea"
                  d="M-1131.184-16642.852h8.56v10.457l6.029 6.516h10.05v8.336h-14.888l-9.751-11.332v-13.977z"
                  transform="translate(2002.545 17035.107)"
                ></path>
              </g>
            </g>
          </g>

          <g filter="url(#Path_649)" transform="translate(555.23 276.71)">
            <path
              fill="#c3c3c3"
              stroke="#707070"
              strokeWidth="0.5"
              d="M35.189 82.302l11.487.402.678-19.44L66.826 45.64l19.95.697.362-10.37-25.127-.878-25.995 23.507z"
              data-name="Path 649"
            ></path>
          </g>
          <g filter="url(#Path_650)" transform="translate(555.23 276.71)">
            <path
              fill="#c3c3c3"
              stroke="#707070"
              strokeWidth="0.5"
              d="M768.924 81.911H757.43V62.46l-18.845-18.293h-19.962V33.79h25.143l25.158 24.4z"
              data-name="Path 650"
            ></path>
          </g>
          <g fill="none" data-name="Path 656">
            <path
              d="M-1135.949-16445.035v-275.15l40.164-33.822 698.139-.568 36.1 34.391v275.15l-393.183 150.163z"
              transform="translate(1706.181 17046.289)"
            ></path>
            <path
              fill="#ecdeea"
              d="M-754.674-16305.598l383.127-146.322v-263.98l-30.097-28.672-690.488.56-33.817 28.479v263.69l371.275 146.245m-.056 10.726l-381.22-150.163v-275.15l40.165-33.823 698.138-.568 36.1 34.39v275.15l-393.183 150.164z"
              transform="translate(1706.181 17046.289)"
            ></path>
          </g>
        </g>
      </svg>
      <LottieMessage title="1843" />
    </Container>
  );
}
