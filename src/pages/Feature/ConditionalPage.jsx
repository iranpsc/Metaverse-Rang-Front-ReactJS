import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth.js";
import Tabs from "../../components/RouteTabs.jsx";
import { FeatureContext } from "./Context/FeatureProvider";
import { FeatureColor } from "../../services/constants/FeatureType";
import { getTranslation } from "../../services/Utility";
// Tabs
import { BuyerTab, InfoTab, SellerTab } from "./Tabs";
import HistoryTab from "./Tabs/history-tab/HistoryTab";
import PropertyConstruction from "./Tabs/PropertyConstruction";
import EnterTab from "./Tabs/enter-tab/EnterTab";
import PhysicTab from "./Tabs/physic-tab/PhysicTab";
import ParticipationTab from "./Tabs/participation-tab/ParticipationTab";
import BuyerTabSystem from "./Tabs/BuyFromSystem/BuyerTab";

export default function ConditionalPage() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const [userId, setUserId] = useState(null);
  const [feature] = useContext(FeatureContext);
  const status = feature?.construction_status?.[0]?.status;
  const areTabsReady =
    feature !== undefined &&
    feature !== null &&
    status !== undefined &&
    userId !== null;
  const infoTab = {
    path: "info",
    title: getTranslation("516"),
    content: <InfoTab />,
  };

  const historyTab = {
    path: "history",
    title: getTranslation("1780"),
    content: <HistoryTab />,
  };
  const SellTabs = useMemo(
    () => [
      infoTab,
      ...(status === undefined || status === "completed"
        ? [
            {
              path: "sell",
              title: getTranslation("352"),
              content: <SellerTab seller />,
            },
          ]
        : []),

      ...(status === undefined
        ? [
            {
              path: "building",
              title: getTranslation("355"),
              content: <PropertyConstruction />,
            },
          ]
        : []),

      ...(status === "completed"
        ? [
            {
              path: "enter",
              title: getTranslation("354"),
              content: <EnterTab owner />,
            },
            {
              path: "physic",
              title: getTranslation("356"),
              content: <PhysicTab owner />,
            },
            {
              path: "participation",
              title: getTranslation("357"),
              content: <ParticipationTab owner />,
            },
          ]
        : []),

      ...(status === "in_progress"
        ? [
            {
              path: "participation",
              title: getTranslation("357"),
              content: <ParticipationTab owner />,
            },
          ]
        : []),
      historyTab,
    ],
    [status],
  );

  const BuySystemTabs = [
    infoTab,
    {
      path: "buy",
      title: getTranslation("353"),
      content: <BuyerTabSystem />,
    },
    historyTab,
  ];

  const BuyUserTabs = useMemo(
    () => [
      infoTab,

      ...(status !== "in_progress"
        ? [
            {
              path: "buy",
              title: getTranslation("353"),
              content: <BuyerTab />,
            },
          ]
        : []),

      ...(status === "completed"
        ? [
            {
              path: "enter",
              title: getTranslation("354"),
              content: <EnterTab />,
            },

            ...(feature?.buildings[0]?.building?.information
              ? [
                  {
                    path: "physic",
                    title: getTranslation("356"),
                    content: <PhysicTab  />,
                  },
                ]
              : []),

            {
              path: "participation",
              title: getTranslation("357"),
              content: <ParticipationTab />,
            },
          ]
        : []),

      ...(status === "in_progress"
        ? [
            {
              path: "participation",
              title: getTranslation("357"),
              content: <ParticipationTab />,
            },
          ]
        : []),
      historyTab,
    ],
    [status],
  );

  useEffect(() => {
    const user = getUser();
    if (user?.id) setUserId(Number(user.id));
  }, [getUser]);

  let tabs = [infoTab, historyTab];

  if (FeatureColor(feature?.properties?.rgb) && userId) {
    if (feature?.owner_id === 1) tabs = BuySystemTabs;
    else if (feature?.owner_id === userId) tabs = SellTabs;
    else tabs = BuyUserTabs;
  }
  useEffect(() => {
    if (!areTabsReady) return;

    if (!tabs.find((t) => t.path === tab)) {
      navigate("", { replace: true });
    }
  }, [tab, tabs, navigate, areTabsReady]);

  return (
    <>
      <Tabs items={tabs} />
    </>
  );
}
