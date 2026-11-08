import {
  MdAccessTime,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { useContext, useState } from "react";
import { ParticipantsContext } from "./ParticipationTab";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { Title } from "../../Styles";
import { getTranslation } from "../../../../services/Utility";
import TitleValue from "../../../../components/TitleValue";

const Container = styled.div``;
const Inputs = styled.div`
  display: grid;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  @media (min-width: 1500px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Info = styled.p`
  ${(props) => props.theme.colors.newColors.otherColors.inputBg};
  margin: 10px auto;
  font-size: 16px;
`;

const Div = styled.div`
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  border-radius: 5px;
  position: relative;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  input {
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    padding: 10px 12px;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  div {
    position: absolute;
    left: 10px;
    top: 5px;
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    cursor: pointer;
  }
`;
const Up = styled.span`
  margin-bottom: -15px;
`;
const Down = styled.span``;

const AddSatisfy = () => {
  const [count, setCount] = useState("");
  const { participantsList, setParticipantsList } =
    useContext(ParticipantsContext);

  const addHandler = () => {
    if (count !== "") {
      setParticipantsList((prev) => [
        ...prev,
        {
          id: participantsList.length + 1,
          userCode: "HM-2000081",
          time: "۲۰ اردیبهشت ۱۴۰۰۲ | ۱۲:۳۰",
          debt: "۱۹۷۲.۱۹۱۰۲۲۱",
          level: "۱۹۷۲.۱۹۱۰۲۲۱",
          satisfyCount: count,
          options: [
            {
              id: 1,
              submit: "۲۰ اردیبهشت ۱۴۰۰۲ | ۱۲:۳۰",
              change: "۲۰ اردیبهشت ۱۴۰۰۲ | ۱۲:۳۰",
            },
          ],
        },
      ]);
    }
  };

  return (
    <Container>
      <Title
        title={getTranslation("557")}
      />
      <Info>
        {getTranslation("558")}
      </Info>
      <Inputs>
        <Div>
          <div>
            <Up onClick={() => setCount((prev) => (+prev + 0.0001).toFixed(4))}>
              <MdKeyboardArrowUp />
            </Up>
            <Down
              onClick={() => {
                if (count > 0) {
                  setCount((prev) => (+prev - 0.0001).toFixed(4));
                }
              }}
            >
              <MdKeyboardArrowDown />
            </Down>
          </div>
          <input
            value={count}
            onChange={(e) => setCount(e.target.value)}
            type="number"
            placeholder={getTranslation("559")}
            maxLength={3}
            min={0}
            max={200}
            step={0.00001}
          />
        </Div>
        <TitleValue
          icon={<MdAccessTime />}
          title="زمان کسر شده"
          value="۳۴ روز | ۱۸ ساعت ۲۹ دقیقه ۴۵ ثانیه"
        />
      </Inputs>
      <Button
        label={getTranslation("561")}
        onclick={addHandler}
      />
    </Container>
  );
};

export default AddSatisfy;
