// ردیف جدول یادداشت‌ها (شماره، عنوان، حذف و مشاهده جزئیات)؛ مناسب فقط داخل NotesList، و جزئیات یادداشت را در NoteDetails باز می‌کند
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import styled from "styled-components";
import NoteDetails from "./NoteDetails";
import Button from "../../../../components/Button";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";

const TableCell = styled.td`
  padding: 15px 10px;
  border-bottom: 1px solid #454545;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
text-align: start;

  @media (min-width: 845px) {
    padding: 15px 20px;
  }
`;

// عنوان طولانی شکسته می‌شود تا ستون را پهن نکند
const Text = styled.h2`
  font-size: 16px;
  font-weight: 500;
  overflow-wrap: anywhere;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s linear;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.garyBtn};
  color: ${({ theme }) => theme.colors.newColors.otherColors.grayBtnText};

  &:hover {
    background-color: #c30000;
  }

  @media (min-width: 845px) {
    padding: 13px 22px;
  }

  @media (min-width: 1366px) {
    padding: 15px 22px;
  }
`;

const Row = ({ note, onNoteDeleted, onNoteCached, onNoteUpdated }) => {
  const { id, title } = note;
  const [noteDetails, setNoteDetails] = useState(null);
  const { Request, HTTP_METHOD } = useRequest();

  const handleOpenDetails = async () => {
    if ("content" in note && "attachments" in note) {
      setNoteDetails(note);
      return;
    }

    const { data } = await Request(`notes/${id}`);
    setNoteDetails(data.data);
    onNoteCached(data.data);
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
          <Text>{id}#</Text>
        </TableCell>

        <TableCell>
          <Text>{title}</Text>
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