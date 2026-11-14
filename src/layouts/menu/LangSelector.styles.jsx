// LangSelector.styles.ts
import styled from "styled-components";

export const LangContainer = styled.div`
  position: relative;
  display: ${(p) => (p.isOpen ? "block" : "none")};
`;

export const LangButton = styled.div`
  width: 27px;

  height: 26px;

  @media (max-width: 767px) {
    width: 23px;
    height: 23px;
  }

  @media (min-width: 1280px) {
    width: 27px;
    height: 27px;
  }

  border-radius: 50%;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const LangMenu = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 8px;
  width: 130px;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border-radius: 8px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 15%);
  border: 1px solid #525253ff;

  padding: 12px;
  z-index: 101;
`;
