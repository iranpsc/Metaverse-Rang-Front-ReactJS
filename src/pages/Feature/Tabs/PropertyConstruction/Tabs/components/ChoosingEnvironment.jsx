// Paginated image grid with preview and select buttons; used in the feature build step to choose an environment package.
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FeatureContext } from "../../../../Context/FeatureProvider";

import useRequest from "../../../../../../hooks/useRequest.js";
import Eye from "../../../../../../assets/svg/eye.svg?react";
import EnvironmentSkeleton from "../../../../../../components/Skeletons/EnvironmentSkeleton.jsx";
import { useSelectedEnvironment } from "../../../../../../hooks/useSelectedEnvironment.js";

import PreviewModel from "../PreviewModel.jsx";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
margin-bottom: 30px;
  @media (max-width: 1024px) {
    padding: 10px;
    gap: 8px;
  }
`;

const ImgHolder = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 10px;

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const ViewIcon = styled(Eye)`
  stroke: ${({ theme }) => theme.colors.primary};
`;

const ViewHolder = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 60px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bgOne};
`;

const SelectorEnvironment = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  padding: 4px;
  border-radius: 60px;
  border: 2px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.newColors.shades.bgOne};
`;

const ChoosingEnvironment = () => {
  const [feature] = useContext(FeatureContext);
  const { Request, HTTP_METHOD } = useRequest();
  const { addSelectedEnvironment, hiddenModel, setHiddenModel, isSelectable } =
    useSelectedEnvironment() || {};

  const [data, setData] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    Request(
      `features/${feature.id}/build/package?page=${page}`,
      HTTP_METHOD.GET,
    )
      .then((res) => {
        if (ignore) return;
        const items = res.data.data;
        setData((prev) => [...prev, ...items]);
        setCoordinates(res.data.feature.coordinates);
        setHasMore(items.length > 0);
      })
      .catch(console.error)
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage((prev) => prev + 1);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  const handleSelect = (item) => {
    setActiveId(item.id);
    addSelectedEnvironment({ ...item, coordinates });
    if (isSelectable && hiddenModel) setHiddenModel(false);
  };

  return (
    <>
      <Container>
        {data.map((item) => (
          <ImgHolder key={item.id}>
            <Img src={item.images?.[0]?.url} alt="" />
            <ViewHolder onClick={() => setPreview(item)}>
              <ViewIcon />
            </ViewHolder>
            <SelectorEnvironment
              $active={activeId === item.id}
              onClick={() => handleSelect(item)}
            />
          </ImgHolder>
        ))}
        {loading && <EnvironmentSkeleton count={data.length ? 2 : 6} />}
      </Container>

      <div ref={sentinelRef} />

      {preview && (
        <PreviewModel data={[preview]} setShowModal={() => setPreview(null)} />
      )}
    </>
  );
};

export default ChoosingEnvironment;
