import { useState, useEffect } from "react";

import Title from "../../../../components/Title";
import remove from "../../../../assets/images/remove.png";
import styled from "styled-components";
import { useReportsGlobalState } from "../../../../hooks/useReportsGlobalState";
import { getTranslation } from "../../../../services/Utility/index";
import ErrorMessage from "../../../../components/ErrorMessage";
const Files = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px 0;
`;

const Container = styled.div`
  margin-top: 10px;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px dashed #454545;
  width: 220px;
  height: 140px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  span {
    color: #a0a0ab;
    font-size: 60px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FilePreview = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  margin-right: 10px;
  border-radius: 10px;
`;

const FileImage = styled.img`
  width: 220px;
  height: 140px;
  border: 1px solid #454545;
  border-radius: 10px;
  object-fit: contain;
  position: relative;
  margin-bottom: 5px;
`;

const RemoveButton = styled.img`
  border: none;
  color: white;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  left: 5px;
  bottom: 10px;
`;
const SendFiles = () => {
  const { state, dispatch } = useReportsGlobalState();
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE_MB = 1;
  useEffect(() => {
    if (state.files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = state.files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}`,
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [state.files]);

  const fileHandler = (e) => {
    setError("");
    const selectedFiles = Array.from(e.target.files);

    const newUniqueFiles = selectedFiles.filter((file) => {
      const isDuplicate = state.files.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified,
      );
      return !isDuplicate;
    });

    if (newUniqueFiles.length < selectedFiles.length) {
      setError(getTranslation(1635));
    }

    if (newUniqueFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const remainingSlots = 5 - state.files.length;
    const filesToAdd = newUniqueFiles.slice(0, remainingSlots);

    if (newUniqueFiles.length > remainingSlots) {
      setError(getTranslation(1636));
    }

    for (const file of filesToAdd) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(getTranslation(1482));
        e.target.value = "";
        return;
      }
    }

    const newPreviews = filesToAdd.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "nonPhoto",
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    dispatch({ type: "SET_FILES", payload: [...state.files, ...filesToAdd] });

    e.target.value = "";
  };
  const removeFile = (id) => {
    const fileToRemove = previews.find((item) => item.id === id);
    if (fileToRemove && fileToRemove.preview.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedPreviews = previews.filter((item) => item.id !== id);
    const updatedFiles = updatedPreviews.map((item) => item.file);
    setPreviews(updatedPreviews);
    dispatch({ type: "SET_FILES", payload: updatedFiles });
  };

  const handleDivClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <Container>
      <Title title={getTranslation("21")} />
      <Files>
        {previews.map((item) => (
          <FilePreview key={item.id}>
            <FileImage src={item.preview} alt="file-preview" />
            <RemoveButton
              src={remove}
              alt="remove"
              width={36}
              height={36}
              onClick={() => removeFile(item.id)}
            />
          </FilePreview>
        ))}

        {state.files.length < 5 && (
          <Div onClick={handleDivClick}>
            <span>+</span>
            <HiddenInput
              id="file-input"
              type="file"
              accept="image/*"
              onChange={fileHandler}
              multiple
            />
          </Div>
        )}
      </Files>
      <ErrorMessage errors={[error]} />{" "}
      
    </Container>
  );
};

export default SendFiles;
