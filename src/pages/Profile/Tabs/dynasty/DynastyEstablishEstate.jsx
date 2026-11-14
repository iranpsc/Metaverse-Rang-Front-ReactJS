// صفحه‌ی ایجاد سلسله یا املاک سلسله: داده‌ی سلسله را از سرور می‌گیرد، بر اساس tab و اینکه کاربر سلسله دارد یا نه یکی را نمایش می‌دهد (در حین لود اسکلتون) و در صورت ناهماهنگی ریدایرکت می‌کند
import { DynastySkeleton } from "../../../../components/Skeletons/DynastySkeleton.jsx";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import DynastyEstablish from "./dynasty-establish/DynastyEstablish";
import DynastyEstate from "./dynasty-estate/DynastyEstate";
import useRequest from "../../../../hooks/useRequest.js";

// مسیر ریدایرکت هر تب
const TAB_PATHS = {
  establish: "/dynasty/establish",
  estate: "/profile/dynasty/estate",
};

const DynastyEstablishEstate = ({ tab }) => {
  const { Request } = useRequest();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynasty = async () => {
      try {
        const response = await Request("dynasty");
        const resData = response.data.data;
        const status = resData["user-has-dynasty"] ? "has" : "no";

        // سایدبار از همین event برای عوض کردن عنوان اولین آیتم استفاده می‌کند
        localStorage.setItem("dynastyStatus", status);
        window.dispatchEvent(
          new CustomEvent("dynastyStatusUpdated", { detail: status }),
        );

        setData(resData);
      } catch (error) {
        console.error("Failed to fetch dynasty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynasty();
  }, []);

  const establishMembers = useMemo(
    () =>
      (data?.prizes ?? []).map((prize, index) => ({
        id: index + 1,
        name: prize.member,
        psc: prize.psc,
        plus: prize.introduction_profit_increase,
        cage: prize.data_storage,
        rial: prize.accumulated_capital_reserve,
        gif: prize.satisfaction,
      })),
    [data],
  );

  if (loading) return <DynastySkeleton />;

  // کاربر با سلسله فقط estate و بدون سلسله فقط establish را می‌بیند
  if (data) {
    const expectedTab = data["user-has-dynasty"] ? "estate" : "establish";

    if (tab !== expectedTab) {
      return <Navigate to={TAB_PATHS[expectedTab]} replace />;
    }
  }

  return tab === "establish" ? (
    <DynastyEstablish data={data} member={establishMembers} setData={setData} />
  ) : (
    <DynastyEstate data={data} setData={setData} />
  );
};

export default DynastyEstablishEstate;
