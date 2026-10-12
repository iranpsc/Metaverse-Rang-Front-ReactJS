import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import down from "../../../../../assets/images/downcitizen.png";
import avatar from "../../../../../assets/images/defulte-profile.png";
import lockGem from "../../../../../assets/images/Frame1000003193.png";
import {
  getTranslation,
  metarangUrlCitizen,
} from "../../../../../services/Utility";
import { slugLabels } from "../../../../../services/constants/UserType";
import ToolTip from "../../../../../components/Tooltip";

const TOTAL_GEMS = 13;
const FOUNDER_CODES = ["hm-2000001", "hm-2000002"];

/* ------------------------------ Styles ------------------------------ */

const marquee = keyframes`
  0%, 15% { text-indent: 0; }
  85%, 100% { text-indent: calc(-1 * var(--shift)); }
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 281px;
  min-width: 164px;
  box-sizing: border-box;
  padding: 20px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.primary : "transparent")};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.menuBg};
  box-shadow: ${({ $selected }) =>
    $selected
      ? "0 0 35px -12px rgba(255, 199, 0, 0.9)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"};
  transform: ${({ $selected }) => ($selected ? "scale(1.02)" : "none")};
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  /* hover فقط روی ماوس، نه لمسی */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.02);
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 35px -12px ${({ theme }) => theme.colors.primary};
    }
  }

  /* بازخورد لمس */
  @media (hover: none) {
    &:active {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }


  @media (max-width: 1000px) {
    max-width: 250px;
    min-width: 140px;
    padding: 12px 6px 14px;
    gap: 8px;
    border-radius: 14px;
  }

  @media (max-width: 800px) {
    min-width: 0;
    padding: 10px 4px 12px;
  }
`;

const Avatar = styled.figure`
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  margin: 40px 0 0;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }


  @media (max-width: 1000px) {
    width: 80px;
    height: 80px;
    margin-top: 26px;
  }

  @media (max-width: 800px) {
    width: 72px;
    height: 72px;
    margin-top: 24px;
  }
`;

const NameWrap = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Name = styled.p`
  width: 100%;
  margin: 8px 0 0;
  padding: 0 12px;
  box-sizing: border-box;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.newColors.shades.title};


  @media (max-width: 1000px) {
    margin-top: 4px;
    font-size: 15px;
    padding: 0 6px;
  }

  @media (max-width: 800px) {
    font-size: 14px;
  }

  @media (hover: hover) and (pointer: fine) {
    ${({ $truncated }) =>
    $truncated &&
    css`
        &:hover {
          text-overflow: clip;
          animation: ${marquee} 4s linear infinite alternate;
        }
      `}
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      animation: none;
    }
  }
`;

const FounderBadge = styled.span`
  margin: -2px 4px 0;
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background-color: rgba(88, 28, 135, 0.2);

  @media (max-width: 1000px) {
    margin: -2px 3px 0;
    padding: 1px 8px;
    font-size: 10px;
  }
`;

const Code = styled.a`
  min-height: 30px;
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }


  @media (max-width: 1000px) {
    font-size: 13px;
    line-height: 32px;
  }

  @media (max-width: 800px) {
    font-size: 12px;
  }
`;

const Gems = styled.div`
  width: 100%;
  min-height: 75px;
  padding-bottom: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;

  img {
    flex-shrink: 0;
    width: 25px;
    height: 33px;
    object-fit: contain;
  }

  @media (max-width: 1000px) {
    padding-bottom: 2px;

    img {
      width: 20px;
      height: 27px;
    }
  }

  @media (max-width: 800px) {
    img {
      width: 18px;
      height: 24px;
    }
  }
`;

const ActionButton = styled.button`
  width: 80%;
  height: 55px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.containerPrimary};

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary};
  }

  img {
    flex-shrink: 0;
  }


  @media (max-width: 1000px) {
    width: 92%;
    height: 42px;
    padding: 0 12px;

    span {
      font-size: 12px;
    }

    img {
      width: 14px;
      height: 16px;
    }
  }

  @media (max-width: 800px) {
    height: 38px;
    padding: 0 10px;
  }
`;

const RibbonWrap = styled.div`
  position: absolute;
  top: 24px;
  left: -6px;
  z-index: 2;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 100%;
    width: 6px;
    height: 6px;
    background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "#111"};
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    transition: background 0.3s ease;
  }

  @media (hover: hover) and (pointer: fine) {
    ${Card}:hover &::after {
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (max-width: 1000px) {
    top: 12px;
    left: -3px;

    &::after {
      width: 4px;
      height: 4px;
    }
  }
`;

const Ribbon = styled.div`
  position: relative;
  isolation: isolate;
  padding: 0 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  background: linear-gradient(
    to left,
    #d9d9d9 0%,
    #bcbcbc 10%,
    #9a9a9a 20%,
    #787878 30%,
    #575757 42%,
    #3d3d3d 55%,
    #2b2b2b 70%,
    #1f1f1f 100%
  );
  clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    background: ${({ theme }) => theme.colors.primary};
    transition: opacity 0.3s ease;
  }

  ${({ $active }) =>
    $active &&
    css`
      text-shadow: none;
    `}

  @media (hover: hover) and (pointer: fine) {
    ${Card}:hover &::before {
      opacity: 1;
    }
    ${Card}:hover & {
      text-shadow: none;
    }
  }



  @media (max-width: 1000px) {
    padding: 0 12px;
    font-size: 11px;
    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 50%, 100% 100%, 0 100%);
  }
`;

/* ----------------------------- Component ----------------------------- */

const CitizenCard = ({ name, code, image, onClick, isSelected, levels }) => {
  const nameRef = useRef(null);
  const [shift, setShift] = useState(0);

  // اگر اسم از کادر بیشتر بود، هنگام hover مثل کارت نکست حرکت می‌کند
  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;

    const measure = () =>
      setShift(Math.max(0, el.scrollWidth - el.clientWidth));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  const gems = (levels || []).filter((level) => level?.gem?.image);
  const lockedCount = Math.max(0, TOTAL_GEMS - gems.length);
  const isFounder = FOUNDER_CODES.includes((code || "").trim().toLowerCase());
  const currentSlug = levels && levels[0] && levels[0].slug;

  return (
    <Card $selected={isSelected} onClick={onClick}>
      <RibbonWrap $active={isSelected}>
        <Ribbon $active={isSelected}>
          {getTranslation(slugLabels[currentSlug || 0])}
        </Ribbon>
      </RibbonWrap>

      <Avatar>
        <img
          src={image || avatar}
          alt="citizen"
          loading="lazy"
          width={120}
          height={120}
        />
      </Avatar>

      <NameWrap>
        <Name
          ref={nameRef}
          $truncated={shift > 0}
          style={{ "--shift": `${shift}px` }}
          title={name}
        >
          {name || "\u00A0"}
          {isFounder && <FounderBadge>{getTranslation(1593)}</FounderBadge>}
        </Name>
      </NameWrap>

      <Code href={metarangUrlCitizen(code)} target="_blank" rel="noreferrer">
        {code}
      </Code>

      <Gems>
        {gems.map((level) => {
          const label = getTranslation(slugLabels[level.slug]);

          return (
            <ToolTip
              key={level.id}
              place="top"
              content={label}
              width={130}
              height={40}
              Chidren={<img src={level.gem.image} alt={label} loading="lazy" />}
            />
          );
        })}

        {Array.from({ length: lockedCount }).map((_, index) => (
          <img key={`lock-${index}`} src={lockGem} alt="locked" loading="lazy" />
        ))}
      </Gems>

      <ActionButton
        type="button"
        aria-label="citizen information"
        onClick={() => window.open(metarangUrlCitizen(code), "_blank")}
      >
        <span>{getTranslation(1398)}</span>
        <img alt="down" src={down} width={17} height={19} loading="lazy" />
      </ActionButton>
    </Card>
  );
};

export default CitizenCard;