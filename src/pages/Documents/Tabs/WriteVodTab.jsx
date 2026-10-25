import { useEffect, useRef, useState } from "react";
import Description from "./Description";
import Inputs from "./Inputs";
import SendFiles from "./SendFiles";
import Alert from "../../../components/Alert/Alert";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import {
  getTranslation,
  ToastError,
} from "../../../services/Utility";
import useRequest from "../../../hooks/useRequest.js";
import Container from "../../../components/Common/Container";

const createInitialState = () => ({
  subject: "",
  title: "",
  description: "",
  files: [],
  selectedCitizens: [],
});

const WriteVodTab = () => {
  const [state, setState] = useState(createInitialState);
  const [alert, setAlert] = useState(false);
  const { Request, HTTP_METHOD } = useRequest();
  const containerRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const resetForm = () => {
    setState(createInitialState());
  };
  const sendVod = () => {
    if (!state.subject || !state.title || !state.description) return;

    setIsSending(true);

    const formData = new FormData();

    formData.append("title", state.title);
    formData.append("content", state.description);

    state.files.forEach((file) => {
      formData.append("attachment", file);
    });

    if (state.selectedCitizens.length === 1) {
      formData.append("reciever", state.selectedCitizens[0].id);
    } else if (state.selectedCitizens.length > 1) {
      const citizenIds = state.selectedCitizens.map((citizen) =>
        parseInt(citizen.id)
      );
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
    setState((currentState) => ({ ...currentState, files }));
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
      <Inputs state={state} setState={setState} />
      <Description state={state} setState={setState} />
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