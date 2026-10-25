import Item from "./Item";

import styled from "styled-components";
import { useEffect, useState } from "react";
import SearchInput from "../../../../components/SearchInput";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";
import SkeletonGrid from "../../../../components/Common/SkeletonGrid";

const Wrapper = styled.div`
  display: grid;
  margin-top: 20px;
  padding-bottom: 20px;
  grid-template-columns: 1fr;
  align-items: flex-start;
  gap: 20px;
  @media (min-width: 1400px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1900px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const SkeletonContainer = styled.div`
  margin-top: 0px;
`;

const items = [
  {
    id: 1,
    translationId: "643",
    options: [
      {
        id: 1,
        translationId: "644",
        key: "nationality",
      },
      {
        id: 2,
        translationId: "645",
        key: "fname",
      },
      {
        id: 3,
        translationId: "646",
        key: "lname",
      },
      {
        id: 4,
        translationId: "83",
        key: "birthdate",
      },
      {
        id: 5,
        translationId: "84",
        key: "phone",
      },
      {
        id: 6,
        translationId: "85",
        key: "email",
      },
      {
        id: 7,
        translationId: "59",
        key: "address",
      },
      {
        id: 8,
        translationId: "647",
        key: "name",
      },
    ],
  },
  {
    id: 2,
    translationId: "254",
    options: [
      {
        id: 1,
        translationId: "259",
        key: "about",
      },
      {
        id: 2,
        translationId: "648",
        key: "registered_at",
      },
      {
        id: 3,
        translationId: "649",
        key: "position",
      },
      {
        id: 4,
        translationId: "650",
        key: "score",
      },
      {
        id: 5,
        translationId: "154",
        key: "licenses",
      },
      {
        id: 6,
        translationId: "651",
        key: "license_score",
      },
      {
        id: 7,
        translationId: "652",
        key: "avatar",
      },
      {
        id: 8,
        translationId: "86",
        key: "occupation",
      },
      {
        id: 9,
        translationId: "479",
        key: "education",
      },
      {
        id: 10,
        translationId: "653",
        key: "loved_city",
      },
      {
        id: 11,
        translationId: "654",
        key: "loved_country",
      },
      {
        id: 12,
        translationId: "655",
        key: "loved_language",
      },
      {
        id: 13,
        translationId: "656",
        key: "prediction",
      },
      {
        id: 14,
        translationId: "93",
        key: "memory",
      },
      {
        id: 15,
        translationId: "94",
        key: "passions",
      },
    ],
  },
  {
    id: 3,
    translationId: "58",
    options: [
      {
        id: 1,
        translationId: "657",
        key: "amoozeshi_features",
      },
      {
        id: 2,
        translationId: "659",
        key: "tejari_features",
      },
      {
        id: 3,
        translationId: "660",
        key: "gardeshgari_features",
      },
      {
        id: 4,
        translationId: "661",
        key: "fazasabz_features",
      },
      {
        id: 5,
        translationId: "662",
        key: "behdashti_features",
      },
      {
        id: 6,
        translationId: "663",
        key: "edari_features",
      },
      {
        id: 7,
        translationId: "664",
        key: "nemayeshgah_features",
      },
    ],
  },
  {
    id: 4,
    translationId: "665",
    options: [
      {
        id: 1,
        translationId: "666",
        key: "followers",
      },
      {
        id: 2,
        translationId: "668",
        key: "following",
      },
      {
        id: 3,
        translationId: "669",
        key: "following_count",
      },
    ],
  },
  {
    id: 5,
    translationId: "670",
    options: [
      {
        id: 1,
        translationId: "671",

        key: "establish_store_license",
      },
      {
        id: 2,
        title: "permission to create a union",
        key: "establish_union_license",
      },
      {
        id: 3,
        title: "permission to create a taxi service",
        key: "establish_taxi_license",
      },
      {
        id: 4,
        translationId: "674",
        key: "establish_amoozeshgah_license",
      },
      {
        id: 5,
        translationId: "675",
        key: "reporter_license",
      },
      {
        id: 6,
        translationId: "676",
        key: "cooporation_license",
      },
      {
        id: 7,
        translationId: "677",
        key: "developer_license",
      },
      {
        id: 8,
        translationId: "678",
        key: "inspection_license",
      },
      {
        id: 9,
        translationId: "679",
        key: "trading_license",
      },
      {
        id: 10,
        title: "attorney's license",
        key: "lawyer_license",
      },
      {
        id: 11,
        title: "mayor's license",
        key: "city_council_license",
      },
      {
        id: 12,
        title: "governor's license",
        key: "governer_license",
      },
    ],
  },
  {
    id: 6,
    translationId: "61",
    options: [
      {
        id: 1,
        translationId: "685",
        key: "irr_transactions",
        value: true,
      },
      {
        id: 2,
        translationId: "686",
        key: "psc_transactions",
      },
      {
        id: 3,
        translationId: "687",
        key: "blue_transactions",
      },
      {
        id: 4,
        translationId: "688",
        key: "yellow_transactions",
      },
      {
        id: 5,
        translationId: "689",
        key: "red_transactions",
      },
      {
        id: 6,
        translationId: "692",
        key: "sold_products",
      },
      {
        id: 7,
        translationId: "691",
        key: "bought_products",
      },
    ],
  },
  {
    id: 7,
    translationId: "694",
    options: [
      {
        id: 1,
        translationId: "695",
        key: "recieved_irr_prizes",
      },
      {
        id: 2,
        translationId: "696",
        key: "recieved_psc_prizes",
      },
      {
        id: 3,
        translationId: "697",
        key: "recieved_yellow_prizes",
      },
      {
        id: 4,
        translationId: "698",
        key: "recieved_blue_prizes",
      },
      {
        id: 5,
        translationId: "699",
        key: "recieved_red_prizes",
      },
    ],
  },
  {
    id: 8,
    translationId: "704",
    options: [
      {
        id: 1,
        translationId: "705",
        key: "bought_golden_keys",
      },
      {
        id: 2,
        translationId: "705",
        key: "used_golden_keys",
      },
    ],
  },
  {
    id: 9,
    translationId: "708",
    options: [
      {
        id: 1,
        translationId: "709",
        key: "bought_golden_keys",
      },
      {
        id: 2,
        translationId: "710",
        key: "notice",
      },
      {
        id: 3,
        translationId: "711",
        key: "violation_of_the_rules",
      },
      {
        id: 4,
        translationId: "712",
        key: "warning",
      },
      {
        id: 5,
        translationId: "713",
        key: "negative_points",
      },
    ],
  },

  {
    id: 10,
    translationId: "714",
    options: [
      {
        id: 1,
        translationId: "715",
        key: "dynasty_members_photo",
      },
      {
        id: 2,
        translationId: "716",
        key: "dynasty_members_info",
      },
      {
        id: 3,
        translationId: "717",
        key: "recieved_dynasty_satisfaction_prizes",
      },
      {
        id: 4,
        translationId: "718",
        key: "recieved_dynasty_referral_profit_prizes",
      },
      {
        id: 5,
        translationId: "719",
        key: "recieved_satisfaction_prizes",
      },
      {
        id: 6,
        translationId: "719",
        key: "recieved_satisfaction_prizes",
      },
    ],
  },
];

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SecurityTab = () => {
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState("");
  const [privacy, setPrivacy] = useState({});
  const [itemsWithValues, setItemsWithValues] = useState([]);

  const searchedItems = itemsWithValues.filter((item) => {
    const filteredOptions = item.options.filter((option) =>
      option.translationId
        ? getTranslation(option.translationId)
            ?.toLowerCase()
            ?.includes(searched.toLowerCase()) ||
          getTranslation(item.translationId)
            ?.toLowerCase()
            ?.includes(searched.toLowerCase())
        : "",
    );
    return (
      filteredOptions.length > 0 ||
      getTranslation(item.translationId)
        ?.toLowerCase()
        ?.includes(searched.toLowerCase())
    );
  });

  const { Request } = useRequest();

  useEffect(() => {
    Request("privacy").then((response) => {
      const privacyData = response.data.data;
      const updatedItems = items.map((item) => {
        const updatedOptions = item.options.map((option) => {
          return {
            ...option,
            value: privacyData[option.key] || false,
          };
        });

        return {
          ...item,
          options: updatedOptions,
        };
      });

      setPrivacy(privacyData);
      setItemsWithValues(updatedItems);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // ⏱ مدت نمایش اسکلتون

    Request("privacy").then((response) => {
      const privacyData = response.data.data;
      const updatedItems = items.map((item) => {
        const updatedOptions = item.options.map((option) => ({
          ...option,
          value: privacyData[option.key] || false,
        }));

        return {
          ...item,
          options: updatedOptions,
        };
      });

      setPrivacy(privacyData);
      setItemsWithValues(updatedItems);
    });

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SkeletonContainer>
        <SkeletonGrid count={1} />
        <SkeletonGrid count={2} />
        <SkeletonGrid count={2} />
        <SkeletonGrid count={2} />
        <SkeletonGrid count={2} />
        <SkeletonGrid count={2} />
      </SkeletonContainer>
    );
  }

  return (
    <Container>
      <SearchInput
        placeholder={getTranslation("1475")}
        value={searched}
        onchange={(e) => setSearched(e.target.value)}
      />
      <Wrapper>
        <Left>
          {searchedItems.slice(5, 11).map((item) => (
            <Item key={item.id} {...item} privacy={privacy} />
          ))}
        </Left>
        <Right>
          {searchedItems.slice(0, 5).map((item) => (
            <Item key={item.id} {...item} privacy={privacy} />
          ))}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default SecurityTab;
