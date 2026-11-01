import { useEffect, useRef, useState } from "react";
import SelectInputs from "./SelectInputs.jsx";
import Alert from "../../../../components/Alert/Alert.jsx";
import Button from "../../../../components/Button.jsx";
import TitleHeader from "../../../../components/TitleHeader.jsx";
import { getTranslation } from "../../../../services/Utility/index.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import Container from "../../../../components/Common/Container.jsx";
import CustomEditor from "../../../../components/Common/CustomEditor.jsx";
import FileUploader from "../../../../components/FileUploader/FileUploader.jsx";

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
  const [sentTitle, setSentTitle] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { Request, HTTP_METHOD } = useRequest();
  const containerRef = useRef(null);

  const resetForm = () => {
    setState(createInitialState());
  };

  const sendVod = async () => {
    if (
      !state.subject ||
      !state.title.trim() ||
      !state.description.trim() ||
      isSending
    ) {
      return;
    }

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
        parseInt(citizen.id, 10),
      );

      formData.append("reciever", JSON.stringify(citizenIds));
    } else {
      formData.append("department", state.subject);
    }

    try {
      await Request("tickets", HTTP_METHOD.POST, formData, {
        "Content-Type": "multipart/form-data",
      });

      setSentTitle(state.title);
      resetForm();
      setAlert(true);

      containerRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error sending ticket:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [alert]);

  const isDisabled =
    !state.subject ||
    !state.title.trim() ||
    !state.description.trim() ||
    isSending;

  return (
    <Container ref={containerRef}>
      <TitleHeader title={getTranslation("1314")} />

      {alert && (
        <Alert
          type="success"
          text={`${getTranslation("1333")} ${sentTitle} ${getTranslation("1334")}`}
        />
      )}

      <SelectInputs state={state} setState={setState} />

      <CustomEditor
        value={state.description}
        onChange={(value) => {
          if (value.length <= 2000) {
            setState((currentState) => ({
              ...currentState,
              description: value,
            }));
          }
        }}
        label={getTranslation("1327")}
        img
      />

      <FileUploader
        title={getTranslation("1328")}
        files={state.files}
        onFilesChange={(files) =>
          setState((currentState) => ({
            ...currentState,
            files,
          }))
        }
        maxFiles={5}
        maxFileSizeMB={9}
        accept="image/*,.pdf,.doc,.docx"
      />

      <Button
        fit
        label={getTranslation("730")}
        onclick={sendVod}
        disabled={isDisabled ? (isSending ? "pending" : true) : false}
      />
    </Container>
  );
};

export default WriteVodTab;
