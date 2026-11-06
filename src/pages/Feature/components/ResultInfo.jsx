// کارت نمایش قیمت ثبت‌شده‌ی درخواست فروش (مقدار ریال، PSC، نرخ و ۵٪) با دکمه‌های ویرایش و حذف؛ مناسب بخش کف قیمت و تعیین قیمت، و با پراپ lowest دکمه‌ها مخفی می‌شوند

import { BiEditAlt } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import styled from "styled-components";
import TitleBody from "../../../components/TitleBody.jsx";
import useRequest from "../../../hooks/useRequest.js";
import { useTheme } from "../../../hooks/useTheme.js";
import { convertToPersian, getTranslation } from "../../../services/Utility";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  padding: 15px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Results = styled.div`
  display: grid;
  gap: 20px;
    grid-template-columns: 1.4fr 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1.4fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 2fr 2fr 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;

  @media (min-width: 1200px) {
    flex-direction: row;
    align-items: center;
    justify-content: end;
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.newColors.primary};
  cursor: pointer;
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;

  @media (min-width: 1200px) {
    align-items: center;
  }
`;

const ResultInfo = ({ setAssign, rial, psc, setPsc, setRial, id, lowest }) => {
  const { theme } = useTheme();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const deleteHandler = () => {
    if (!checkSecurity()) return;

    Request(`sell-requests/${id}`, HTTP_METHOD.DELETE)
      .then(() => {
        setAssign(false);
        setPsc(0);
        setRial(0);
      })
      .catch((error) => console.error("Delete failed:", error));
  };

  return (
    <Wrapper>
      <Results>
        <div>
          <TitleBody title={getTranslation("48")} />
          <TitleBody title={convertToPersian(rial)} />
        </div>
        <div>
          <TitleBody title={getTranslation("47")} />
          <TitleBody title={convertToPersian(psc)} />
        </div>

        <ResultWrapper>
          <TitleBody title={getTranslation("522")} />
          <TitleBody
            title={`${convertToPersian(rial)} IRR / ${convertToPersian(psc)} PSC`}
          />
        </ResultWrapper>
        <ResultWrapper>
          <TitleBody title={getTranslation("523")} />
          <TitleBody title="5%" />
        </ResultWrapper>
      </Results>

      {!lowest && (
        <Actions>
          <ActionWrapper onClick={() => setAssign(false)}>
            <BiEditAlt
              size={20}
              color={theme === "light" ? "black" : "white"}
            />
          </ActionWrapper>
          <ActionWrapper onClick={deleteHandler}>
            <HiOutlineTrash size={20} color="#9b0e0e" />
          </ActionWrapper>
        </Actions>
      )}
    </Wrapper>
  );
};

export default ResultInfo;
