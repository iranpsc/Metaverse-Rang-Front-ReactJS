// Item component
import { IoIosArrowDropdownCircle } from "react-icons/io";
import styled from "styled-components";
import { useState } from "react";
import OnOff from "../OnOff.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody.jsx";

const Container = styled.div`
  min-width: 0;
  border: 1px solid #454545;
  border-radius: 5px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  padding: 8px;
  margin: 0 6px 8px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  > :first-child {
    min-width: 0;
  }

  @media (min-width: 768px) {
    gap: 16px;
    padding: 10px;
    margin: 0 15px 15px;
  }
`;

const Options = styled.div`
  overflow: hidden;
  display: flex;
  max-height: ${({ $show }) => ($show ? "1000px" : "0")};
  transition: max-height 0.2s ease-in-out;
  flex-direction: column;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 10px;

  @media (min-width: 768px) {
    gap: 12px;
    padding: 15px;
  }
`;

const ExpandButton = styled.button`
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: clamp(30px, 4vw, 36px);
  height: clamp(30px, 4vw, 36px);
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    transform: ${({ $show }) => ($show ? "rotate(180deg)" : "none")};
    transition: transform 0.2s linear;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 50%;
  }
`;

const Item = ({ translationId, options, privacy, setPrivacy }) => {
  const [show, setShow] = useState(false);
  const [pendingKeys, setPendingKeys] = useState(() => new Set());
  const { Request, HTTP_METHOD } = useRequest();

  const safeTranslation = (id) => {
    try {
      if (!id) return "";
      return getTranslation(id) || "";
    } catch {
      return "";
    }
  };

  const handleToggle = async (optionKey, newValue) => {
    const previousValue = Boolean(privacy[optionKey]);

    setPendingKeys((previous) => new Set(previous).add(optionKey));
    setPrivacy((previous) => ({ ...previous, [optionKey]: newValue }));

    try {
      await Request("privacy", HTTP_METHOD.POST, {
        key: optionKey,
        value: Number(newValue),
      });
    } catch {
      setPrivacy((previous) => ({ ...previous, [optionKey]: previousValue }));
    } finally {
      setPendingKeys((previous) => {
        const next = new Set(previous);
        next.delete(optionKey);
        return next;
      });
    }
  };

  return (
    <Container>
      <Label>
        <TitleBody title={safeTranslation(translationId)} />
        <ExpandButton
          type="button"
          aria-expanded={show}
          aria-label={safeTranslation(translationId)}
          $show={show}
          onClick={() => setShow((previous) => !previous)}
        >
          <IoIosArrowDropdownCircle />
        </ExpandButton>
      </Label>
      <Options $show={show}>
        {options.map((option) => (
          <Option key={option.id}>
            <TitleBody
              title={safeTranslation(option.translationId) || option.title}
            />
            <OnOff
              label={option.title || safeTranslation(option.translationId)}
              isOn={!Boolean(privacy[option.key])}
              disabled={pendingKeys.has(option.key)}
              onToggle={(newValue) => handleToggle(option.key, newValue)}
            />
          </Option>
        ))}
      </Options>
    </Container>
  );
};

export default Item;
