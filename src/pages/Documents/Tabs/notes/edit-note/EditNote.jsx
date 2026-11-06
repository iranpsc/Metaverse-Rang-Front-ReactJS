import { useState } from "react";
import styled from "styled-components";
import {
  getTranslation,
  getPlainText,
  ToastSuccess,
} from "../../../../../services/Utility";
import Button from "../../../../../components/Button";
import useRequest from "../../../../../hooks/useRequest.js";
import CustomEditor from "../../../../../components/Common/CustomEditor";
import FileUploader from "../../../../../components/FileUploader/FileUploader.jsx";

const MIN_TEXT_LENGTH = 3;
const MAX_FILE_SIZE_MB = 5;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
`;

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
`;

// این کامپوننت برای فرم ویرایش یادداشت (ویرایش توضیحات با ادیتور و مدیریت پیوست‌های قبلی و جدید) استفاده میشه و بعد از ذخیره موفق، یادداشت بروزشده رو از طریق onNoteUpdated به والد برمیگردونه
const EditNote = ({ setIsEditing, data, onNoteUpdated }) => {
  const [description, setDescription] = useState(data.content);
  const [files, setFiles] = useState(data.attachments ?? []);
  const { Request, HTTP_METHOD } = useRequest();

  const isTextValid =
    getPlainText(description).trim().length >= MIN_TEXT_LENGTH;

  const handleSave = () => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", data.title);
    formData.append("content", description);

    // پیوست‌های قبلی (رشته/URL) و فایل‌های جدید (File) جدا ارسال میشن
    const currentAttachments = files.filter((file) => typeof file === "string");
    const newAttachments = files.filter((file) => file instanceof File);

    currentAttachments.forEach((attachment) =>
      formData.append("current_attachments[]", attachment),
    );
    newAttachments.forEach((file) => formData.append("attachments[]", file));

    // برای حذف همه پیوست‌های قبلی، سرور به یک مقدار خالی نیاز داره
    if (currentAttachments.length === 0) {
      formData.append("current_attachments[]", "");
    }

    Request(
      `notes/${data.id}`,
      HTTP_METHOD.POST,
      formData,
      {},
      { fallbackMessage: getTranslation(1646) },
    ).then((response) => {
      const savedNote = response.data.data;
      onNoteUpdated({
        ...data,
        ...savedNote,
        content: savedNote.content ?? description,
        attachments: savedNote.attachments ?? files,
      });
      setIsEditing(false);
      ToastSuccess(getTranslation(1480));
    });
  };

  return (
    <Container>
      <CustomEditor
        label={getTranslation(460)}
        value={description}
        onChange={setDescription}
        border
      />

      <FileUploader
        mode="upload"
        files={files}
        onFilesChange={setFiles}
        maxFileSizeMB={MAX_FILE_SIZE_MB}
      />

      <Buttons>
        <Button
          fit
          label={getTranslation("629")}
          onclick={handleSave}
          disabled={!isTextValid}
        />
        <Button
          grayTheme
          fit
          label={getTranslation("833")}
          onclick={() => setIsEditing(false)}
        />
      </Buttons>
    </Container>
  );
};

export default EditNote;
