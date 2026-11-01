// فرم ارسال مدارک احراز هویت (نام، نام خانوادگی، کد ملی، استان، تاریخ تولد، جنسیت، کارت ملی و ویدیو)؛ بدون اعتبارسنجی سمت کلاینت، فقط فیلدهایی که بک‌اند ایراد گرفته (initialKyc.errors) کادر قرمز می‌گیرند و بعد از ارسال موفق، داده‌ی برگشتی به والد داده می‌شود

import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import styled from "styled-components";
import { useMemo, useState } from "react";
import * as Sentry from "@sentry/react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import Alert from "../../../../components/Alert/Alert";
import Button from "../../../../components/Button";
import Container from "../../../../components/Common/Container";
import Dropdown from "../../../../components/Common/Dropdown";
import LabeledInput from "../../../../components/LabeledInput"; // مسیر را با ساختار پروژه تنظیم کنید
import TitleHeader from "../../../../components/TitleHeader";
import ErrorModal from "../ErrorModal";
import useRequest from "../../../../hooks/useRequest.js";
import {
  convertToEnglish,
  getFieldsByTabName,
  getTranslation,
} from "../../../../services/Utility";
import VideoRecord from "./VideoRecord";
import FileUploader from "../../../../components/FileUploader/FileUploader.jsx";
// بازه‌ی کلید ترجمه‌ی استان‌ها (همان range گروه cities در FIELD_CONFIGS)
const PROVINCE_RANGE = [907, 990];
const GENDER_KEYS = ["887", "886"];
const MELLI_CODE_LENGTH = 10;
const TEXT_FIELDS = [
  { slug: "fname", label: "647", type: "text", maxLength: 20 },
  { slug: "lname", label: "646", type: "text", maxLength: 40 },
  { slug: "melli_code", label: "870", type: "number", maxLength: 10 },
];
const SLUGS = [
  ...TEXT_FIELDS.map(({ slug }) => slug),
  "province",
  "birthdate",
  "gender",
];

const DEFAULT_VALUES = { birthdate: "1370/01/01" };
const MALE_VALUE = "877";

const getInitialValues = (kyc) =>
  Object.fromEntries(
    SLUGS.map((slug) => [slug, kyc?.[slug] || DEFAULT_VALUES[slug] || ""]),
  );

// نام خطاهای بک‌اند مثل fname_err به slug فیلد تبدیل می‌شود
const getErrorFields = (kyc) =>
  (kyc?.errors ?? []).map(({ name }) => name.replace(/_err$/, ""));

// موقت: این دو پراپ تا مرحله‌ی Upload باقی می‌مانند و بعد حذف می‌شوند
const noop = () => {};

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`;

const Birthday = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  overflow: hidden;
  border: 1px solid ${({ $error }) => ($error ? "red" : "#454545")};
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  svg {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;
const Media = styled.div`
  display: grid;
  gap: 30px;
  align-items: start;
  margin: 20px 0;

  @media (min-width: 1500px) {
    grid-template-columns: 800px 1fr;
  }
`;
const IdentityInputs = ({ initialKyc = {}, onSubmitSuccess }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [values, setValues] = useState(() => getInitialValues(initialKyc));
  const [errorFields, setErrorFields] = useState(() =>
    getErrorFields(initialKyc),
  );
  const [nationImage, setNationImage] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [textVerify, setTextVerify] = useState("");
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  // پیام‌های خطای بک‌اند برای Alert و ErrorModal
  const errorMessages = (initialKyc.errors ?? []).map(({ message }) => message);

  // باید داخل کامپوننت ساخته شود چون getFieldsByTabName از ترجمه‌های لودشده می‌خواند
  const provinceOptions = useMemo(
    () => [
      ...getFieldsByTabName(...PROVINCE_RANGE).map(
        ({ translation }) => translation,
      ),
    ],
    [],
  );

  const hasError = (slug) => errorFields.includes(slug);
  const clearError = (name) =>
    setErrorFields((prev) => prev.filter((field) => field !== name));

  // تغییر یک فیلد، کادر قرمز همان فیلد را هم برمی‌دارد
  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };
  const handleNationImageChange = ([file = null]) => {
    setNationImage(file);
    clearError("melli_card");
  };
  // کلیدهای خطای اعتبارسنجی بک‌اند: { melli_code: "..." } => ["melli_code"]
  const getResponseErrorFields = (error) =>
    Object.keys(error?.response?.data?.errors ?? {});
  const handleSubmit = () => {
    setIsSending(true);

    const video = JSON.parse(uploadResponse);
    const formData = new FormData();

    ["fname", "lname", "melli_code", "province"].forEach((slug) =>
      formData.append(slug, values[slug]),
    );
    formData.append("birthdate", convertToEnglish(values.birthdate));
    formData.append("gender", values.gender === MALE_VALUE ? "male" : "female");
    formData.append("melli_card", nationImage);
    formData.append("video[name]", video.name);
    formData.append("video[path]", video.path);
    formData.append("verify_text_id", textVerify.id);
    formData.append("_method", "put");

    Request("kyc", HTTP_METHOD.POST, formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((response) => onSubmitSuccess?.(response.data.data))
      .catch((error) => {
        // فیلدهایی که بک‌اند ایراد گرفته، کادر قرمز می‌گیرند
        const fields = getResponseErrorFields(error);
        if (fields.length > 0) {
          setErrorFields((prev) => [...new Set([...prev, ...fields])]);
        }

        Sentry.captureException(error, {
          tags: { section: "identity-verification" },
        });
      })
      .finally(() => setIsSending(false));
  };

  // بالای return
  const isFormComplete =
    SLUGS.every((slug) => values[slug].trim()) &&
    convertToEnglish(values.melli_code).trim().length === MELLI_CODE_LENGTH &&
    nationImage &&
    isVideoUploaded;
  return (
    <Container>
      <Form>
        {errorMessages.length > 0 && (
          <Alert
            type="error"
            info={getTranslation("880")}
            text={getTranslation("882")}
            buttonText={getTranslation("882")}
            onClick={() => setOpenErrorModal(true)}
          />
        )}

        <TitleHeader title={getTranslation("869")} />

        <Fields>
          {TEXT_FIELDS.map(({ slug, label, type, maxLength }) => (
            <LabeledInput
              key={slug}
              type={type}
              maxLength={maxLength}
              placeholder={getTranslation(label)}
              value={values[slug]}
              error={hasError(slug)}
              onChange={(e) => setField(slug, e.target.value)}
            />
          ))}

          <Dropdown
            searchable
            selectPlaceHolder={false}
            options={provinceOptions}
            selected={values.province}
            onSelect={(value) => setField("province", value)}
            placeholder={getTranslation("871")}
            hasError={hasError("province")}
          />

          <Birthday $error={hasError("birthdate")}>
            <DatePicker
              value={values.birthdate}
              onChange={(date) => setField("birthdate", date.format())}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              zIndex={100}
            />
            <FaRegCalendarAlt size={20} />
          </Birthday>
          <Dropdown
            selectPlaceHolder={false}
            options={GENDER_KEYS.map((key) => getTranslation(key))}
            selected={values.gender}
            onSelect={(value) => setField("gender", value)}
            placeholder={getTranslation("872")}
            hasError={hasError("gender")}
          />
        </Fields>

        <Media>
          <VideoRecord
            setVideoError={noop}
            setVideoURLParent={noop}
            uploadResponse={uploadResponse}
            setUploadResponse={setUploadResponse}
            textVerify={textVerify}
            setTextVerify={setTextVerify}
            setIsVideoUploaded={setIsVideoUploaded}
          />
          <FileUploader
            variant="card"
            title={getTranslation("878")}
            files={nationImage ? [nationImage] : []}
            onFilesChange={handleNationImageChange}
            error={hasError("melli_card")}
            accept="image/*"
            maxFiles={1}
            multiple={false}
            maxFileSizeMB={1}
          />
        </Media>

        <Button
          large
          label={getTranslation("877")}
          onClick={handleSubmit}
          disabled={!isFormComplete ? true : isSending ? "pending" : false}
        />
      </Form>

      {openErrorModal && (
        <ErrorModal
          setOpenErrorModal={setOpenErrorModal}
          errors={errorMessages}
        />
      )}
    </Container>
  );
};

export default IdentityInputs;
