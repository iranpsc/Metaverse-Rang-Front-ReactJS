import { useContext, useState } from "react";
import {
  getTranslation,
  getPlainText, ToastError, ToastSuccess
} from "../../../../services/Utility";
import { GlobalNoteStateContext } from "../GlobalNoteStateProvider";
import SendFiles from "../SendFiles";
import styled from "styled-components";
import Button from "../../../../components/Button";
import useRequest from "../../../../services/Hooks/useRequest";
import CustomEditor from "../../../../components/Common/CustomEditor";
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

const EditNote = ({ setIsEditing, data }) => {
  const { dispatch } = useContext(GlobalNoteStateContext);
  const [localDescription, setLocalDescription] = useState(data.content);
  const [localFiles, setLocalFiles] = useState(data.attachments);
  const { Request, HTTP_METHOD } = useRequest();

  const handleSave = () => {

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", data.title);
    formData.append("content", localDescription);

    const currentAttachments = localFiles.filter(
      (file) => typeof file === "string",
    );
    const newAttachments = localFiles.filter((file) => file instanceof File);

    currentAttachments.forEach((attachment) => {
      formData.append("current_attachments[]", attachment);
    });
    newAttachments.forEach((file) => {
      formData.append("attachments[]", file);
    });

    if (currentAttachments.length === 0) {
      formData.append("current_attachments[]", "");
    }

    Request(`notes/${data.id}`, HTTP_METHOD.POST, formData)
      .then((response) => {
        dispatch({
          type: "UPDATE_NOTE",
          payload: response.data.data,
        });
        setIsEditing(false);
        ToastSuccess(getTranslation(1480));
      })
      .catch((err) => {
        console.error("Update Error:", err);
        ToastError(getTranslation(1646));
      });
  };

  const plainText = getPlainText(localDescription);
  const trimmedText = plainText.trim();
  const isTextValid = trimmedText.length >= 3;

  return (
    <Container>
      <CustomEditor
        label={getTranslation(460)}
        value={localDescription}
        onChange={(newDescription) => setLocalDescription(newDescription)}
        border={true}
        minLengthLock={true}
      />
      <SendFiles
        files={localFiles}
        onFilesChange={(newFiles) => setLocalFiles(newFiles)}
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
