import Button from "../../../../components/Button";
import Title from "../../../../components/Title";
import styled from "styled-components";
import { useGlobalState } from "../../../../hooks/useAboutMeGlobalState";
import { getTranslation } from "../../../../services/Utility";
import useRequest from "../../../../hooks/useRequest.js";
import { useState } from "react";
import Alert from "../../../../components/Alert/Alert";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`;

const Text = styled.div`
  p {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-weight: 400;
    margin-top: 10px;
  }
`;

const SaveInfo = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const { state } = useGlobalState();
  const [successMessage, setSuccessMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // حالت لودینگ دکمه

  const saveData = async () => {
    setIsSaving(true); // شروع لودینگ

    const formData = {
      about: state.about,
      education: state.education,
      occupation: state.occupation,
      passions: state.hobbies,
      loved_country: state.country,
      loved_city: state.city,
      loved_language: state.language,
      memory: state.memory,
      problem_solving: state.opportunity,
      prediction: state.prediction,
    };
    
    try {
      await Request("personal-info", HTTP_METHOD.PUT, formData);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false); // پایان لودینگ
    }
  };

  return (
    <>
      {successMessage && (
        <Alert type="success" text={getTranslation("1361")} />
      )}

      <Header>
        <Text>
          <Title title={getTranslation("95")} />
          <p>{getTranslation("780")}</p>
        </Text>
        <Button 
          label={getTranslation("782")} 
          fit 
          onclick={saveData}
          disabled={isSaving ? "pending" : false}
        />
      </Header>
    </>
  );
};

export default SaveInfo;