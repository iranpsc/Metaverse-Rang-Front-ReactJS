import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import NoteDetails from "./NoteDetails";
import Button from "../../../../components/Button";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";

const TableCell = styled.td`
  padding: 15px 30px 15px 7px;
  border-bottom: 1px solid #454545;
  color: ${(props) => props.theme.colors.newColors.shades.title};

  @media (min-width: 845px) {
    padding: 15px 20px;
  }
`;

const CellContent = styled.div`
  width: fit-content;
  padding-right: ${({ $indent }) => ($indent ? "25px" : "0")};
`;

const Code = styled.h2`
  font-size: 16px;
  font-weight: 500;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeleteButton = styled.button`
  padding: 13px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.garyBtn};
  color: ${(props) => props.theme.colors.newColors.otherColors.grayBtnText};
  transition: all 0.2s linear;
  cursor: pointer;

  &:hover {
    background-color: #c30000;
  }

  @media (min-width: 1366px) {
    padding: 15px 22px;
  }
`;

// این کامپوننت برای نمایش یک ردیف یادداشت در جدول (شماره، عنوان، دکمه حذف و مشاهده جزئیات) استفاده میشه و جزئیات یادداشت رو در NoteDetails باز میکنه
const Row = ({
  id,
  title,
  note,
  onNoteDeleted,
  onNoteCached,
  onNoteUpdated,
}) => {
  const [noteDetails, setNoteDetails] = useState(null);
  const { Request, HTTP_METHOD } = useRequest();

  const handleOpenDetails = async () => {
    const hasDetails =
      Object.prototype.hasOwnProperty.call(note, "content") &&
      Object.prototype.hasOwnProperty.call(note, "attachments");

    if (hasDetails) {
      setNoteDetails(note);
      return;
    }

    const response = await Request(`notes/${id}`);
    const fetchedDetails = response.data.data;
    setNoteDetails(fetchedDetails);
    onNoteCached(fetchedDetails);
  };

  const handleDelete = async () => {
    await Request(`notes/${id}`, HTTP_METHOD.DELETE);
    onNoteDeleted(id);
  };

  const handleCloseDetails = (show) => {
    if (!show) setNoteDetails(null);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNoteDetails(updatedNote);
    onNoteUpdated(updatedNote);
  };

  return (
    <>
      <tr>
        <TableCell>
          <CellContent>
            <Code>{id}#</Code>
          </CellContent>
        </TableCell>

        <TableCell>
          <CellContent $indent>
            <Code>{title}</Code>
          </CellContent>
        </TableCell>

        <TableCell>
          <Buttons>
            <DeleteButton type="button" onClick={handleDelete}>
              <FiTrash2 size={20} />
            </DeleteButton>
            <Button
              label={getTranslation("147")}
              grayTheme
              onclick={handleOpenDetails}
            />
          </Buttons>
        </TableCell>
      </tr>

      {noteDetails && (
        <NoteDetails
          data={noteDetails}
          setShowDetails={handleCloseDetails}
          onNoteDeleted={onNoteDeleted}
          onNoteUpdated={handleNoteUpdated}
        />
      )}
    </>
  );
};

export default Row;
