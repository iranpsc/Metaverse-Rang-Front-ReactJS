// تب تنظیمات حریم خصوصی (نمایش یا مخفی کردن اطلاعات شخصی، مجوزها، تراکنش‌ها، جوایز و سلسله برای دیگران) با سرچ روی عنوان گروه و گزینه‌ها؛ مناسب صفحه‌ی تنظیمات امنیتی که هر گروه را در یک Item با کلیدهای روشن/خاموش نمایش می‌دهد

import styled from "styled-components";
import { useEffect, useState } from "react";
import Item from "./Item";
import SearchInput from "../../../../components/SearchInput";
import Container from "../../../../components/Common/Container";
import SecuritySkeleton from "../../../../components/Common/SkeletonGrid";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";

// هر گروه: کلید ترجمه‌ی عنوان + گزینه‌ها به شکل [کلید در بک‌اند, کلید ترجمه, عنوان ثابت (فقط وقتی ترجمه ندارد)]
const SECTIONS = [
  {
    translationId: "643",
    options: [
      ["nationality", "644"],
      ["fname", "645"],
      ["lname", "646"],
      ["birthdate", "83"],
      ["phone", "84"],
      ["email", "85"],
      ["address", "59"],
      ["name", "647"],
    ],
  },
  {
    translationId: "254",
    options: [
      ["about", "259"],
      ["registered_at", "648"],
      ["position", "649"],
      ["score", "650"],
      ["licenses", "154"],
      ["license_score", "651"],
      ["avatar", "652"],
      ["occupation", "86"],
      ["education", "479"],
      ["loved_city", "653"],
      ["loved_country", "654"],
      ["loved_language", "655"],
      ["prediction", "656"],
      ["memory", "93"],
      ["passions", "94"],
    ],
  },
  {
    translationId: "58",
    options: [
      ["amoozeshi_features", "657"],
      ["tejari_features", "659"],
      ["gardeshgari_features", "660"],
      ["fazasabz_features", "661"],
      ["behdashti_features", "662"],
      ["edari_features", "663"],
      ["nemayeshgah_features", "664"],
    ],
  },
  {
    translationId: "665",
    options: [
      ["followers", "666"],
      ["following", "668"],
      ["following_count", "669"],
    ],
  },
  {
    translationId: "670",
    options: [
      ["establish_store_license", "671"],
      ["establish_union_license", null, "permission to create a union"],
      ["establish_taxi_license", null, "permission to create a taxi service"],
      ["establish_amoozeshgah_license", "674"],
      ["reporter_license", "675"],
      ["cooporation_license", "676"],
      ["developer_license", "677"],
      ["inspection_license", "678"],
      ["trading_license", "679"],
      ["lawyer_license", null, "attorney's license"],
      ["city_council_license", null, "mayor's license"],
      ["governer_license", null, "governor's license"],
    ],
  },
  {
    translationId: "61",
    options: [
      ["irr_transactions", "685"],
      ["psc_transactions", "686"],
      ["blue_transactions", "687"],
      ["yellow_transactions", "688"],
      ["red_transactions", "689"],
      ["sold_products", "692"],
      ["bought_products", "691"],
    ],
  },
  {
    translationId: "694",
    options: [
      ["recieved_irr_prizes", "695"],
      ["recieved_psc_prizes", "696"],
      ["recieved_yellow_prizes", "697"],
      ["recieved_blue_prizes", "698"],
      ["recieved_red_prizes", "699"],
    ],
  },
  {
    translationId: "704",
    options: [
      ["bought_golden_keys", "705"],
      ["used_golden_keys", "705"],
    ],
  },
  {
    translationId: "708",
    options: [
      ["bought_golden_keys", "709"],
      ["notice", "710"],
      ["violation_of_the_rules", "711"],
      ["warning", "712"],
      ["negative_points", "713"],
    ],
  },
  {
    translationId: "714",
    options: [
      ["dynasty_members_photo", "715"],
      ["dynasty_members_info", "716"],
      ["recieved_dynasty_satisfaction_prizes", "717"],
      ["recieved_dynasty_referral_profit_prizes", "718"],
      ["recieved_satisfaction_prizes", "719"],
      ["recieved_satisfaction_prizes", "719"],
    ],
  },
];

// idها از روی ترتیب ساخته می‌شوند (همان idهای ۱ تا n قبلی)
const SECTIONS_WITH_IDS = SECTIONS.map(({ translationId, options }, index) => ({
  id: index + 1,
  translationId,
  options: options.map(([key, optionTranslationId, title], optionIndex) => ({
    id: optionIndex + 1,
    key,
    ...(optionTranslationId
      ? { translationId: optionTranslationId }
      : { title }),
  })),
}));

// ستون راست پنج گروه اول و ستون چپ بقیه است
const RIGHT_SECTIONS = SECTIONS_WITH_IDS.slice(0, 5);
const LEFT_SECTIONS = SECTIONS_WITH_IDS.slice(5);

const Wrapper = styled.div`
  display: grid;
    grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
  padding-bottom: 20px;

`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SecurityTab = () => {
  const { Request } = useRequest();

  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState("");
  const [privacy, setPrivacy] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Request("privacy")
      .then((response) => {
        if (!cancelled) setPrivacy(response.data.data);
      })
      .catch((error) => console.error("Failed to load privacy:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const query = searched.toLowerCase();

  const matches = (translationId) =>
    getTranslation(translationId)?.toLowerCase().includes(query);

  // گروهی نمایش داده می‌شود که عنوانش یا یکی از گزینه‌هایش با سرچ بخواند
  const matchesSearch = ({ translationId, options }) =>
    matches(translationId) ||
    options.some(
      (option) => option.translationId && matches(option.translationId),
    );

  const withValues = (section) => ({
    ...section,
    options: section.options.map((option) => ({
      ...option,
      value: privacy[option.key] || false,
    })),
  });

  const renderColumn = (sections) =>
    privacy
      ? sections
          .filter(matchesSearch)
          .map((section) => (
            <Item
              key={section.id}
              {...withValues(section)}
              privacy={privacy}
              setPrivacy={setPrivacy}
            />
          ))
      : null;

  if (loading) return <SecuritySkeleton />;

  return (
    <Container>
      <SearchInput
        placeholder={getTranslation("1475")}
        value={searched}
        onchange={(e) => setSearched(e.target.value)}
      />

      <Wrapper>
        <Column>{renderColumn(LEFT_SECTIONS)}</Column>
        <Column>{renderColumn(RIGHT_SECTIONS)}</Column>
      </Wrapper>
    </Container>
  );
};

export default SecurityTab;
