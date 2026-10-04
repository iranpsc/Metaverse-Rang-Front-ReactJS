import remove from "../../../../assets/images/remove.png";
import styled from "styled-components";
import { useState } from "react";
import Title from "../../../../components/Title";
import { getTranslation, ToastError } from "../../../../services/Utility";
import fileIcon from "../../../../assets/images/file.png";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  left: 5px;
  bottom: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin: 10px 0;
`;

const SendFiles = ({ files, setFiles }) => {
  const [error, setError] = useState("");

  const fileHandler = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.some((file) => file.size > MAX_FILE_SIZE)) {
      ToastError(getTranslation(1846));
      e.target.value = "";
      return;
    }

    if (files.length + selectedFiles.length > 5) {
      setError(getTranslation("1636"));
      return;
    }

    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setError("");

    e.target.value = null;
  };

  const removeFile = (index) => {
    const fileToRemove = files[index];

    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    setFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const handleDivClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <Container>
      <Title title={getTranslation("1328")} />

      <Files>
        {files.map((file, index) => (
          <FilePreview key={`${file.name}-${index}`}>
            <FileImage
              src={file.file?.type?.startsWith("image/") ? file.url : fileIcon}
              alt={`file-preview-${index}`}
            />

            <RemoveButton
              src={remove}
              alt="remove"
              width={36}
              height={36}
              onClick={() => removeFile(index)}
            />
          </FilePreview>
        ))}

        {files.length < 5 && (
          <Div onClick={handleDivClick}>
            <span>+</span>

            <HiddenInput
              id="file-input"
              type="file"
              multiple
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
