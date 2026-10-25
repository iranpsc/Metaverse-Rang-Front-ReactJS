
import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styled from "styled-components";
import useRequest from "../../hooks/useRequest.js";
import { getTranslation } from "../../services/Utility";
import { useLanguage } from "../../hooks/useLanguageContext.js";
import Button from "../../components/Button";

const Container = styled.div`
  margin-top: 20px;

  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
  }

  p {
    color: ${(props) => props.theme.colors.newColors.otherColors.gray};
    font-size: 16px;
    font-weight: 400;
  }

  input {
    font-size: 16px;
    border-radius: 5px;
    background-color: ${(props) =>
      props.theme.colors.newColors.otherColors.inputBg};
    border: 1px solid
      ${(props) => props.theme.colors.newColors.otherColors.inputBg};
    padding: 14px 18px 14px 18px;
    outline: none;
    width: 100%;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    margin-top: 20px;
  }

  button {
    font-size: 16px;
    border-radius: 5px;
    height: 50px;
    width: 100%;
    background-color: ${(props) =>
      props.theme.colors.newColors.otherColors.secondaryBtn};
    border-color: transparent;
    margin-top: 30px;
    margin-bottom: 15px;
    color: ${(props) =>
      props.theme.colors.newColors.otherColors.secondaryBtnText};
    cursor: pointer;
  }

  @media (max-width: 768px) {
    margin-top: 0px;

    h3 {
      font-size: 14px;
    }

    p {
      font-size: 14px;
    }

    input {
      padding: 10px 14px;
      margin-top: 10px;
    }

    button {
      font-size: 14px;
      height: 44px;
      margin-top: 10px;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 3px;
`;

const Div = styled.div`
  height: fit-content;
  position: relative;

  div {
    position: absolute;
    ${(props) => (props.isPersian ? "left" : "right")}: 8px;
    top: 28px;
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    cursor: pointer;

    @media (max-width: 768px) {
      top: 15px;
    }
  }
`;

const Up = styled.span`
  user-select: none;
  display: inline-flex;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Down = styled.span`
  user-select: none;
  display: inline-flex;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Min = styled.span`
  position: absolute;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  ${(props) => (props.isPersian ? "right" : "left")}: 40px;
  top: 37px;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
    top: 24px;
  }
`;

const FirstStep = ({ setStep, time, setTime }) => {
  const [phone, setPhone] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    time: time,
  });

  const { Request, HTTP_METHOD } = useRequest();
  const isPersian = useLanguage();

  const onSendHandler = () => {
    if (loading) return;

    let sendTime = time;

    if (Number(sendTime) < 5) {
      sendTime = 5;
      setTime(5);
    }

    setLoading(true);

    const requestData = phone
      ? { time: sendTime }
      : {
          ...formData,
          time: sendTime,
        };

    Request(
      "account/security",
      HTTP_METHOD.POST,
      requestData
    )
      .then(() => {
        setStep(2);
      })
      .catch((error) => {
        if (error?.response?.status === 422) {
          setPhone(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setFormData({
      [e.target.name]: e.target.value,
      time: time,
    });
  };

  const isTimeValid =
    time !== "" &&
    time !== null &&
    Number(time) >= 5;

  const isPhoneValid =
    phone ||
    (formData.phone && formData.phone.length === 11);

  const isSubmitDisabled = !isTimeValid || !isPhoneValid;

  return (
    <Container
      as="form"
      onSubmit={(e) => {
        e.preventDefault();

        if (loading) return;

        if (time === "" || time == null) {
          return;
        }

        if (Number(time) < 5) {
          setTime(5);

          setTimeout(() => {
            onSendHandler();
          }, 0);
        } else {
          onSendHandler();
        }
      }}
    >
      <h3>{getTranslation("858")}</h3>

      <p>{getTranslation("32")}</p>

      <Div isPersian={isPersian}>
        <ButtonContainer>
          <Up
            onClick={() =>
              setTime((prev) => {
                if (prev === "" || prev == null) return 5;

                const next = +prev + 1;

                if (next > 60) return 60;

                return Math.max(5, next);
              })
            }
          >
            <MdKeyboardArrowUp />
          </Up>

          <Down
            onClick={() => {
              if (time > 5) {
                setTime((prev) => +prev - 1);
              }
            }}
          >
            <MdKeyboardArrowDown />
          </Down>
        </ButtonContainer>

        <input
          value={time}
          onChange={(e) => {
            let value = e.target.value;

            value = value.replace(/[^\d]/g, "");

            if (value === "") {
              setTime("");
              return;
            }

            let numericValue = parseInt(value, 10);

            if (numericValue < 5) {
              if (value.length >= 2) {
                numericValue = 5;
              } else if (numericValue === 0) {
                setTime("");
                return;
              }
            }

            if (numericValue > 60) {
              numericValue = 60;
            }

            setTime(numericValue);
          }}
          type="text"
          inputMode="numeric"
          name="time"
          placeholder={getTranslation("858")}
          maxLength={2}
        />

        {!phone && (
          <input
            type="text"
            inputMode="numeric"
            name="phone"
            placeholder="09XXXXXXXX"
            value={formData.phone}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^0-9]/g, "");

              if (value.length > 11) {
                value = value.slice(0, 11);
              }

              handleInputChange({
                target: {
                  name: "phone",
                  value: value,
                },
              });
            }}
            onKeyDown={(e) => {
              const invalidKeys = [".", "٫", "e", "E", "-", "+", " "];

              if (invalidKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
            maxLength={11}
          />
        )}

        {time !== "" && (
          <Min isPersian={isPersian}>
            {getTranslation("33")}
          </Min>
        )}
      </Div>

      <Button
        label={getTranslation("859")}
        type="submit"
        disabled={loading ? "pending" : isSubmitDisabled}
      />
    </Container>
  );
};

export default FirstStep;

