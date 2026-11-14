import { cloneElement, useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";
import { isMobile } from "../../services/Utility";

import "react-tooltip/dist/react-tooltip.css";

const TooltipContainer = styled.div`
  width: ${(props) => props.$width || 170}px;
  height: ${(props) => props.$height || 40}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;

  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};

  border-radius: 10px;

  color: ${(props) =>
    props.theme.colors.newColors.otherColors.headerMenu};

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 180%;
  text-transform: capitalize;

  position: relative;

  &::after {
    content: "";
    position: absolute;

    background: ${(props) => `url('${props.theme.tooltipBg}')`};

    width: 9px;
    height: 40px;

    right: -8px;
    left: -8px;

    rotate: ${(props) => (props.$lang === "en" ? "0" : "180deg")};
  }
`;

const TooltipContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 3px;
`;

const Title = styled.span`
  font-size: 16px;
`;

const Content = styled.p`
  margin: 0;
`;

export default function ToolTip({
  TitleToltip,
  ContentToltip,
  content,
  Chidren,
  classNamePosstion,
  lang,
  place = "left",
  width,
  height,
  disabled = false, // وقتی true باشه، تولتیپ اصلاً trigger/رندر نمیشه
}) {
  const tooltipId = `tooltip-${useId().replace(/:/g, "")}`;
  const hideTimerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(undefined);

  const child = cloneElement(
    Chidren,
    disabled ? {} : { "data-tooltip-id": tooltipId }
  );

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // اگه در حال نمایش بود و disabled شد، ببندش
    if (disabled) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setIsOpen(false);
    }
  }, [disabled]);

  const handleAfterShow = () => {
    if (!isMobile) return;

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    hideTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleAfterHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (isMobile && !disabled) setIsOpen(undefined);
  };

  return (
    <>
      {child}

      {!disabled && (
        <Tooltip
          id={tooltipId}
          place={place}
          delayShow={50}
          noArrow
          opacity={1}
          isOpen={isMobile ? isOpen : undefined}
          setIsOpen={setIsOpen}
          afterShow={handleAfterShow}
          afterHide={handleAfterHide}
          style={{
            zIndex: 10000,
            padding: 0,
            background: "transparent",
          }}
        >
          <TooltipContainer
            $lang={lang}
            $width={width}
            $height={height}
            className={classNamePosstion || ""}
          >
            <TooltipContainer2>
              {content ? (
                content
              ) : (
                <>
                  {TitleToltip && <Title>{TitleToltip}</Title>}
                  {ContentToltip && <Content>{ContentToltip}</Content>}
                </>
              )}
            </TooltipContainer2>
          </TooltipContainer>
        </Tooltip>
      )}
    </>
  );
}