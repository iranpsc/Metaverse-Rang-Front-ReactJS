//بررسی مجدد

import { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import propTypes from "prop-types";

const PrimaryButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary}!important;
  border: none;
  border-radius: 8px;
  --bs-text-opacity: 1;
  color: ${(props) => props.theme.colors.newColors.primaryText};
  padding: 8px 24px 8px 24px;
  font-size: 14px;
  font-weight: 600;
`;

const SecondaryButton = styled.button`
  display: flex;
  width: 100%;
  @media (min-width: 768px) {
    width: ${(props) => (props.responsive ? "75%" : "100%")};
  }
  height: 40px;
  @media (min-width: 1024px) {
    height: 50px;
  }
  padding: 12px 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid rgba(24, 192, 143, 0.5);
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  font-family: AzarMehr;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  gap: 5px;
`;

function Submit({ text, type, options, responsive, children }) {
  const [button, setButton] = useState(null);

  useLayoutEffect(() => {
    switch (type) {
      case "secondary":
        setButton(
          <SecondaryButton type="submit" {...options} responsive={responsive}>
            {children}
            {text}
          </SecondaryButton>
        );
        break;

      case "primary":
        setButton(
          <PrimaryButton type="submit" {...options} responsive={responsive}>
            {text}
          </PrimaryButton>
        );
        break;

      default:
        return;
    }
  }, [type, options, responsive, children, text]);

  return button;
}

Submit.propTypes = {
  text: propTypes.string.isRequired,
  type: propTypes.string.isRequired,
  options: propTypes.object,
  responsive: propTypes.bool,
  children: propTypes.node,
};

export default Submit;
