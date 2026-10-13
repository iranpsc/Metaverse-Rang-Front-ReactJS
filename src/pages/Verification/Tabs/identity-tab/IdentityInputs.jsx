import Inputs from "./Inputs";
import Upload from "./Upload";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import Title from "../../../../components/Title";
import Button from "../../../../components/Button";
import ErrorModal from "../ErrorModal";
import { verifyIranianNationalId } from "@persian-tools/persian-tools";
import useRequest from "../../../../services/Hooks/useRequest";
import {
  convertToEnglish,
  getTranslation,
  ToastError,
} from "../../../../services/Utility";
import * as Sentry from "@sentry/react";
import Container from "../../../../components/Common/Container";

const BankContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (min-width: 1500px) {
    grid-template-columns: 2fr 3fr;
  }
`;

const initialDetails = [
  { id: 1, slug: "fname", label: "647" },
  { id: 2, slug: "lname", label: "646" },
  { id: 3, slug: "melli_code", label: "870" },
  {
    id: 4,
    slug: "province",
    label: 59,
    options: [
      { id: 0, city: "1000" },
      { id: 1, city: "907" },
      { id: 2, city: "908" },
      { id: 3, city: "909" },
      { id: 4, city: "910" },
      { id: 5, city: "911" },
      { id: 6, city: "912" },
      { id: 7, city: "913" },
      { id: 8, city: "914" },
      { id: 9, city: "915" },
      { id: 10, city: "916" },
      { id: 11, city: "917" },
      { id: 12, city: "918" },
      { id: 13, city: "919" },
      { id: 14, city: "920" },
      { id: 15, city: "921" },
      { id: 16, city: "922" },
      { id: 17, city: "923" },
      { id: 18, city: "924" },
      { id: 19, city: "925" },
      { id: 20, city: "926" },
      { id: 21, city: "927" },
      { id: 22, city: "928" },
      { id: 23, city: "929" },
      { id: 24, city: "930" },
      { id: 25, city: "931" },
      { id: 26, city: "932" },
      { id: 27, city: "933" },
      { id: 28, city: "934" },
      { id: 29, city: "935" },
      { id: 30, city: "936" },
      { id: 31, city: "937" },
      { id: 32, city: "938" },
      { id: 33, city: "939" },
      { id: 34, city: "940" },
      { id: 35, city: "941" },
      { id: 36, city: "942" },
      { id: 37, city: "943" },
      { id: 38, city: "944" },
      { id: 39, city: "945" },
      { id: 40, city: "946" },
      { id: 41, city: "947" },
      { id: 42, city: "948" },
      { id: 43, city: "949" },
      { id: 44, city: "950" },
      { id: 45, city: "951" },
      { id: 46, city: "952" },
      { id: 47, city: "953" },
      { id: 48, city: "954" },
      { id: 49, city: "955" },
      { id: 50, city: "956" },
      { id: 51, city: "957" },
      { id: 52, city: "958" },
      { id: 53, city: "959" },
      { id: 54, city: "960" },
      { id: 55, city: "961" },
      { id: 56, city: "962" },
      { id: 57, city: "963" },
      { id: 58, city: "964" },
      { id: 59, city: "965" },
      { id: 60, city: "966" },
      { id: 61, city: "967" },
      { id: 62, city: "968" },
      { id: 63, city: "969" },
      { id: 64, city: "970" },
      { id: 65, city: "971" },
      { id: 66, city: "972" },
      { id: 67, city: "973" },
      { id: 68, city: "974" },
      { id: 69, city: "975" },
      { id: 70, city: "976" },
      { id: 71, city: "977" },
      { id: 72, city: "978" },
      { id: 73, city: "979" },
      { id: 74, city: "980" },
      { id: 75, city: "981" },
      { id: 76, city: "982" },
      { id: 77, city: "983" },
      { id: 78, city: "984" },
      { id: 79, city: "985" },
      { id: 80, city: "986" },
      { id: 81, city: "987" },
      { id: 82, city: "988" },
      { id: 83, city: "989" },
      { id: 84, city: "990" },
    ],
  },
  { id: 5, slug: "birthdate", label: "83" },
  {
    id: 6,
    slug: "gender",
    label: 872,
    options: [
      { id: 0, gender: "872" },
      { id: 1, gender: "887" },
      { id: 2, gender: "886" },
    ],
  },
];

const IdentityInputs = ({ initialKyc = {}, onSubmitSuccess }) => {
  const [identityError, setIdentityError] = useState(false);
  const [, setVideoError] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [nationImageURL, setNationImageURL] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [textVerify, setTextVerify] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [details, setDetails] = useState(initialDetails);
  const [inputValues, setInputValues] = useState({
    fname: initialKyc?.fname || "",
    lname: initialKyc?.lname || "",
    melli_code: initialKyc?.melli_code || "",
    province: initialKyc?.province || "",
    birthdate: initialKyc?.birthdate || "1370/01/01",
    gender: initialKyc?.gender || "",
  });

  const { Request, HTTP_METHOD } = useRequest();
  useEffect(() => {
    setInputValues({
      fname: initialKyc?.fname || "",
      lname: initialKyc?.lname || "",
      melli_code: initialKyc?.melli_code || "",
      province: initialKyc?.province || "",
      birthdate: initialKyc?.birthdate || "1370/01/01",
      gender: initialKyc?.gender || "",
    });

    if (initialKyc?.errors?.length) {
      const errorNames = initialKyc.errors.map((error) => error.message);
      setErrors(errorNames);

      const updatedDetails = initialDetails.map((detail) => {
        if (
          initialKyc.errors
            .map((error) => error.name)
            .includes(`${detail.slug}_err`)
        ) {
          return { ...detail, error: true };
        }
        return detail;
      });

      setDetails(updatedDetails);
    }
  }, [initialKyc]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));

    setErrors((prevErrors) =>
      prevErrors.filter((error) => error !== `${name}_err`),
    );

    setDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail.slug === name ? { ...detail, error: false } : detail,
      ),
    );
  };

  const sendHandler = () => {
    const errorMessages = [];
    const newDetails = [...details];

    if (!inputValues.fname) {
      errorMessages.push("نام وارد نشده است.");
      newDetails[0].error = true;
    } else if (inputValues.fname.length < 3) {
      errorMessages.push("نام وارد شده باید بیشتر از 3 کاراکتر داشته باشد.");
      newDetails[0].error = true;
    } else if (inputValues.fname.length > 32) {
      errorMessages.push("نام وارد شده باید کمتر از 32 کاراکتر داشته باشد.");
      newDetails[0].error = true;
    } else {
      newDetails[0].error = false;
    }

    if (!inputValues.lname) {
      errorMessages.push("نام خانوادگی وارد نشده است.");
      newDetails[1].error = true;
    } else if (inputValues.lname.length < 3) {
      errorMessages.push(
        "نام خانوادگی وارد شده باید بیشتر از 3 کاراکتر داشته باشد.",
      );
      newDetails[1].error = true;
    } else if (inputValues.lname.length > 52) {
      errorMessages.push(
        "نام خانوادگی وارد شده باید بیشتر از 52 کاراکتر داشته باشد.",
      );
      newDetails[1].error = true;
    } else {
      newDetails[1].error = false;
    }

    if (!inputValues.melli_code) {
      errorMessages.push("کد ملی وارد نشده است.");
      newDetails[2].error = true;
    } else if (!verifyIranianNationalId(inputValues.melli_code)) {
      errorMessages.push("کد ملی صحیح نمی باشد.");
      newDetails[2].error = true;
    } else {
      newDetails[2].error = false;
    }

    if (!inputValues.province) {
      errorMessages.push("استان وارد نشده است.");
      newDetails[3].error = true;
    } else {
      newDetails[3].error = false;
    }

    if (!inputValues.birthdate) {
      errorMessages.push("تاریخ تولد وارد نشده است.");
      newDetails[4].error = true;
    } else {
      newDetails[4].error = false;
    }

    if (!inputValues.gender) {
      errorMessages.push("جنسیت انتخاب نشده است.");
      newDetails[5].error = true;
    } else {
      newDetails[5].error = false;
    }

    if (!videoURL) {
      errorMessages.push("ویدیو ضبط نشده است.");
      setVideoError(true);
    } else {
      setVideoError(false);
    }

    if (!nationImageURL) {
      errorMessages.push("تصویر کارت ملی بارگذاری نشده است.");
    }

    setErrors(errorMessages);
    setDetails(newDetails);

    if (errorMessages.length > 0) {
      setIdentityError(true);
      Sentry.captureMessage("Identity verification form validation failed", {
        level: "warning",
        extra: { errors: errorMessages },
      });
      return;
    }

    setIsSending(true);
    const requestData = new FormData();
    requestData.append("fname", inputValues.fname);
    requestData.append("lname", inputValues.lname);
    requestData.append("melli_code", inputValues.melli_code);
    requestData.append("province", inputValues.province);
    requestData.append("birthdate", convertToEnglish(inputValues.birthdate));
    requestData.append("melli_card", nationImageURL);
    requestData.append("video[name]", JSON.parse(uploadResponse).name);
    requestData.append("video[path]", JSON.parse(uploadResponse).path);
    requestData.append("verify_text_id", textVerify.id);
    requestData.append(
      "gender",
      inputValues.gender === "877" ? "male" : "female",
    );
    requestData.append("_method", "put");

    Request("kyc", HTTP_METHOD.POST, requestData, {
      "Content-Type": "multipart/form-data",
    })
      .then(() => {
        onSubmitSuccess?.();
      })
      .catch((error) => {
        Sentry.captureException(error, {
          tags: { section: "identity-verification" },
        });
        ToastError(error.response?.data?.message || "خطا در ارسال اطلاعات");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const isDisabled = !isVideoUploaded;

  return (
    <Container identityError={identityError}>
      <BankContainer>
        {errors.length > 0 && (
          <Alert
            onclick={() => setOpenErrorModal(true)}
            buttonText={getTranslation("882")}
            text={getTranslation("882")}
            info={getTranslation("880")}
            type="error"
          />
        )}
        <Title title={getTranslation("869")} />
        <Inputs
          identityError={identityError}
          data={details}
          inputValues={inputValues}
          handleInputChange={handleInputChange}
        />
        <Upload
          setVideoError={setVideoError}
          setVideoURLParent={setVideoURL}
          setNationImageURL={setNationImageURL}
          uploadResponse={uploadResponse}
          setUploadResponse={setUploadResponse}
          textVerify={textVerify}
          setTextVerify={setTextVerify}
          inputValues={inputValues}
          setIsVideoUploaded={setIsVideoUploaded}
        />
        <Button
          large
          label={getTranslation("877")}
          onclick={sendHandler}
          disabled={isDisabled ? true : isSending ? "pending" : false}
        />
      </BankContainer>
      {openErrorModal && (
        <ErrorModal setOpenErrorModal={setOpenErrorModal} errors={errors} />
      )}
    </Container>
  );
};

export default IdentityInputs;
