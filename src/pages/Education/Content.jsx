import { FaChevronCircleLeft } from "react-icons/fa";
import styled from "styled-components";
import TitleHeader from "../../components/TitleHeader";
import { getSize } from "../../styles/sizes";
import HtmlContent from "../../components/HtmlContent";
import { getTranslation } from "../../services/Utility";
const Container = styled.div`
  padding: 0 12px;
  margin: 0px 5px;
  height: ${(props) => (props.show ? "160px" : "")};
  overflow-y: auto;
  @media (max-width: 1400px) {
    height: ${(props) => (props.show ? "244px" : "")};
  }
  @media (min-width: 1401px) {
    padding-right: 15px;
    height: 160px;
  }

  @media (max-width: 767px) {
    padding: 0 8px;
    height: ${({ show }) => (show ? "180px" : "auto")};
    flex-shrink: 0;
  }

  p {
    color: #969696;
    font-size: ${getSize("default", "base")};
    font-weight: 500;
    line-height: 1.6;
    text-align: justify;
    @media (min-width: 500px) and (max-width: 999px) {
      font-size: ${getSize("default", "tablet")};
    }

    @media (min-width: 1280px) {
      font-size: ${getSize("default", "desktop")};
    }

    @media (max-width: 1400px) {
      display: ${(props) => (props.show ? "block" : "none")};
    }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Description = styled(HtmlContent)`
  @media (max-width: 1400px) {
    display: ${({ $show }) => ($show ? "block" : "none")};
  }
`;

const Icon = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;

  @media (min-width: 1400px) {
    display: none !important;
  }

  svg {
    height: 22px;
    width: 22px;
  }
`;

const ToggleDescription = styled.button`
  border: 0;
  padding: 4px 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${getSize("default", "base")};
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${getSize("default", "tablet")};
  }

  @media (min-width: 1400px) {
    display: none;
  }
`;

const Content = ({ show, setShow, data }) => {
  return (
    <Container show={show}>
      {data?.title && <TitleHeader noMargin title={data?.title} />}
      <Controls>
        {show && (
          <Icon
            type="button"
            aria-label="Hide description"
            onClick={() => setShow(false)}
          >
            <FaChevronCircleLeft />
          </Icon>
        )}
        {!show && (
          <ToggleDescription type="button" onClick={() => setShow(true)}>
            {getTranslation(271)}{" "}
          </ToggleDescription>
        )}
      </Controls>
      <Description $show={show} html={data?.description} />
    </Container>
  );
};

export default Content;
