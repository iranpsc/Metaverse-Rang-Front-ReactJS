import { useRef, useState } from "react";

import nonPhoto from "../../../assets/images/file.png";
import remove from "../../../assets/images/remove.png";
import styled from "styled-components";
import Title from "../../../components/Title";
import { getTranslation } from "../../../services/Utility";

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

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  left: 5px;
  bottom: 10px;
  z-index: 1;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin: 10px 0;
`;
const SendFiles = ({ files = [], onFilesChange }) => {
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE_MB = 9;
  const MAX_FILES = 5;

  const fileHandler = (e) => {
    setError("");
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(getTranslation("1636"));
      e.target.value = null;
      return;
    }

    const invalidFile = selectedFiles.find(f => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);

    if (invalidFile) {
      setError(getTranslation("1643"));
      return;
    }

    onFilesChange([...files, ...selectedFiles]);
    e.target.value = null; 
  };

  const removeFile = (indexToRemove) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  };

  const getPreview = (file) => {
    if (typeof file === "string") return file;

    if (file instanceof File && file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }

    return nonPhoto;
  };

  return (
    <Container>
      <Title title={getTranslation("1328")} />
      <Files>
        {files.map((file, index) => (
          <FilePreview key={index}>
            <FileImage src={getPreview(file)} alt={`preview-${index}`} />
            <RemoveButton
              type="button"
              aria-label={getTranslation("738")}
              onClick={() => removeFile(index)}
            >
              <img src={remove} alt="" width={36} height={36} />
            </RemoveButton>
          </FilePreview>
        ))}
        {files.length < MAX_FILES && (
          <Div onClick={() => fileInputRef.current.click()}>
            <span>+</span>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={fileHandler}
            />
          </Div>
        )}
      </Files>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default SendFiles;