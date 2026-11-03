import { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../../../components/Button";
import CustomEditor from "../../../../components/Common/CustomEditor";
import LabeledInput from "../../../../components/LabeledInput.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import { FeatureContext } from "../../Context/FeatureProvider";
import IsicSelect from "../../../../components/IsicCode/IsicSelect.jsx";

const POSTAL_CODE_LENGTH = 10;
const MIN_ADDRESS_LENGTH = 10;
const WEBSITE_PATTERN = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[a-zA-Z]{2,}$/;

const parseActivities = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildInitialFields = (inputs = {}) => ({
  activity: parseActivities(inputs?.first_row_info?.[0]?.value),
  name: inputs?.first_row_info?.[1]?.value ?? "",
  address: inputs?.second_row_info?.[0]?.value ?? "",
  post: inputs?.third_row_info?.[0]?.value ?? "",
  web: inputs?.third_row_info?.[1]?.value ?? "",
  about: inputs?.target ?? "",
});

// هر قانون true برمیگردونه اگه مقدار (غیرخالی) معتبر باشه
const RULES = {
  address: (v) => v.length >= MIN_ADDRESS_LENGTH,
  post: (v) => v.length >= POSTAL_CODE_LENGTH,
  web: (v) => WEBSITE_PATTERN.test(v),
};

const hasError = (field, value) => {
  const text = (value || "").trim();
  return Boolean(text) && !RULES[field](text);
};

const INITIAL_ERRORS = { address: false, post: false, web: false };

// پاک‌سازی ورودی‌ها قبل از ذخیره در state
const SANITIZERS = {
  post: (v) => v.replace(/\D/g, ""),
  web: (v) => v.replace(/[^\w\-.:/?#=&%]/g, ""),
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

// ستون ایسیک‌کد بیشتر فضا رو می‌گیره
const First = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: start;
  gap: 10px;

  & > * {
    min-width: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Third = styled.div`
  display: flex;
  gap: 10px;
`;

const EditInputs = ({ hasData, inputs, setEdit, buildingID, featureID }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [, setFeature] = useContext(FeatureContext);

  const [fields, setFields] = useState(() => buildInitialFields(inputs));
  const [errors, setErrors] = useState(INITIAL_ERRORS);

  useEffect(() => {
    setFields(buildInitialFields(inputs));
  }, [inputs]);

  const updateField = useCallback(
    (field, value) => setFields((prev) => ({ ...prev, [field]: value })),
    [],
  );

  // هندلر مشترک: پاک‌سازی، ذخیره و برداشتن خطا وقتی مقدار درست شد
  const handleChange = (field) => (event) => {
    const raw = event.target.value;
    const value = SANITIZERS[field]?.(raw) ?? raw;

    updateField(field, value);
    if (errors[field] && !hasError(field, value)) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSend = async () => {
    const payload = {
      activity: fields.activity.join(","),
      name: fields.name.trim(),
      address: fields.address.trim(),
      post: fields.post.trim(),
      web: fields.web.trim(),
      about: fields.about.trim(),
    };

    const nextErrors = {
      address: hasError("address", payload.address),
      post: hasError("post", payload.post),
      web: hasError("web", payload.web),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const formData = new FormData();
    formData.append("activity_line", payload.activity);
    formData.append("name", payload.name);
    formData.append("address", payload.address);
    formData.append("postal_code", payload.post);
    formData.append("website", payload.web);
    formData.append("description", payload.about);

    try {
      await Request(
        `features/${featureID}/build/buildings/${buildingID}`,
        HTTP_METHOD.PATCH,
        formData,
      );

      setFeature((prev) => ({
        ...prev,
        buildings: (prev?.buildings ?? []).map((item) =>
          item.id === buildingID
            ? {
                ...item,
                building: {
                  ...item.building,
                  information: {
                    ...(item.building?.information ?? {}),
                    activity_line: payload.activity,
                    name: payload.name,
                    address: payload.address,
                    postal_code: payload.post,
                    website: payload.web,
                    description: payload.about,
                  },
                },
              }
            : item,
        ),
      }));

      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <First>
        <IsicSelect
          value={fields.activity}
          onChange={(activity) => updateField("activity", activity)}
        />
        <LabeledInput
          value={fields.name}
          onChange={handleChange("name")}
          placeholder={getTranslation("361")}
        />
      </First>

      <LabeledInput
        value={fields.address}
        onChange={handleChange("address")}
        placeholder={getTranslation(554)}
        maxLength={100}
        error={errors.address}
      />

      <Third>
        <LabeledInput
          inputMode="numeric"
          maxLength={POSTAL_CODE_LENGTH}
          value={fields.post}
          onChange={handleChange("post")}
          placeholder={getTranslation("363")}
          error={errors.post}
        />
        <LabeledInput
          type="url"
          value={fields.web}
          onChange={handleChange("web")}
          placeholder={getTranslation("364")}
          error={errors.web}
        />
      </Third>

      <CustomEditor
        showToolbar={false}
        border
        value={fields.about}
        placeholder={getTranslation(365)}
        onChange={(value) => updateField("about", value)}
      />

      <TitleBody title={getTranslation(556)} />

      <Button
        edit
        onClick={handleSend}
        label={hasData ? getTranslation("537") : getTranslation("629")}
        fit
      />
    </Container>
  );
};

export default EditInputs;
