import Modal from "./Modal";

import PropertyCard from "../dynasty-establish/PropertyCard";
import SearchInput from "../../../../../components/SearchInput";
import Title from "../../../../../components/Title";
import styled from "styled-components";
import { useState, useCallback, useMemo, useContext } from "react";
import useRequest from "../../../../../services/Hooks/useRequest";
import { useNavigate } from "react-router";
import {
  getTranslation,
  ToastSuccess, ToastError, GetTimeElapsed
} from "../../../../../services/Utility";
import { UserContext } from "../../../../../services/reducers/UserContext";
// Combine styled components
const Styledcomponents = {
  Container: styled.div``,
  Wrapper: styled.div`
    display: grid;
    gap: 10px;
    margin-top: 20px;

    grid-template-columns: 1fr;
    @media (min-width: 992px) {
      grid-template-columns: 1fr 1fr;
    }
  `,
  Header: styled.div`
    display: flex;
    align-items: center;
        margin-top: 10px;

    justify-content: space-between;
  `,
};

const Convert = ({ data, setData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const lastUpdated = data?.["dynasty-feature"]?.["last-updated"];

  const elapsed = GetTimeElapsed(lastUpdated);

  // Memoize filtered features
  const filteredFeatures = useMemo(() => {
    if (!data?.features) return [];
    return Object.values(data.features).filter((feature) =>
      feature.properties_id?.toString().includes(searchTerm),
    );
  }, [data?.features, searchTerm]);
  // Use useCallback for event handlers
  const updateDynasty = useCallback((id) => {
    if (!user.verified_kyc) {
      ToastError(getTranslation(881))
      return;
    }

    if (!checkSecurity()) return;

    setSelectedPropertyId(id);
    setModal(true);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      const response = await Request(
        `dynasty/${data.id}/update/${selectedPropertyId}`,
        HTTP_METHOD.POST,
      );
      setData(response.data.data);
      ToastSuccess(getTranslation(1502));

      setModal(false);
    } catch (error) {
      console.error("Error updating dynasty:", error);
      setModal(false);
    }
  }, [data.id, selectedPropertyId, navigate]);

  return (
    <Styledcomponents.Container>
      <Styledcomponents.Header>
        <Title title={getTranslation(809)} />
        <SearchInput
          placeholder={getTranslation(849)}
          onchange={(e) => handleSearch(e.target.value)}
          value={searchTerm}
        />
      </Styledcomponents.Header>
      <Styledcomponents.Wrapper>
        {filteredFeatures.map((feature) => (
          <PropertyCard
            key={feature.id}
            id={feature.id}
            area={feature.area}
            propertyId={feature.properties_id}
            stability={feature.stability}
            label={getTranslation(818)}
            onClick={updateDynasty}
          />
        ))}
      </Styledcomponents.Wrapper>
      {modal && (
        <Modal
          setModal={setModal}
          onConfirm={handleConfirm}
          elapsed={elapsed}
        />
      )}
    </Styledcomponents.Container>
  );
};

export default Convert;
