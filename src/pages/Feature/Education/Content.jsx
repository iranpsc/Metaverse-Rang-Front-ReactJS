import { FaChevronCircleLeft } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 20px;
  margin: 0 5px;
  height: ${(props) => (props.show ? "160px" : "")};
  overflow-y: auto;
  @media (max-width: 1400px) {
    height: ${(props) => (props.show ? "244px" : "")};
  }
  @media (min-width: 1401px) {
    padding-right: 15px;
    height: 160px;
  }
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      color: ${(props) => props.theme.colors.primary};
      font-weight: 500;
      font-size: 16px;
      cursor: pointer;
      @media (min-width: 1400px) {
        display: none;
      }
    }
  }
  h2 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 18px;
    font-weight: 500;
    margin-top: 7px;
    margin-bottom: 10px;
  }
  p {
    color: #969696;
    font-size: 16px;
    font-weight: 500;
    line-height: 26px;
    text-align: justify;

    @media (max-width: 1400px) {
      display: ${(props) => (props.show ? "block" : "none")};
    }
  }
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  z-index: 888;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (min-width: 1400px) {
    display: none !important;
  }
  div {
    background-color: white;
    width: 25px;
    height: 25px;
    right: 10px;
    border-radius: 100%;
    position: absolute;
  }
  svg {
    height: 100%;
    width: 100%;
    position: relative;
    color: #3b3b3b;
  }
`;

const Content = ({ show, setShow, data }) => {
  return (
    <Container show={show}>
      <div>
        {data?.title && <h2>{data.title}</h2>}

        {show ? (
          <Icon>
            <div />
            <FaChevronCircleLeft onClick={() => setShow(false)} />
          </Icon>
        ) : (
          <h3 onClick={() => setShow(!show)}>محتوای متنی</h3>
        )}
      </div>
      <p dangerouslySetInnerHTML={{ __html: data?.description }}></p>
    </Container>
  );
};

export default Content;
