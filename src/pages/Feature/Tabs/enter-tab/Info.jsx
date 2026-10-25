import EnterCode from "./EnterCode";
import EnterConfirmModal from "./EnterConfirmModal";
import EnterInputs from "./EnterInputs";
import LoadingModal from "./LoadingModal";
import { LuEye } from "react-icons/lu";
import Button from "../../../../components/Button";
import styled from "styled-components";
import { useState, useContext } from "react";
import Title from "../../../../components/Title";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useMapData } from "../../../../hooks/useMapData.js";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../services/reducers/WalletContext";
import {
  convertToPersian,
  getTranslation,
  ToastSuccess,
} from "../../../../services/Utility";
import useRequest from "../../../../hooks/useRequest.js";
const Container = styled.div`
  color: aliceblue;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Onlines = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  background: ${(props) => props.theme.colors.primary};
  padding: 4px 8px 4px 12px;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.newColors.primaryText};
  svg {
    font-size: 22px;
  }
`;

const Text = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  line-height: 1.5rem;
  margin-top: 10px;
  font-weight: 300;
  @media (max-width: 1023px) {
    font-size: 14px;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 702px) {
    justify-content: center;
  }
  gap: 20px;
  margin-top: 20px;
`;

const EditButtons = styled.div`
  display: flex;
  gap: 20px;
`;
const ButtonSecondary = styled.button`
  border-radius: 10px;
  background-color: ${(props) => (props.blue ? "#18C08F" : "#E9E9E9")};
  color: ${(props) => (props.blue ? "#FFFFFF" : "#949494")} !important;
  border: none;
  padding: 0 14px;
  width: fit-content;
  height: 45px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  color: #191b21;
  font-family: inherit;
`;

const Info = ({ data, edit, setEdit, payed, setPayed, isOwner, isMobile }) => {
  const { buildings, removeBuilding } = useMapData();
  const { id } = useParams();
  const navigate = useNavigate();
  const [Wallet, dispatch] = useContext(WalletContext);
  const { Request, checkSecurity } = useRequest();
  const activeBuilding =
    buildings.find((b) => b?.building?.feature_id === parseInt(id)) || null;

  const launchedSatisfaction = activeBuilding?.building?.launched_satisfaction;
  const base = Number(Wallet.satisfaction) || 0;
  const extra = Number(launchedSatisfaction) || 0;
  const total = base + extra;
  const [payStatus, setPayStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const featureId = activeBuilding?.building?.feature_id;
  const buildingId = activeBuilding?.model_id;

  const handleDeleteBuilding = async () => {
    if (!checkSecurity()) return;
    try {
      await Request(
        `features/${featureId}/build/buildings/${buildingId}`,
        HTTP_METHOD.DELETE,
      );

      ToastSuccess(getTranslation("1609"));
      navigate("");
      dispatch({
        type: WalletContextTypes.ADD_WALLET,
        payload: {
          ...Wallet,
          satisfaction: total,
        },
      });
      removeBuilding(activeBuilding.model_id);
    } catch (error) {
      console.error("❌ Delete building error:", error);
    }
  };
  return (
    <Container>
      <HeaderContainer>
        <Title title={getTranslation("533")} />
        <Onlines>
          <LuEye />
          <p>
            {getTranslation("553")} {convertToPersian(20)}{" "}
            {getTranslation("1313")}
          </p>
        </Onlines>
      </HeaderContainer>
      <EnterInputs data={data} />
      {!payed && !edit && (
        <EnterCode
          setEdit={setEdit}
          isOwner={isOwner}
          setPayStatus={setPayStatus}
        />
      )}
      <Title payed={payed} title={getTranslation("538")} />
      <Text>{data[0].inputs[4].about}</Text>
      {payed && !edit && (
        <Buttons>
          <EditButtons>
            {" "}
            <ButtonSecondary blue onClick={() => setEdit(true)}>
              {getTranslation("537")}
            </ButtonSecondary>
            <ButtonSecondary onClick={() => {}}>
              {getTranslation("548")}
            </ButtonSecondary>
          </EditButtons>
          {isOwner && (
            <Button
              fit
              color="#ff0000"
              label={getTranslation("1595")}
              onclick={handleDeleteBuilding}
            />
          )}
        </Buttons>
      )}
      {payStatus && (
        <EnterConfirmModal
          data={data}
          setPayStatus={setPayStatus}
          setPayed={setPayed}
          setLoading={setLoading}
        />
      )}
      {loading && <LoadingModal isMobile={isMobile} setOpen={setLoading} />}
    </Container>
  );
};

export default Info;
