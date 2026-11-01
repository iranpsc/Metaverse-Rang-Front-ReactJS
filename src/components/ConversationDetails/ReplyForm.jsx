// فرم پاسخ در انتهای یک گفتگو (ادیتور متن با محدودیت کاراکتر، پیوست فایل و دکمه‌ی ارسال)؛ مناسب هر گفتگویی مثل تیکت که آدرس ارسال را با url می‌گیرد و بعد از موفقیت لیست جدید پیام‌ها را به onSent می‌دهد

import styled from "styled-components";
import { useState } from "react";
import Button from "../Button.jsx";
import CustomEditor from "../Common/CustomEditor.jsx";
import FileUploader from "../FileUploader/FileUploader.jsx";
import useRequest from "../../hooks/useRequest.js";
import { SanitizeHTML,getTranslation } from "../../services/Utility/index.jsx";

const CHAR_LIMIT = 2000;
const MAX_FILE_SIZE_MB = 9;

const Container = styled.div`
  margin-top: 30px;
  padding: 1px 20px 30px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
`;

const ReplyForm = ({ url, onSent }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (value) => {
    if (value.length <= CHAR_LIMIT) setMessage(value);
  };

  const handleSend = () => {
    const cleanMessage = SanitizeHTML(message);
    if (!cleanMessage || isSending) return;

    const formData = new FormData();
    formData.append("response", cleanMessage);
    files.forEach((file) => formData.append("attachments[]", file));

    setIsSending(true);

    Request(url, HTTP_METHOD.POST, formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((response) => {
        onSent(response?.data?.data?.messages);
        setMessage("");
        setFiles([]);
      })
      .catch((error) => console.error("Failed to send reply:", error))
      .finally(() => setIsSending(false));
  };

  return (
    <Container>
      <CustomEditor
        value={message}
        onChange={handleChange}
        label={getTranslation("1351")}
      />

      <FileUploader
        files={files}
        onFilesChange={setFiles}
        maxFileSizeMB={MAX_FILE_SIZE_MB}
      />

      <Button
        fit
        label={getTranslation("1352")}
        onClick={handleSend}
        disabled={isSending ? "pending" : false}
      />
    </Container>
  );
};

export default ReplyForm;