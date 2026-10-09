import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import { Outlet } from "react-router";
import useRequest from "../../../../services/Hooks/useRequest";

const Container = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  @media (min-width: 1366px) {
    gap: 20px;
  }
`;

const DynastyTab = () => {
  const { Request } = useRequest();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynasty = async () => {
      try {
        const response = await Request("dynasty");
        const resData = response.data.data;
        const hasDynasty = resData["user-has-dynasty"];

        localStorage.setItem("dynastyStatus", hasDynasty ? "has" : "no");
        window.dispatchEvent(
          new CustomEvent("dynastyStatusUpdated", {
            detail: hasDynasty ? "has" : "no",
          }),
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

  return (
    <Container>
      <Sidebar data={data}/>
      <Outlet context={{ data, setData, loading }} />
    </Container>
  );
};

export default DynastyTab;