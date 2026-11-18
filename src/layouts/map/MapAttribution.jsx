// Map attribution that mimics the native MapLibre control: text and side follow the page language; on mobile (`compact`) it collapses behind an (i) button, on desktop it is always open without a button.
import { useState } from "react";
import styled from "styled-components";

const infoIcon =
  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 20 20' width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0'/%3E%3C/svg%3E\")";

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  ${({ $isRtl }) => ($isRtl ? "right: 0;" : "left: 0;")}
  direction: ${({ $isRtl }) => ($isRtl ? "rtl" : "ltr")};
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 24px;
  margin: 10px;
  background-color: #fff;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1;
  font-family: inherit;
  white-space: nowrap;
  padding-inline: ${({ $compact, $open }) =>
    !$compact ? "10px" : $open ? "0 10px" : "0"};
`;

const InfoButton = styled.button`
  flex-shrink: 0;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  background-image: ${infoIcon};
  background-repeat: no-repeat;
  background-position: center;
`;

const Link = styled.a`
  color: rgb(0 0 0 / 75%);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const MapAttribution = ({ isRtl, compact }) => {
  const [open, setOpen] = useState(false);
  const expanded = !compact || open;

  return (
    <Wrapper $isRtl={isRtl} $compact={compact} $open={open}>
      {compact && (
        <InfoButton
          type="button"
          aria-label="attribution"
          onClick={() => setOpen((prev) => !prev)}
        />
      )}
      {expanded && (
        <Link href="https://map.metarang.com/" target="_blank" rel="noreferrer">
          {isRtl ? "قدرت گرفته از نقشه ملی" : "Powered by National Map"}
        </Link>
      )}
    </Wrapper>
  );
};

export default MapAttribution;
