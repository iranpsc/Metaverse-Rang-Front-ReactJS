"use client";

import styled from "styled-components";
import  LightSvg  from "../../assets/svg/light.svg?react";
import  DarkSvg  from "../../assets/svg/dark.svg?react";
import { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";

const Light = styled(LightSvg)`
  width: 18.364px;
  height: 18.364px;
  fill: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Dark = styled(DarkSvg)`
  width: 18.364px;
  height: 18.364px;
  stroke: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Wrapper = styled.div`
  display: flex;
  width: ${(props) => (props.isClosed ? "70px" : "90%")};
  transition: all 0.3s ease;
`;

const ThemeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 27px;
  height: 27px;
  cursor: pointer;
  border-radius: 50%;
  background-color: ${(props) =>
    props.themeMode === "dark" ? "#000" : "#e9eef8"};

  @media (max-width: 767px) {
    width: 25px;
    height: 25px;
  }

  @media (min-width: 1280px) {
    width: 29px;
    height: 29px;
  }
`;

// ===============================
//        COMPONENT
// ===============================

export default function ThemeMenuModule({ isClosed }) {
  const { theme, toggleTheme } = useTheme();
  const [isActive, setIsActive] = useState(theme === "dark");

  const handleClick = () => {
    setIsActive(!isActive);
    toggleTheme();
  };

  return (
    <Wrapper isClosed={isClosed}>
      <ThemeButton themeMode={theme} onClick={handleClick}>
        {isActive ? <Dark /> : <Light />}
      </ThemeButton>
    </Wrapper>
  );
}
