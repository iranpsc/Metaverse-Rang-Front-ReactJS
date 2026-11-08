// Modal body showing a model's name and attributes beside its 3D preview; used in the model preview modal.
import styled from "styled-components";

import CanvasPreview from "../../../../../components/CanvasPreview";
import { getTranslation } from "../../../../../services/Utility";
import ModalLg from "../../../../../components/Modal/ModalLg";
import TitleBody from "../../../../../components/TitleBody";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const ContainerDetail = styled.div`
  width: 40%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px 10px 40px;

  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const CanvasWrapper = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  cursor: grab;
`;

const PreviewModel = ({ data, setShowModal }) => {
  const [model] = data;

  return (
    <ModalLg setShowModal={setShowModal} titleId="371">
      <Container>
        <ContainerDetail>
          <div>
            <TitleBody weight title={getTranslation("372")} />
            <TitleBody title={model.name} />
          </div>
          {model.attributes?.map(({ name, value }, index) => (
            <div key={`${name}-${index}`}>
              <TitleBody weight title={name} />
              <TitleBody title={value} />
            </div>
          ))}
        </ContainerDetail>
        <CanvasWrapper>
          <CanvasPreview link={model.file?.url} />
        </CanvasWrapper>
      </Container>
    </ModalLg>
  );
};

export default PreviewModel;
