import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import Alert from "../../../../components/Alert/Alert";
import Title from "../../../../components/Title";
import InfoRow from "../InfoRow";
import useRequest from "../../../../hooks/useRequest.js";
import { Skeleton } from "../../../../components/Skeleton";
import Container from "../../../../components/Common/Container";
import { useLocation } from "react-router";
import { tools } from "../data";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

// اسکلتون کارت ساده
const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content:space-between;
  gap: 15px;
`;

const ToolsContent = () => {
  const location = useLocation();
  const parts = location.pathname.split("/");
  const pathFromUrl = parts[parts.length - 1];

  const { alert } = useContext(AlertContext);
  const [assets, setassets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Request, HTTP_METHOD } = useRequest();

  useEffect(() => {
    const selectedTool = tools.find((tool) => tool.path === pathFromUrl);
    const selectedToolId = selectedTool ? selectedTool.id : tools[0]?.id;

    setLoading(true);
    Request("store", HTTP_METHOD.POST, {
      codes: [
        `tools-b-${selectedToolId}`,
        `tools-r-${selectedToolId}`,
        `tools-y-${selectedToolId}`,
      ],
    })
      .then((response) => {
        setassets(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching tools:", error);
        setassets([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tools, pathFromUrl]);

  return (
    <Container>
      {alert && <Alert type="success" text="خرید شما با موفقیت انجام شد" />}
      <Title title="ابزارها" />
      <Wrapper>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              <div style={{ display: "flex",  alignItems: "center" , gap: "20px", }}>
                <Skeleton width="50px" height="60px" radius="8px" />
                <div style={{ display: "flex", flexDirection:"column" , gap: "14px", }}>
                  <Skeleton width="70px" height="18px" radius="4px" />
                  <Skeleton width="70px" height="18px" radius="4px" />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection:"column" , gap: "14px", }}>
                  <Skeleton width="70px" height="18px" radius="4px" />
                  <Skeleton width="70px" height="18px" radius="4px" />
                </div>
              <div style={{ display: "flex", flexDirection:"column" , gap: "14px", }}>
                  <Skeleton width="70px" height="18px" radius="4px" />
                  <Skeleton width="70px" height="18px" radius="4px" />
                </div>
              <Skeleton width="76px" height="50px" radius="8px" />
            </SkeletonCard>
          ))
        ) : (
          assets.map((item) => (
            <InfoRow shop type="ابزار" key={item.id} data={item} />
          ))
        )}
      </Wrapper>
    </Container>
  );
};

export default ToolsContent;