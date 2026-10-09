import { useContext, useEffect, useRef, useState } from "react";
import Description from "./Description";
import Inputs from "./Inputs";
import SendFiles from "./SendFiles";
import { useGlobalState } from "./GlobalVodStateProvider";
import Alert from "../../../components/Alert/Alert";
import Button from "../../../components/Button";
import { AlertContext } from "../../../services/reducers/AlertContext";
import Title from "../../../components/Title";
import {
  getTranslation,
  ToastError,
} from "../../../services/Utility";
import useRequest from "../../../services/Hooks/useRequest";
import Container from "../../../components/Common/Container";

const WriteVodTab = () => {
  const { state, dispatch } = useGlobalState();
  const { alert, setAlert } = useContext(AlertContext);
  const { Request, HTTP_METHOD } = useRequest();
  const containerRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const resetForm = () => {
    dispatch({ type: "SET_SUBJECT", payload: "" });
    dispatch({ type: "SET_TITLE", payload: "" });
    dispatch({ type: "SET_DESCRIPTION", payload: "" });
    dispatch({ type: "SET_FILES", payload: [] });
    dispatch({ type: "SET_SELECTED_CITIZENS", payload: [] });
  };
const sendVod = () => {
  if (!state.subject || !state.title || !state.description) return;

  setIsSending(true);

  const formData = new FormData();

  formData.append("title", state.title);
  formData.append("content", state.description);

  // همه‌ی فایل‌ها، نه فقط اولی
  state.files.forEach((file) => {
    formData.append("attachment", file);
  });

  if (state.selectedCitizens.length === 1) {
    formData.append("reciever", state.selectedCitizens[0].id);
  } else if (state.selectedCitizens.length > 1) {
    const citizenIds = state.selectedCitizens.map((citizen) => parseInt(citizen.id));
    formData.append("reciever", JSON.stringify(citizenIds));
  } else {
    formData.append("department", state.subject);
  }

  Request("tickets", HTTP_METHOD.POST, formData, {
    "Content-Type": "multipart/form-data",
  })
    .then(() => {
      containerRef.current?.scrollTo(0, 0);
      resetForm();
      setAlert(true);
    })
    .catch((error) => {
      ToastError(error.response?.data?.message || "خطا در ارسال تیکت");
    })
    .finally(() => {
      setIsSending(false);
    });
};
  const handleFilesChange = (files) => {
    dispatch({ type: "SET_FILES", payload: files });
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  // بررسی غیرفعال بودن دکمه
  const isDisabled = !(
    state.subject &&
    state.title &&
    state.description 
  );

  return (
    <Container ref={containerRef}>
      <Title title={getTranslation("1314")} right />
      {alert && (
        <Alert
          type="success"
          text={`${getTranslation("1333")} ${
            state.title
          } ${getTranslation("1334")}`}
        />
      )}
      <Inputs />
      <Description />
      <SendFiles files={state.files} onFilesChange={handleFilesChange} />

      <Button 
        fit 
        label={getTranslation("730")}
        onclick={sendVod}
        disabled={isDisabled ? true : isSending ? "pending" : false}
      />
    </Container>
  );
};

export default WriteVodTab;