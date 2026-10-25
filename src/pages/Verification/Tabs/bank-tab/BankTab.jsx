import BankCardsUpload from "./BankCardsUpload";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Title from "../../../../components/Title";
import Alert from "../../../../components/Alert/Alert";
import ErrorModal from "../ErrorModal";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const BankTab = () => {
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState([]);
  const [cards, setCards] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [loading, setLoading] = useState(true); // اضافه شد

  const { Request } = useRequest();

  useEffect(() => {
    setLoading(true);
    Request("bank-accounts")
      .then((response) => {
        setCards(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching bank accounts:", error);
        setCards([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title title={getTranslation("888")} />
        {isError && (
          <Alert
            onclick={() => setOpenErrorModal(true)}
            buttonText={getTranslation("882")}
            text={getTranslation("892")}
            info={getTranslation("891")}
            type="error"
          />
        )}
        <BankCardsUpload
          setOpenAddModal={setOpenAddModal}
          openAddModal={openAddModal}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          cards={cards}
          setCards={setCards}
          setIsError={setIsError}
          isLoading={loading}
        />
      </Wrapper>
      {openErrorModal && (
        <ErrorModal setOpenErrorModal={setOpenErrorModal} errors={errors} />
      )}
    </Container>
  );
};

export default BankTab;