import { useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { RiCloseFill } from "react-icons/ri";
import styled from "styled-components";
import LabeledInput from "../../../../components/LabeledInput";
import TitleBody from "../../../../components/TitleBody";
import { convertToPersian, getTranslation } from "../../../../services/Utility";

// داده‌ی نمونه
const INITIAL_CARDS = [
  { id: 1, name: 19292, percent: 20, count: 120 },
  { id: 2, name: 19292, percent: 20, count: 120 },
];

const EMPTY_FORM = { code: "", percent: "", count: "" };

// فیلدهای فرم؛ برای اضافه/کم کردن فیلد فقط همین آرایه عوض میشه
const FIELDS = [
  { name: "code", placeholder: 543 },
  { name: "percent", placeholder: 544, type: "number", maxLength: 3 },
  { name: "count", placeholder: 545, type: "number", maxLength: 6 },
];

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 32px;

  @media (min-width: 1180px) {
    grid-template-columns: 3fr 3fr 3fr 2fr;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 30px;
  padding: 10px 14px;
  border: none;
  border-radius: 5px;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 900px) {
    h5 {
      font-size: 11px;
    }
  }
`;

const CodeCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const CodeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  padding-inline-end: 8px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const RemoveButton = styled.button`
  display: flex;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Summary = styled.div`
  h5 {
    font-size: 13px;
    color: #949494;

    &:first-of-type {
      font-weight: 600;
    }
  }
`;

const Codes = () => {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [form, setForm] = useState(EMPTY_FORM);
  // شمارنده‌ی id؛ برخلاف cards.length + 1 بعد از حذف کارت‌ها تکراری نمیشه
  const nextId = useRef(INITIAL_CARDS.length + 1);

  const percent = Number(form.percent);
  const count = Number(form.count);
  const isValid =
    form.code.trim() !== "" && percent > 0 && percent <= 100 && count > 0;

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAdd = () => {
    if (!isValid) return;

    setCards((prev) => [
      ...prev,
      { id: nextId.current++, name: form.code.trim(), percent, count },
    ]);
    setForm(EMPTY_FORM);
  };

  const handleRemove = (id) =>
    setCards((prev) => prev.filter((card) => card.id !== id));

  return (
    <div>
      <Container>
        {FIELDS.map(({ name, placeholder, ...rest }) => (
          <LabeledInput
            key={name}
            value={form[name]}
            onChange={handleChange(name)}
            placeholder={getTranslation(placeholder)}
            {...rest}
          />
        ))}

        <AddButton type="button" onClick={handleAdd} disabled={!isValid}>
          <BsPlus size={24} />
          <TitleBody title={getTranslation(546)} />
        </AddButton>
      </Container>

      <CodeCards>
        {cards.map(({ id, name, percent, count }) => (
          <CodeCard key={id}>
            <RemoveButton
              type="button"
              aria-label="remove"
              onClick={() => handleRemove(id)}
            >
              <RiCloseFill size={24} />
            </RemoveButton>

            <Summary>
              <TitleBody title={`open-${name}`} />
              <TitleBody
                small
                title={`${convertToPersian(percent)}% تخفیف | ${convertToPersian(count)} نفر`}
              />
            </Summary>
          </CodeCard>
        ))}
      </CodeCards>
    </div>
  );
};

export default Codes;
