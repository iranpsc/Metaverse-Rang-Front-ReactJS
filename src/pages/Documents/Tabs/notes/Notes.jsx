import NotesList from "./NotesList";
import styled from "styled-components";
import { useState } from "react";
import SearchInput from "../../../../components/SearchInput";
import TitleHeader from "../../../../components/TitleHeader";
import { getTranslation } from "../../../../services/Utility";

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  padding: 20px;
  padding-right: 15px;
  border-radius: 10px;

  @media (min-width: 1366px) {
    overflow-y: auto;
    width: 75%;
  }
`;

const Notes = ({
  notes,
  isLoading,
  onNoteDeleted,
  onNoteCached,
  onNoteUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes =
    notes?.filter((note) =>
      note?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <Container>
      <TitleHeader title={getTranslation("1355")} />
      <SearchInput
        placeholder={getTranslation("1356")}
        onchange={(e) => setSearchTerm(e.target.value)}
      />
      <NotesList
        notes={filteredNotes}
        isLoading={isLoading}
        onNoteDeleted={onNoteDeleted}
        onNoteCached={onNoteCached}
        onNoteUpdated={onNoteUpdated}
      />
    </Container>
  );
};

export default Notes;
