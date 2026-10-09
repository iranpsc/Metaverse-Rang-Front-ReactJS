
import styled from "styled-components";
import LoginIcon from "../../../assets/svg/login.svg?react";
import { useMenuContext } from "../../../services/reducers/MenuContext";
import { getTranslation } from "../../../services/Utility";
import useRequest from "../../../services/Hooks/useRequest";
import { useState } from "react";

const Btn = styled.div`
  width: 100%;
  min-height: 39px;

  @media (min-width: 1024px) {
    min-height: 49px;
  }

  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.newColors.primaryText};
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "space-between" : "center")};
  border-radius: 10px;
  padding: 0 10px;
  cursor: ${(props) => (props.loading ? "wait" : "pointer")};
  pointer-events: ${(props) => (props.loading ? "none" : "auto")};
  opacity: ${(props) => (props.loading ? 0.7 : 1)};
  transition: opacity 0.2s ease;
`;

const Text = styled.p`
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const Icon = styled(LoginIcon)`
  stroke: ${(props) => props.theme.colors.newColors.primaryText};
  width: 24px;
  height: 24px;
`;

const Loader = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid
    ${(props) => props.theme.colors.newColors.primaryText};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const BtnLogin = () => {
  const { isOpen } = useMenuContext();
  const { Request, HTTP_METHOD } = useRequest();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;

    setLoading(true);

    Request(
      `auth/redirect?redirect_to=${window.location.origin}`,
      HTTP_METHOD.GET,
      {},
      {},
      "development",
    )
      .then((response) => {
        if (response && response.data.url) {
          window.location.href = response.data.url;
        } else {
          console.error("No link found in response");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Request failed", error);
        setLoading(false);
      });
  };

  return (
    <Btn
      isOpen={isOpen}
      $loading={loading}
      onClick={handleClick}
    >
      {loading ? <Loader /> : <Icon />}

      <Text isOpen={isOpen}>
        {getTranslation("4")}
      </Text>
    </Btn>
  );
};

export default BtnLogin;

