import NoteContent from "./NoteContent";
import EditNote from "./edit-note/EditNote";
import styled from "styled-components";

const Container = styled.div``;
const NoteMessages = ({ data, isEditing, setIsEditing, onNoteUpdated }) => {
  return (
    <Container>
      {!isEditing && <NoteContent data={data} />}
      {isEditing && (
        <EditNote
          setIsEditing={setIsEditing}
          data={data}
          onNoteUpdated={onNoteUpdated}
        />
      )}
    </Container>
  );
};

export default NoteMessages;
