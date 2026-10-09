import { BiEditAlt } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi";
import styled from "styled-components";
import {
  convertToPersian,
  getTranslation,
} from "../../../services/Utility";
import Result from "../../../components/Result";
import useRequest from "../../../services/Hooks/useRequest";
import { useTheme } from "../../../services/reducers/ThemeContext";
const Wrapper = styled.div`
  border-radius: 5px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  padding: 15px;
  display: grid;
  grid-template-columns: 4fr 1fr;
`;

const Results = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
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
  width: 36px;
  height: 36px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.newColors.primary};
  cursor: pointer;
`;

const ResultWrapper = styled.div`
  display: flex;
  color: ${(props) => props.theme.colors.newColors.shades.title};

  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  @media (min-width: 1200px) {
    align-items: center;
  }
`;

const Value = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 400;
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
        setAssign(false);
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });

  };
  const buttonColer = theme == "light" ? "black" : "white";
  return (
    <Wrapper>
      <Results>
        <Result
          title={
            (getTranslation("521"),
              getTranslation("48"))
          }
          value={rial}
        />
        <Result
          title={
            (getTranslation("521"),
              getTranslation("47"))
          }
          value={psc}
        />
        <ResultWrapper>
          {getTranslation("522")}
          <Value>
            {convertToPersian(rial)} IRR / {convertToPersian(psc)} PSC
          </Value>
        </ResultWrapper>
        <Result title={getTranslation("523")} value={"5%"} />
      </Results>
              {!lowest && ( <Actions>
        <ActionWrapper onClick={() => setAssign(false)}>
          <BiEditAlt size={20} color={buttonColer} />
        </ActionWrapper>
        <ActionWrapper onClick={deleteHandler}>
          <HiOutlineTrash size={20} color="#9b0e0e" />
        </ActionWrapper>
      </Actions>)}

     
    </Wrapper>
  );
};

export default ResultInfo;
