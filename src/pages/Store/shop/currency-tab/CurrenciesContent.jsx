import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import InfoRow from "../InfoRow";
import Title from "../../../../components/Title";
import useRequest from "../../../../hooks/useRequest.js";
import Container from "../../../../components/Common/Container";
import { useLocation } from "react-router";
import { currencies } from "../data";
import { Skeleton } from "../../../../components/Skeleton";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ loading }) => (loading ? "center" : "flex-start")};
  align-items: ${({ loading }) => (loading ? "center" : "stretch")};
  gap: 20px;
  margin-top: 20px;
  overflow-y: auto;
`;
const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
`;

const CurrenciesContent = () => {
  const { alert } = useContext(AlertContext);
  const [assets, setassets] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const parts = location.pathname.split("/");
  const pathFromUrl = parts[parts.length - 1];
  const selectedCurrency =
    currencies.find((c) => c.path === pathFromUrl) || currencies[0];

  const selectedCurrencyId = selectedCurrency?.id;
  const { Request, HTTP_METHOD } = useRequest();

  useEffect(() => {
    if (!selectedCurrencyId) return;

    setLoading(true);
    Request("store", HTTP_METHOD.POST, {
      codes: [
        `currency-psc-${selectedCurrencyId}`,
        `currency-irr-${selectedCurrencyId}`,
        `currency-irr-${selectedCurrencyId}`,
      ],
    })
      .then((response) => {
        setassets(response.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathFromUrl]);

  return (
    <Container>
      {alert && <Alert type="success" text="خرید شما با موفقیت انجام شد!" />}
      <Title title="ارزها" />
      <Wrapper>
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
              <SkeletonCard key={index}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <Skeleton width="50px" height="60px" radius="8px" />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <Skeleton width="70px" height="18px" radius="4px" />
                    <Skeleton width="70px" height="18px" radius="4px" />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <Skeleton width="70px" height="18px" radius="4px" />
                  <Skeleton width="70px" height="18px" radius="4px" />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <Skeleton width="70px" height="18px" radius="4px" />
                  <Skeleton width="70px" height="18px" radius="4px" />
                </div>
                <Skeleton width="76px" height="50px" radius="8px" />
              </SkeletonCard>
            ))
          : assets.map((item) => (
              <InfoRow shop type="ابزار" key={item.id} data={item} />
            ))}
      </Wrapper>
    </Container>
  );
};

export default CurrenciesContent;
