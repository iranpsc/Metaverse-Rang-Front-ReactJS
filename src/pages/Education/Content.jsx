import styled from "styled-components";
import TitleHeader from "../../components/TitleHeader";
import { getSize } from "../../styles/sizes";
import HtmlContent from "../../components/HtmlContent";
const Container = styled.div`
  padding: 0 5px;
  overflow-y: auto;
  height: 210px;
  @media (max-width: 1400px) {
  }
  @media (min-width: 1401px) {
    padding-right: 15px;
  }

  @media (max-width: 1000px) {
    padding: 0 8px;
    flex-shrink: 0;
            height: 100px;

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
  }
`;

const Description = styled(HtmlContent)`
  @media (max-width: 1400px) {
    display: block;
  }
`;

const Content = ({ data }) => {
  return (
    <Container>
      {data?.title && <TitleHeader noMargin title={data?.title} />}

      <Description html={data?.description} />
    </Container>
  );
};

export default Content;
