import { useState, useEffect, useMemo, useCallback } from "react";
import { IoRadioButtonOnOutline } from "react-icons/io5";
import styled from "styled-components";
import defaultProfile from "../../../../../assets/images/avatars/defulte-profile.webp";
import Dropdown from "../../../../../components/Common/Dropdown";
import TitleBody from "../../../../../components/TitleBody";
import UserCode from "../../../../../components/UserCode";
import {
  convertToPersian,
  getTranslation,
} from "../../../../../services/Utility";

/* ---------- Constants ---------- */

const TEXT_IDS = {
  relation: 834,
  relationPlaceholder: 1000,
  age: 1400,
  year: 803,
};

// خارج از کامپوننت تعریف شده تا در هر رندر دوباره ساخته نشود
const RELATION_TYPES = {
  parent: [
    { value: "father", label: 125 }, // پدر
    { value: "mother", label: 126 }, // مادر
  ],
  siblings: [
    { value: "sister", label: 127 }, // خواهر
    { value: "brother", label: 128 }, // برادر
  ],
  spouse: [{ value: "spouse", label: 825 }], // همسر
  children: [{ value: "son", label: 129 }], // پسر
};

/* ---------- Styles ---------- */

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  img {
    border-radius: 100%;
    border: 2px solid transparent;
    transition: all 0.2s linear;
  }

  &:hover img {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 10px 25px -5px #0066ff40;
  }
`;

/* ---------- Component ---------- */

const MemberCard = ({ selectedCitizen, memberType, setSelectedRelation }) => {
  const [selected, setSelected] = useState(null);

  const options = useMemo(
    () =>
      (RELATION_TYPES[memberType] ?? []).map(({ value, label }) => ({
        value,
        label: getTranslation(label),
      })),
    [memberType],
  );

  const hasMultipleOptions = options.length > 1;

  // با تغییر نوع عضو: اگر فقط یک گزینه هست خودکار انتخاب شود، وگرنه ریست
  useEffect(() => {
    const initial = options.length === 1 ? options[0].value : null;
    setSelected(initial);
    setSelectedRelation(initial);
  }, [options, setSelectedRelation]);

  const handleRelationChange = useCallback(
    (value) => {
      setSelected(value);
      setSelectedRelation(value);
    },
    [setSelectedRelation],
  );

  const { image, name, code, age } = selectedCitizen ?? {};

  return (
    <Container>
      <Right>
        <IoRadioButtonOnOutline size={24} />
        <Profile>
          <img
            src={image || defaultProfile}
            alt={name || ""}
            width={80}
            height={80}
          />
          <div>
            <TitleBody title={name} />
            <UserCode code={code} />
          </div>
        </Profile>
      </Right>

      <div>
        <TitleBody title={getTranslation(TEXT_IDS.relation)} />
        {hasMultipleOptions ? (
          <Dropdown
            options={options}
            selected={selected}
            onSelect={handleRelationChange}
            placeholder={getTranslation(TEXT_IDS.relationPlaceholder)}
            size="small"
          />
        ) : (
          <TitleBody title={options[0]?.label} />
        )}
      </div>

      <div>
        <TitleBody title={getTranslation(TEXT_IDS.age)} />
        <TitleBody
          title={`${convertToPersian(age)} ${getTranslation(TEXT_IDS.year)}`}
        />
      </div>
    </Container>
  );
};

export default MemberCard;
