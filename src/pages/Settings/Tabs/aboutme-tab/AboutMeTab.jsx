import styled from "styled-components";
import { useEffect, useState } from "react";
import CountryCity from "./CountryCity";
import EducationsAndJob from "./EducationsAndJob";
import Hobby from "./Hobby";
import Prediction from "./Prediction";
import Alert from "../../../../components/Alert/Alert";
import Button from "../../../../components/Button";
import Container from "../../../../components/Common/Container";
import TitleHeader from "../../../../components/TitleHeader";
import { AboutMeSkeleton } from "../../../../components/Skeletons/AboutMeSkeleton";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import CustomEditor from "../../../../components/Common/CustomEditor.jsx";
const ALERT_DURATION_MS = 3000;

const INITIAL_FORM_DATA = {
  about: "",
  education: "",
  occupation: "",
  hobbies: {},
  country: "",
  language: "",
  city: "",
  memory: "",
  opportunity: "",
  prediction: "",
};

const FIELD_SOURCES = {
  about: "about",
  education: "education",
  occupation: "occupation",
  hobbies: "passions",
  country: "loved_country",
  language: "loved_language",
  city: "loved_city",
  memory: "memory",
  opportunity: "problem_solving",
  prediction: "prediction",
};

const toFormData = (data) =>
  Object.fromEntries(
    Object.entries(FIELD_SOURCES).map(([field, source]) => [
      field,
      data[source] ?? INITIAL_FORM_DATA[field],
    ]),
  );

const toPayload = (formData) =>
  Object.fromEntries(
    Object.entries(FIELD_SOURCES).map(([field, source]) => [
      source,
      formData[field],
    ]),
  );

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`;

const AboutMeTab = () => {
  const { Request, HTTP_METHOD } = useRequest();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await Request("personal-info");
        const data = response.data?.data;

        if (data && !cancelled) setFormData(toFormData(data));
      } catch (error) {
        console.error("Error fetching data from API:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field, value) =>
    setFormData((current) => ({ ...current, [field]: value }));

  // props مشترک بخش‌های تک‌فیلدی: مقدار فعلی + تغییر همان فیلد
  const bind = (field) => ({
    value: formData[field],
    onChange: (value) => updateField(field, value),
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await Request("personal-info", HTTP_METHOD.PUT, toPayload(formData));
      setSaved(true);
      setTimeout(() => setSaved(false), ALERT_DURATION_MS);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <AboutMeSkeleton />;

  return (
    <Container>
      {saved && <Alert type="success" text={getTranslation("1361")} />}

      <Header>
        <div>
          <TitleHeader title={getTranslation("95")} />
          <TitleHeader small title={getTranslation("780")} />
        </div>
        <Button
          fit
          label={getTranslation("782")}
          onClick={handleSave}
          disabled={isSaving ? "pending" : false}
        />
      </Header>
      {/* کاستوم ادیتور برای about */}
      <CustomEditor
        {...bind("about")}
        charLimit={10000}
        img
        label={getTranslation("781")}
      />
      <EducationsAndJob
        education={formData.education}
        occupation={formData.occupation}
        onChange={updateField}
      />
      <Hobby {...bind("hobbies")} />
      <CountryCity
        city={formData.city}
        country={formData.country}
        language={formData.language}
        onChange={updateField}
      />
      {/* کاستوم ادیتور برای memory */}
      <CustomEditor {...bind("memory")} img label={getTranslation("93")} />
      {/* کاستوم ادیتور برای opportunity */}
      <CustomEditor
        {...bind("opportunity")}
        img
        label={getTranslation("801")}
      />
      <Prediction {...bind("prediction")} />
    </Container>
  );
};

export default AboutMeTab;
