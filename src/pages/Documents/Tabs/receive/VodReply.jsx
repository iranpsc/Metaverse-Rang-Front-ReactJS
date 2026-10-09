import { useState } from "react";
import styled from "styled-components";

import ReplyInput from "../ReplyInput";
import SendFiles from "./SendFiles";
import Button from "../../../../components/Button";
import useRequest from "../../../../services/Hooks/useRequest";
import {
  getTranslation,
  SanitizeHTML, ToastSuccess
} from "../../../../services/Utility";

const Container = styled.div`
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
  padding: 1px 20px 30px 20px;
  border-radius: 10px;
  margin-top: 30px;
`;

const VodReply = ({ responseId, setAllMessages }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const { Request, HTTP_METHOD } = useRequest();

  const handleSendReply = () => {
    const cleanMessage = SanitizeHTML(message);

    if (!cleanMessage) return;

    const formData = new FormData();
    formData.append("response", cleanMessage);

    files.forEach(({ file }) => {
      if (file instanceof File) {
        formData.append("attachments[]", file);
      }
    });

    Request(
      `tickets/response/${responseId}`,
      HTTP_METHOD.POST,
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    )
      .then((response) => {
        const newMessages = response?.data?.data?.messages;

        if (newMessages) {
          setAllMessages(newMessages);
        }

        setMessage("");
        setFiles([]);
        ToastSuccess(getTranslation(1841));
      })
      .catch((error) => {
        console.error("Failed to send reply:", error);
      });
  };

  return (
    <Container>
      <ReplyInput
        message={message}
        setMessage={setMessage}
      />

      <SendFiles
        files={files}
        setFiles={setFiles}
      />

      <Button
        fit
        label={getTranslation("1352")}
        onclick={handleSendReply}
      />
    </Container>
  );
};

export default VodReply;
