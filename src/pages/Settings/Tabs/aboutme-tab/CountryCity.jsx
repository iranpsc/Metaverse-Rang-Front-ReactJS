import Dropdown from "../../../../components/Common/Dropdown";
import styled from "styled-components";
import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import { useEffect, useState } from "react";
import {
  getTranslation,
  getFieldsByTabName,
} from "../../../../services/Utility";
const Container = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 0;

  justify-content: space-between;
  @media (min-width: 1366px) {
    flex-direction: row;
  }
`;

const SelectContainer = styled.div`
  flex: 1;
  &:last-child {
    margin-right: 0;
  }
`;

const Label = styled.label`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
`;
const CountryCity = () => {
  const { state, dispatch } = useGlobalState();

  const [fields, setFields] = useState({
    cities: [],
    countries: [],
    languages: [],
  });

  const [isFieldsLoaded, setIsFieldsLoaded] = useState(false);

  useEffect(() => {
    if (!isFieldsLoaded) {
      const loadFields = () => {
        const normalFields = {
          cities: getFieldsByTabName(907, 990),
          countries: getFieldsByTabName(991, 1176),
          languages: getFieldsByTabName(1177, 1300),
        };

        setFields(normalFields);
        setIsFieldsLoaded(true);
      };

      loadFields();
    }
  }, [isFieldsLoaded]);

  const getFieldTranslation = (fieldsType, stateValue) => {
    if (!isFieldsLoaded || !stateValue) return "";

    const selectedField = fields[fieldsType].find(
      (field) => String(field.unique_id) === String(stateValue)
    );

    return selectedField?.translation || "";
  };

  const handleFieldChange = (fieldsType, uniqueId, actionType) => {
    dispatch({
      type: actionType,
      payload: String(uniqueId),
    });
  };

  const options = [
    {
      type: "cities",
      translationId: "797",
      stateValue: state.city,
      actionType: "SET_CITY",
    },
    {
      type: "countries",
      translationId: "798",
      stateValue: state.country,
      actionType: "SET_COUNTRY",
    },
    {
      type: "languages",
      translationId: "799",
      stateValue: state.language,
      actionType: "SET_LANGUAGE",
    },
  ];

  return (
    <Container>
      {options.map((option) => (
        <SelectContainer key={option.type}>
          <Label>{getTranslation(option.translationId)}</Label>

          <Dropdown
            searchable={true}
            options={fields[option.type].map((field) => ({
              id: field.unique_id,
              value: String(field.unique_id),
              label: field.translation,
            }))}
            selected={option.stateValue}
            placeholder={getFieldTranslation(
              option.type,
              option.stateValue
            )}
            onSelect={(uniqueId) =>
              handleFieldChange(
                option.type,
                uniqueId,
                option.actionType
              )
            }
          />
        </SelectContainer>
      ))}
    </Container>
  );
};

export default CountryCity;