import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;

  overflow: hidden;

  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    align-items: stretch;

    gap: 12px;
    margin-bottom: 5px;
  }

  @media (min-width: 769px) and (max-width: 1365px) {
    gap: 20px;
  }

  @media (min-width: 1366px) {
    display: grid;
    grid-template-columns: 100px minmax(300px, 510px);

    justify-content: space-between;
  }
`;

export const Citizens = styled.div`
  flex: 1;
  min-height: 0;

  display: grid;

  gap: 20px;

  overflow-y: auto;

  padding: 5px;

  align-content: start;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  /* Mobile */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 15px;

    justify-items: center;
  }

  /* Tablet */
  @media (min-width: 601px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Small Desktop */

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  /* Large Desktop */
  @media (min-width: 1300px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1544px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  /* Very Large Screens */
  @media (min-width: 1800px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  /* Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #555;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const Buttons = styled.div`
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 15px;

  margin-top: auto;
  padding-top: 10px;

  @media (max-width: 600px) {
    gap: 10px;
    padding-top: 5px;

    flex-wrap: wrap;
  }

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SelectButton = styled.button`
  min-width: 120px;
  height: 49px;

  padding: 10px 22px;

  color: #ffffff;
  background-color: ${({ disabled }) => (disabled ? "gray" : "#18c08f")};

  border: none;
  border-radius: 10px;

  font-family: inherit;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background-color: #15ad81;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 600px) {
    flex: 1;
    min-width: 0;

    height: 45px;
    padding: 8px 15px;

    font-size: 14px;
  }

  @media (max-width: 400px) {
    width: 100%;
    flex: none;
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  color: #808080;

  margin: 20px 0;

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;
