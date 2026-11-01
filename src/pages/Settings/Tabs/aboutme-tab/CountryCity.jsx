import { useMemo } from "react";
import styled from "styled-components";
import Dropdown from "../../../../components/Common/Dropdown";
import {
  getFieldsByTabName,
  getTranslation,
} from "../../../../services/Utility";

// type: کلید گروه داده | field: کلید فیلد فرم | prop: نام prop ورودی
const FIELD_CONFIGS = [
  { type: "cities", field: "city", translationId: "797", range: [907, 990] },
  {
    type: "countries",
    field: "country",
    translationId: "798",
    range: [991, 1176],
  },
  {
    type: "languages",
    field: "language",
    translationId: "799",
    range: [1177, 1300],
  },
];

const toOptions = (fields) =>
  fields.map(({ unique_id, translation }) => ({
    id: unique_id,
    value: String(unique_id),
    label: translation,
  }));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  padding: 40px 0;

  @media (min-width: 1366px) {
    flex-direction: row;
  }
`;

const SelectContainer = styled.div`
  flex: 1;
`;

const CountryCity = ({ city, country, language, onChange }) => {
  const values = { city, country, language };

  const optionsByField = useMemo(
    () =>
      Object.fromEntries(
        FIELD_CONFIGS.map(({ field, range }) => [
          field,
          toOptions(getFieldsByTabName(...range)),
        ]),
      ),
    [],
  );

  return (
    <Container>
      {FIELD_CONFIGS.map(({ type, field, translationId }) => {
        const options = optionsByField[field];
        const selected = values[field];
        const placeholder =
          options.find((option) => option.value === String(selected))?.label ??
          "";

        return (
          <SelectContainer key={type}>
            <Dropdown
              searchable
              label={getTranslation(translationId)}
              options={options}
              selected={selected}
              placeholder={placeholder}
              onSelect={(uniqueId) => onChange(field, String(uniqueId))}
            />
          </SelectContainer>
        );
      })}
    </Container>
  );
};

export default CountryCity;
