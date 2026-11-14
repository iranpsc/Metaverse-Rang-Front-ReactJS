// تب تبدیل ملک سلسله؛ مناسب صفحه‌ی سلسله برای نمایش املاک قابل‌انتخاب، جستجو بین آن‌ها و تأیید تغییر ملک اصلی از داخل مدال
import styled from "styled-components";
import { useContext, useMemo, useState } from "react";
import Modal from "./Modal";
import PropertyCard from "../dynasty-establish/PropertyCard";
import SearchInput from "../../../../../components/SearchInput";
import TitleHeader from "../../../../../components/TitleHeader";
import useRequest from "../../../../../hooks/useRequest.js";
import { UserContext } from "../../../../../services/reducers/UserContext";
import {
  GetTimeElapsed,
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../../services/Utility";

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  @media (min-width: 840px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
`;

const SearchBox = styled.div`
  width: 100%;

  @media (min-width: 840px) {
    width: 40%;
    max-width: 400px;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  margin-top: 20px;

  @media (min-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Convert = ({ data, setData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // مدال وقتی باز است که ملکی انتخاب شده باشد
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const [user] = useContext(UserContext);

  const filteredFeatures = useMemo(
    () =>
      Object.values(data?.features ?? {}).filter((feature) =>
        feature.properties_id?.toString().includes(searchTerm),
      ),
    [data?.features, searchTerm],
  );

  const handleSelect = (id) => {
    if (!user?.verified_kyc) return ToastError(getTranslation(881));
    if (!checkSecurity()) return;

    setSelectedPropertyId(id);
  };

  const handleConfirm = async () => {
    try {
      const response = await Request(
        `dynasty/${data.id}/update/${selectedPropertyId}`,
        HTTP_METHOD.POST,
      );
      setData(response.data.data);
      ToastSuccess(getTranslation(1502));
    } catch (error) {
      console.error("Error updating dynasty:", error);
    } finally {
      setSelectedPropertyId(null);
    }
  };

  return (
    <>
      <Header>
        <TitleHeader title={getTranslation(809)} noMargin />
        <SearchBox>
          <SearchInput
            placeholder={getTranslation(849)}
            value={searchTerm}
            onchange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </Header>

      <Wrapper>
        {filteredFeatures.map(({ id, properties_id, stability }) => (
          <PropertyCard
            key={id}
            id={id}
            propertyId={properties_id}
            stability={stability}
            label={getTranslation(818)}
            onClick={handleSelect}
          />
        ))}
      </Wrapper>

      {selectedPropertyId !== null && (
        <Modal
          setModal={() => setSelectedPropertyId(null)}
          onConfirm={handleConfirm}
          elapsed={GetTimeElapsed(data?.["dynasty-feature"]?.["last-updated"])}
        />
      )}
    </>
  );
};

export default Convert;
