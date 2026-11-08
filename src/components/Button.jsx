// دکمه اصلی در کل پروژه استفاده شده
import { useEffect, useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import styled, { css } from "styled-components";
import { getSize } from "../styles/sizes";

const ButtonElement = styled.button`
  position: relative;
  overflow: visible;

  border-radius: 10px;
  white-space: nowrap;

  background-color: ${(props) =>
    props.color
      ? props.disabled === "pending"
        ? props.color
        : props.disabled
          ? `${props.color}80`
          : props.color
      : props.grayTheme
        ? props.theme.colors.newColors.otherColors.garyBtn
        : props.theme.colors.primary};

  border: none;
  padding: ${(props) => (props.large ? "0 20px" : "10px 22px")};

  width: ${(props) =>
    props.fit
      ? "fit-content"
      : props.edit
        ? "125px"
        : props.large
          ? "fit-content"
          : props.full
            ? "100%"
            : "fit-content"};

  height: 45px;
  font-weight: 500;
  font-size: ${({ $size }) => getSize($size, "base")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  color: ${(props) =>
    props.disabled === "pending"
      ? props.theme.colors.newColors.primaryText
      : props.grayTheme
        ? props.theme.colors.newColors.otherColors.grayBtnText
        : props.theme.colors.newColors.primaryText};

  color: ${(props) => (props.textColor ? props.textColor : "")};

  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  opacity: ${(props) =>
    props.disabled === "pending" ? "0.6" : props.disabled ? "0.5" : "1"};

  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }

  @media (max-width: 840px) {
    width: ${(props) => (props.row ? "55px" : props.full && "100%")};
    height: ${(props) => props.row && "35px"};
    font-size: ${(props) => props.row && "14px"};
  }

  @media (min-width: 998px) {
    height: ${(props) => (props.large ? "40px" : "50px")};
  }

  ${({ $withIcon }) => $withIcon && iconVariant}
`;

const ExplosionLayer = styled.span`
  position: fixed;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 999999;
`;

const pillVariant = css`
  gap: 5px;
  padding: 3px 12px;
  border-radius: 60px;

  svg {
    font-size: 16px;
  }

  @media (min-width: 1024px) {
    padding: 10px 12px;
  }
`;

const iconVariant = css`
  flex-grow: ${({ $grow }) => ($grow ? 1 : 0)};
  height: auto;
  padding: 2px 20px 1px;
  border-radius: 7px;
  gap: 10px;

  ${({ $fill, color, grayTheme, theme }) =>
    !color &&
    !grayTheme &&
    css`
      background-color: ${$fill
        ? theme.colors.primary
        : theme.colors.newColors.otherColors.btnIconBg};

      color: ${$fill
        ? theme.colors.newColors.primaryText
        : theme.colors.newColors.otherColors.btnIconText};
    `}

  svg {
    display: flex;
    font-size: 18px;
  }

  @media (min-width: 998px) {
    height: auto;
  }

  @media (min-width: 1024px) {
    padding: 7px 20px 4px;
  }

  ${({ $pill }) => $pill && pillVariant}
`;

const Label = styled.span`
  font-size: ${({ $size }) => getSize($size, "base")};

  ${({ $pill }) =>
    $pill &&
    css`
      font-weight: 700;
    `}

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;

const Spinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

const renderIcon = (icon) =>
  typeof icon === "string" ? (
    <img src={icon} alt="" width={18} height={18} />
  ) : (
    icon
  );

const Button = ({
  label,
  pill,
  onclick,
  onClick,
  explode = false,
  row,
  color,
  edit,
  large,
  full,
  disabled,
  fit,
  textColor,
  grayTheme,
  style,
  icon,
  fill,
  grow,
  size = "default",

  // Confetti props
  explosionColor = "#C30000",
  explosionDuration = 3000,
  explosionParticleCount = 150,
}) => {
  const [explosion, setExplosion] = useState(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!explode || !buttonRef.current) return;

    const bounds = buttonRef.current.getBoundingClientRect();
    setExplosion({
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
      key: Date.now(),
    });
  }, [explode]);

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    } else {
      onclick?.(event);
    }
  };

  return (
    <ButtonElement
      ref={buttonRef}
      full={full}
      large={large}
      edit={edit}
      row={row}
      color={color}
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
      fit={fit}
      textColor={textColor}
      grayTheme={grayTheme}
      style={style}
      $size={size}
      $withIcon={Boolean(icon)}
      $fill={fill}
      $grow={grow}
      $pill={pill}
    >
      {icon && <span>{renderIcon(icon)}</span>}

      {icon ? (
        <Label $size={size} $pill={pill}>
          {label}
        </Label>
      ) : (
        label
      )}

      {explosion && explode && (
        <ExplosionLayer $x={explosion.x} $y={explosion.y}>
          <ConfettiExplosion
            key={explosion.key}
            zIndex={999999}
            particleCount={explosionParticleCount}
            duration={explosionDuration}
            colors={[explosionColor]}
            particleSize={5}
            force={0.8}
            width={400}
          />
        </ExplosionLayer>
      )}

      {disabled === "pending" && <Spinner />}
    </ButtonElement>
  );
};

export default Button;
