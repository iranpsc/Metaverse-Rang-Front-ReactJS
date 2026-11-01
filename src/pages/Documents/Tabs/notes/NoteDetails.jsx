import { useState } from "react";
import NoteCard from "./NoteCard";
import NoteMessages from "./NoteMessages";
import ModalLg from "../../../../components/Modal/ModalLg";
import Container from "../../../../components/Common/Container";

const NoteDetails = ({
  data,
  setShowDetails,
  onNoteDeleted,
  onNoteUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ModalLg setShowModal={setShowDetails} titleId={1358}>
      <Container>
        <NoteCard
          data={data}
          onNoteDeleted={onNoteDeleted}
          setShowDetails={setShowDetails}
          setIsEditing={setIsEditing}
        />
        <NoteMessages
          data={data}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onNoteUpdated={onNoteUpdated}
        />
      </Container>
    </ModalLg>
  );
};

export default NoteDetails;
