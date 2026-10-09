import { useEffect, useState } from "react";

import nonPhoto from "../../../../assets/images/file.png";
import remove from "../../../../assets/images/remove.png";
import styled from "styled-components";
import Title from "../../../../components/Title";
import { getTranslation } from "../../../../services/Utility";

const Container = styled.div`
  margin-top: 10px;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  justify-content: center;
  gap: 10px;
  border: 1px dashed #454545;
  /* width: 205px; */
  margin-right: 5px;
  height: 142px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 60px;
  }
  @media (min-width: 1366px) {
    /* width: 220px; */
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
  /* width: 100%; */
  /* margin-right: 10px; */
  border-radius: 10px;
`;

const FileImage = styled.img`
  /* width: 200px; */
  width: 100%;

  height: 140px;
  border: 1px solid #454545;
  border-radius: 10px;
  object-fit: contain;
  position: relative;
  margin-bottom: 10px;
  @media (min-width: 1366px) {
    /* width: 220px; */
  }
`;

const RemoveButton = styled.img`
  border: none;
  color: ${(props) => props.theme.colors.newColors.shades.title};
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

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 15px 0;
  @media (min-width: 1366px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SendNote = ({ files, setFiles }) => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const MAX_FILES = 5;

  useEffect(() => {
    const filePreviews = files.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : nonPhoto,
    );
    setPreviews(filePreviews);

    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleDivClick = () => {
    document.getElementById("file-input").click();
  };

  const fileHandler = (event) => {
    const newFiles = Array.from(event.target.files);
    let validFiles = [];
    let sizeExceeded = false;

    newFiles.forEach((file) => {
      const isDuplicate = files.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.size === file.size &&
          existingFile.lastModified === file.lastModified,
      );
      if (file.size > 9 * 1024 * 1024) {
        sizeExceeded = true;
      } else if (!isDuplicate) {
        validFiles.push(file);
      }
    });

    if (sizeExceeded) {
      setError(getTranslation(1643));
      event.target.value = "";
      return;
    } else {
      setError("");
    }

    if (validFiles.length === 0) {
      event.target.value = "";
      setError(getTranslation("1635"));

      return;
    }

    if (files.length + validFiles.length > MAX_FILES) {
      event.target.value = "";
      setError(getTranslation("1636"));
      return;
    }

    setFiles([...files, ...validFiles]);
    event.target.value = "";
  };

  const handleRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <Container>
      <Title title={getTranslation("1362")} />
      <Wrapper>
        {files.length < MAX_FILES && (
          <Div onClick={handleDivClick}>
            <span>+</span>
            <HiddenInput
              id="file-input"
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={fileHandler}
            />
          </Div>
        )}
        {previews.map((preview, index) => (
          <FilePreview key={index}>
            <FileImage src={preview} />
            <RemoveButton src={remove} onClick={() => handleRemove(index)} />
          </FilePreview>
        ))}
      </Wrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default SendNote;
