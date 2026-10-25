import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { GlobalNoteStateContext } from "../GlobalNoteStateProvider";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";

import SendNote from "./SendNote";
import WriteNoteInput from "./WriteNoteInput";
import Title from "../../../../components/Title";
import Button from "../../../../components/Button";

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  padding: 20px;
  padding-right: 15px;
  border-radius: 10px;
  @media (min-width: 1366px) {
    overflow-y: auto;
    width: 50%;
  }
`;

const Subject = styled.div`
  input {
    background-color: ${(props) =>
      props.theme.colors.newColors.otherColors.inputBg};
    border: 1px solid #454545;
    border-radius: 5px;
    padding: 10px 12px;
    outline: none;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    width: 95.5%;
    font-size: 16px;
    font-weight: 400;
    width: 100%;
  }
`;

const Label = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const WriteNote = () => {
  const { alert, setAlert } = useContext(AlertContext);
  const { dispatch } = useContext(GlobalNoteStateContext);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false); // حالت لودینگ

  const { Request, HTTP_METHOD } = useRequest();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  const handleSaveNote = () => {
    if (!title.trim() || !description.trim()) {
      setError(getTranslation(1644));
      return;
    }

    if (files.length > 5) {
      setError(getTranslation(1636));
      return;
    }

    setError("");
    setIsSending(true); // شروع لودینگ

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);

    files.forEach((file) => {
      formData.append("attachments[]", file);
    });

    Request("notes", HTTP_METHOD.POST, formData)
      .then((response) => {
        dispatch({
          type: "ADD_NOTE",
          payload: response.data.data,
          position: "start",
        });
        setAlert(true);
        resetForm();
      })
      .catch(() => setError(getTranslation(1645)))
      .finally(() => {
        setIsSending(false); // پایان لودینگ
      });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
  };

  // بررسی غیرفعال بودن دکمه
  const isDisabled = !title.trim() || !description.trim() || files.length > 5;

  return (
    <Container>
      <Title right title={getTranslation("1354")} />
      <Subject>
        <Label>{getTranslation("19")}</Label>
        <input
          type="text"
          placeholder={getTranslation("19")}
          value={title}
          onChange={(e) => title.length < 201 && setTitle(e.target.value)}
        />
      </Subject>
      <WriteNoteInput description={description} onChange={setDescription} />
      <SendNote files={files} setFiles={setFiles} />
      <div>
        <Button
          fit
          label={getTranslation("629")}
          onclick={handleSaveNote}
          disabled={isDisabled ? true : isSending ? "pending" : false}
        />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default WriteNote;
