// صفحه‌ی انتخاب ملک برای ایجاد سلسله (جستجو روی کد ملک و پایداری، ایجاد سلسله با کلیک روی کارت)؛ مناسب مرحله‌ی establish وقتی کاربر هنوز سلسله ندارد

import styled from "styled-components";
import { useContext, useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import TitleHeader from "../../../../../components/TitleHeader";
import SearchInput from "../../../../../components/SearchInput";
import useRequest from "../../../../../hooks/useRequest.js";
import { UserContext } from "../../../../../services/reducers/UserContext";
import {
  fixNumbers,
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../../services/Utility";

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  white-space: nowrap;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const normalize = (value) =>
  fixNumbers(String(value ?? ""))
    .toLowerCase()
    .trim();

const PropertySelect = ({ data, setData }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [user] = useContext(UserContext);

  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectDynasty = (id) => {
    if (submitting) return;

    if (!user?.verified_kyc) {
      ToastError(getTranslation(1850));
      return;
    }

    setSubmitting(true);

    Request(`dynasty/create/${id}`, HTTP_METHOD.POST).then((response) => {
      setData(response.data.data);
      ToastSuccess(getTranslation(1821));
      () => setSubmitting(false);
    });
  };

  const filteredFeatures = useMemo(() => {
    const features = Object.values(data?.features ?? {});
    const query = normalize(search);

    if (!query) return features;

    return features.filter(
      ({ properties_id, stability }) =>
        normalize(properties_id).includes(query) ||
        normalize(stability).includes(query),
    );
  }, [data?.features, search]);

  return (
    <div>
      <Top>
        <TitleHeader title={getTranslation(809)} />
        <SearchInput
          placeholder={getTranslation(849)}
          value={search}
          onchange={(e) => setSearch(e.target.value)}
        />
      </Top>

      <List>
        {filteredFeatures.map(({ id, properties_id, stability }) => (
          <PropertyCard
            key={id}
            id={id}
            propertyId={properties_id}
            stability={stability}
            label={getTranslation(818)}
            onClick={() => selectDynasty(id)}
          />
        ))}
      </List>
    </div>
  );
};

export default PropertySelect;
