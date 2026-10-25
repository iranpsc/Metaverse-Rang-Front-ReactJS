import { GlobalNoteStateContext } from "../GlobalNoteStateProvider";
import Notes from "./Notes";
import WriteNote from "./WriteNote";
import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import { useScrollDirection } from "../../../../hooks/useScrollDirection";
import { useScrollDirectionContext } from "../../../../hooks/useScrollDirectionContext.js";

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
  const { state, dispatch } = useContext(GlobalNoteStateContext);
  const [loading, setLoading] = useState(true); // اضافه شد
  const { Request } = useRequest();
  const { updateScrollDirection } = useScrollDirectionContext();

  const ref = useRef(null);
  const isScrollingDown = useScrollDirection(ref);

  useEffect(() => {
    updateScrollDirection(isScrollingDown);
  }, [isScrollingDown, updateScrollDirection]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true); // اضافه شد
      try {
        const response = await Request("notes");
        const fetchedNotes = response.data.data;
        fetchedNotes.forEach((note) =>
          dispatch({ type: "ADD_NOTE", payload: note }),
        );
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false); // اضافه شد
      }
    };
    fetchNotes();
  }, []);

  return (
    <Container ref={ref}>
      <WriteNote />
      <Notes notes={state.notes} isLoading={loading} />
    </Container>
  );
};

export default NotesListTab;