import { convertToPersian, getTranslation } from "../../../../services/Utility";
import styled from "styled-components";
import ModalXs from "../../../../components/Modal/ModalXs";
import TitleHeader from "../../../../components/TitleHeader";
import TitleBody from "../../../../components/TitleBody";
import TitleValue from "../../../../components/TitleValue";
import Button from "../../../../components/Button";

const Inputs = styled.div`
  display: flex;
  gap: 20px;
  margin: 30px 0;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const EnterConfirmModal = ({ data, setPayStatus, setLoading }) => {
  const enterHandler = () => {
    setLoading(true);
  };
  return (
    <ModalXs noIcon global>
      {" "}
      <TitleHeader center title={getTranslation("548")} />
      <TitleBody
        title={`${getTranslation("549")}
        ${convertToPersian(20)}
        ${getTranslation("550")}`}
      />
      <Inputs>
        {data[0].inputs.slice(0, 2).map((input) => (
          <TitleValue
            full
            {...input}
            title={getTranslation(input.label)}
            key={input.id}
          />
        ))}
      </Inputs>
      <Buttons>
        <Button
          color="#18C08F"
          onClick={enterHandler}
          label={getTranslation("536")}
        />

        <Button
          grayTheme
          onClick={() => setPayStatus(false)}
          label={getTranslation("551")}
        />
      </Buttons>
    </ModalXs>
  );
};

export default EnterConfirmModal;
