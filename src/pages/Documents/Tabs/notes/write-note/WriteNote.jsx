import { useRef, useState } from "react";
import styled from "styled-components";
import useRequest from "../../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../../services/Utility";
import LabeledInput from "../../../../../components/LabeledInput.jsx";
import TitleHeader from "../../../../../components/TitleHeader";
import Button from "../../../../../components/Button";
import FileUploader from "../../../../../components/FileUploader/FileUploader.jsx";
import CustomEditor from "../../../../../components/Common/CustomEditor.jsx";

const TITLE_MAX_LENGTH = 200;
const MAX_FILE_SIZE_MB = 5;

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

// این کامپوننت برای فرم ثبت یادداشت جدید (عنوان، توضیحات با ادیتور، پیوست فایل و ذخیره) استفاده میشه و بعد از ثبت موفق، یادداشت جدید رو از طریق onNoteCreated به والد برمیگردونه و به بالای صفحه اسکرول میکنه
const WriteNote = ({ onNoteCreated }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const containerRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const canSubmit = Boolean(title.trim() && description.trim());

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
  };

  // در دسکتاپ خود Container اسکرول داره و در عرض‌های کمتر کل صفحه
  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveNote = () => {
    setIsSending(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", description);
    files.forEach((file) => formData.append("attachments[]", file));

    Request(
      "notes",
      HTTP_METHOD.POST,
      formData,
      {},
      { fallbackMessage: getTranslation(1645) },
    )
      .then((response) => {
        onNoteCreated(response.data.data);
        resetForm();
        scrollToTop();
      })
      .finally(() => setIsSending(false));
  };

  return (
    <Container ref={containerRef}>
      <TitleHeader right title={getTranslation("1354")} />

      <LabeledInput
        label={getTranslation("19")}
        placeholder={getTranslation("19")}
        value={title}
        onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))}
      />

      <CustomEditor
        label={getTranslation("1360")}
        value={description}
        onChange={setDescription}
      />

      <FileUploader
        files={files}
        onFilesChange={setFiles}
        maxFileSizeMB={MAX_FILE_SIZE_MB}
      />

      <Button
        fit
        label={getTranslation("629")}
        onclick={handleSaveNote}
        disabled={!canSubmit ? true : isSending ? "pending" : false}
      />
    </Container>
  );
};

export default WriteNote;