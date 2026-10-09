import { useMemo, useState, useContext } from "react";
import PropertyCard from "./PropertyCard";
import Title from "../../../../../components/Title";
import { UserContext } from "../../../../../services/reducers/UserContext";
import styled from "styled-components";
import SearchInput from "../../../../../components/SearchInput";
import useRequest from "../../../../../services/Hooks/useRequest";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../../services/Utility";

const Container = styled.div`

`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  gap: 10px;
`;

// تبدیل ارقام فارسی و عربی به انگلیسی تا جستجو با هر کیبوردی کار کنه
const normalize = (value) =>
  String(value ?? "")
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .toLowerCase()
    .trim();

const PropertySelect = ({ data, setData }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [search, setSearch] = useState("");
  const [user] = useContext(UserContext);

  const selectDynasty = (id) => {

    if (!user.verified_kyc) {
      ToastError(getTranslation(1850))
      return;
    }
    Request(`dynasty/create/${id}`, HTTP_METHOD.POST)
      .then((response) => {
        setData({ ...response.data.data });
        ToastSuccess(getTranslation(1821));
      })


      .catch((error) => {
        ToastError(error?.response?.data?.error || "خطایی رخ داد.");
      });
  };

  const filteredFeatures = useMemo(() => {
    const features = data?.features ? Object.values(data.features) : [];
    const query = normalize(search);

    if (!query) return features;

    return features.filter(
      (feature) =>
        normalize(feature.properties_id).includes(query) ||
        normalize(feature.stability).includes(query),
    );
  }, [data?.features, search]);

  return (
    <Container>
      <Top>
        <Title title={getTranslation(809)} />
        <SearchInput
          placeholder={getTranslation(849)}
          onchange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </Top>
      <Div>
        {filteredFeatures.map((feature) => (
          <PropertyCard
            key={feature.id}
            id={feature.id}
            propertyId={feature.properties_id}
            stability={feature.stability}
            label={getTranslation(818)}
            onClick={() => selectDynasty(feature.id)}
          />
        ))}
      </Div>
    </Container>
  );
};

export default PropertySelect;