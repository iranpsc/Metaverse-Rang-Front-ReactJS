import Notes from "./Notes";
import WriteNote from "./write-note/WriteNote";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import { useScrollDirection } from "../../../../hooks/useScrollDirection";
import { useScrollDirectionContext } from "../../../../hooks/useScrollDirectionContext.js";

const updateNote = (notes, updatedNote) =>
  notes.map((note) =>
    note.id === updatedNote.id ? { ...note, ...updatedNote } : note,
  );

const Container = styled.div`
  padding: 20px 0;
  width: 100%;
  display: flex;
  gap: 15px;
  overflow-y: auto;
  flex-direction: column;
  @media (max-height: 500px) and (max-width: 1000px) {
    padding-bottom: 60px;
  }
  @media (min-width: 1366px) {
    flex-direction: row;
  }
`;

const NotesListTab = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();
  const { updateScrollDirection } = useScrollDirectionContext();

  const ref = useRef(null);
  const isScrollingDown = useScrollDirection(ref);

  useEffect(() => {
    updateScrollDirection(isScrollingDown);
  }, [isScrollingDown, updateScrollDirection]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await Request("notes");
        setNotes(response.data.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <Container ref={ref}>
      <WriteNote
        onNoteCreated={(note) => setNotes((current) => [note, ...current])}
      />
      <Notes
        notes={notes}
        isLoading={loading}
        onNoteDeleted={(id) =>
          setNotes((current) => current.filter((note) => note.id !== id))
        }
        onNoteCached={(noteDetails) =>
          setNotes((current) => updateNote(current, noteDetails))
        }
        onNoteUpdated={(updatedNote) =>
          setNotes((current) => updateNote(current, updatedNote))
        }
      />
    </Container>
  );
};

export default NotesListTab;
