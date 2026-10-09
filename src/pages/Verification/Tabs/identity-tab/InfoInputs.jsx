import styled from "styled-components";
import TitleValue from "../../../../components/TitleValue";
import { getTranslation } from "../../../../services/Utility";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

const identityInfoFields = [
  { id: 1, slug: "fname", label: "647" },
  { id: 2, slug: "lname", label: "646" },
  { id: 3, slug: "melli_code", label: "870" },
  { id: 4, slug: "province", label: "59" },
  { id: 5, slug: "birthdate", label: "83" },
  { id: 6, slug: "gender", label: "872" },
];

const InfoInputs = ({ kyc = {} }) => {
  return (
    <Container>
      {identityInfoFields.map((field) => (
        <TitleValue
          value={kyc?.[field.slug] || ""}
          title={getTranslation(field.label)}
          key={field.id}
        />
      ))}
    </Container>
  );
};

export default InfoInputs;
