import { useState, useCallback } from "react";
import CitizenCard from "./CitizenCard";
import { RiUserUnfollowLine, RiLoader4Line } from "react-icons/ri";

import Button from "../../../../../components/Button";
import Title from "../../../../../components/Title";
import SearchInput from "../../../../../components/SearchInput";
import useRequest from "../../../../../services/Hooks/useRequest";
import {
  getTranslation,
  ToastError,
} from "../../../../../services/Utility";
import {
  Container,
  Header,
  Citizens,
  Buttons,
  SelectButton,
  IconWrapper, 
} from "./styles/CitizenInvite.styles";
import SubmitDynastyModal from "./SubmitDynastyModal";

const CitizenInvite = ({ setMode, memberType, members, setMembers }) => {
  const [searched, setSearched] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [citizens, setCitizens] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { Request, HTTP_METHOD } = useRequest();

  const handleSearch = useCallback(
    async (e) => {
      const searchTerm = e.target.value;
      setSearched(searchTerm);

      if (!searchTerm) {
        setCitizens([]);
        return;
      }

      setIsSearching(true); // شروع جستجو
      try {
        const response = await Request("dynasty/search", HTTP_METHOD.POST, {
          searchTerm,
        });
        setCitizens(response.data.data);
      } catch (error) {
        console.error(error);
        ToastError("خطا در جستجوی کاربر");
        setCitizens([]);
      } finally {
        setIsSearching(false); // پایان جستجو
      }
    },
    [Request],
  );

  const handleCitizenClick = useCallback((citizen) => {
    if (!citizen.verified) {
      ToastError(
        getTranslation("1442"),
      );
      setSelectedCitizen(null);
      return;
    }
    setSelectedCitizen((prevSelected) =>
      prevSelected?.id === citizen.id ? null : citizen,
    );
  }, []);

  const closeModal = useCallback(() => {
    setOpenDetails(false);
    setSelectedCitizen(null);
  }, []);

  const renderDetailsModal = () => {
    if (!openDetails || !selectedCitizen) return null;

    return (
      <SubmitDynastyModal
        setOpenDetails={closeModal}
        selectedCitizen={selectedCitizen}
        members={members}
        setMembers={setMembers}
        setMode={setMode}
        memberType={memberType}
      />
    );
  };
  return (
    <>
      <Container>
        <Header>
          <Title title={getTranslation(832)} />
          <SearchInput
            value={searched}
            placeholder={getTranslation(831)}
            onchange={handleSearch}
          />
        </Header>
        <Citizens>
          {citizens?.map((citizen) => (
            <CitizenCard
              key={citizen.id}
              onClick={() => handleCitizenClick(citizen)}
              isSelected={selectedCitizen?.id === citizen.id}
              {...citizen}
            />
          ))}
        </Citizens>
        {isSearching ? (
          <IconWrapper>
            <RiLoader4Line size={40} className="spin" />
          </IconWrapper>
        ) : searched && citizens?.length === 0 ? (
          <IconWrapper>
            <RiUserUnfollowLine size={40} />
          </IconWrapper>
        ) : null}
        <Buttons>
          <SelectButton
            disabled={!selectedCitizen || !selectedCitizen.verified}
            onClick={() => selectedCitizen && setOpenDetails(true)}
          >
            {getTranslation(132)}
          </SelectButton>
          <Button
            fit
            color="#C30000"
            textColor="#FFFFFF"
            label={getTranslation(833)}
            onclick={() => setMode({ mode: 1, type: null })} // Modified to pass correct object structure
          />
        </Buttons>
      </Container>
      {renderDetailsModal()}
    </>
  );
};

export default CitizenInvite;
