import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import Container from "../../../../components/Common/Container";
import TitleHeader from "../../../../components/TitleHeader";
import useRequest from "../../../../hooks/useRequest.js";
import { tools } from "../data";
import InfoRow from "../InfoRow";
import ToolsSkeleton from "../../../../components/Skeletons/ToolsSkeleton.jsx";
import { getTranslation } from "../../../../services/Utility/index.jsx";

// b: آبی | r: قرمز | y: زرد
const COLOR_PREFIXES = ["b", "r", "y"];

const getToolCodes = (toolId) =>
  COLOR_PREFIXES.map((prefix) => `tools-${prefix}-${toolId}`);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const ToolsContent = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const { pathname } = useLocation();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const toolPath = pathname.split("/").pop();

  useEffect(() => {
    let cancelled = false;

    const fetchAssets = async () => {
      const toolId = (tools.find(({ path }) => path === toolPath) ?? tools[0])
        ?.id;

      setLoading(true);

      try {
        const response = await Request("store", HTTP_METHOD.POST, {
          codes: getToolCodes(toolId),
        });

        if (!cancelled) setAssets(response.data.data);
      } catch (error) {
        console.error("Error fetching tools:", error);
        if (!cancelled) setAssets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAssets();

    return () => {
      cancelled = true;
    };
  }, [toolPath]);

  return (
    <Container>
      <TitleHeader title={getTranslation(109)} />

      <Wrapper>
        {loading ? (
          <ToolsSkeleton />
        ) : (
          assets.map((item) => (
            <InfoRow shop  key={item.id} data={item} />
          ))
        )}
      </Wrapper>
    </Container>
  );
};

export default ToolsContent;
