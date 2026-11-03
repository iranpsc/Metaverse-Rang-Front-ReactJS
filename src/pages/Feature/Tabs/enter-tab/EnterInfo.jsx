// بخش نمایش اطلاعات تب ورود در حالت غیرویرایشی (اطلاعات مجوز، فیلد کد و تایید پرداخت، توضیحات، دکمه‌های ویرایش و حذف ساختمان و اسلایدر ویدیوها)؛ در عرض‌های کمتر از ۱۳۶۹ پیکسل اطلاعات بالای اسلایدر و در عرض‌های بیشتر زیر آن قرار می‌گیرد؛ مناسب EnterTab

import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import EnterConfirmModal from "./EnterConfirmModal";
import LoadingModal from "./LoadingModal";
import VideoSlider from "./VideoSlider";
import Button from "../../../../components/Button";
import Container from "../../../../components/Common/Container";
import LabeledInput from "../../../../components/LabeledInput";
import TitleBody from "../../../../components/TitleBody";
import TitleHeader from "../../../../components/TitleHeader";
import TitleValue from "../../../../components/TitleValue";
import { useMapData } from "../../../../hooks/useMapData.js";
import useRequest from "../../../../hooks/useRequest.js";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../services/reducers/WalletContext";
import {
  convertToPersian,
  getTranslation,
  ToastSuccess,
} from "../../../../services/Utility";

const MOBILE_QUERY = "(max-width: 1368px)";
const INFO_FIELDS_COUNT = 4; // چهار ورودی اول داده در کارت‌های عنوان و مقدار نمایش داده می‌شود

const EnterContainer = styled.div`
  display: grid;
  gap: 30px;
  padding: 15px 10px;
  overflow-y: auto;

  @media (min-width: 1500px) {
    grid-template-columns: 2fr 3fr;
    padding-right: 0;
  }
`;

const Details = styled.div`
  color: aliceblue;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Onlines = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 12px;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.primaryText};
  background: ${({ theme }) => theme.colors.primary};

  svg {
    font-size: 22px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 25px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 702px) {
    justify-content: center;
  }
`;

const EditButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const EnterInfo = ({ data, setEdit, payed, setPayed, isOwner }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buildings, removeBuilding } = useMapData();
  const [wallet, dispatch] = useContext(WalletContext);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  const [code, setCode] = useState("");
  const [payStatus, setPayStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  // فقط هنگام عبور از مرز ۱۳۶۹ پیکسل رندر دوباره انجام می‌شود، نه با هر تغییر اندازه
  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event) => setIsMobile(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const activeBuilding = buildings.find(
    (item) => item?.building?.feature_id === Number(id),
  );
  const buildingId = activeBuilding?.model_id;

  // بعد از حذف ساختمان، رضایتی که برای راه‌اندازی آن مصرف شده بود به کیف پول برمی‌گردد
  const restoredSatisfaction =
    (Number(wallet?.satisfaction) || 0) +
    (Number(activeBuilding?.building?.launched_satisfaction) || 0);

  const fields = data[0].inputs.slice(0, INFO_FIELDS_COUNT);
  const about = data[0].inputs.find((input) => input.about)?.about;

  const handleDeleteBuilding = async () => {
    if (!activeBuilding || !checkSecurity()) return;

    try {
      await Request(
        `features/${id}/build/buildings/${buildingId}`,
        HTTP_METHOD.DELETE,
      );

      ToastSuccess(getTranslation("1609"));
      navigate("");
      dispatch({
        type: WalletContextTypes.ADD_WALLET,
        payload: { ...wallet, satisfaction: restoredSatisfaction },
      });
      removeBuilding(buildingId);
    } catch (error) {
      console.error("Delete building error:", error);
    }
  };
  const details = (
    <Details>
      <HeaderContainer>
        <TitleHeader title={getTranslation("533")} />
        <Onlines>
          <LuEye />
          <p>
            {getTranslation("553")} {convertToPersian(20)}{" "}
            {getTranslation("1313")}
          </p>
        </Onlines>
      </HeaderContainer>

      <InfoGrid>
        {fields.map(({ id: fieldId, title, value, icon }) => (
          <TitleValue
            icon={icon}
            key={fieldId}
            title={getTranslation(title)}
            value={value}
          />
        ))}
      </InfoGrid>

      {!payed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            paddingTop: "20px",
          }}
        >
          <LabeledInput
            placeholder={getTranslation("535")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            fit
            label={getTranslation("536")}
            onClick={() => setPayStatus(true)}
          />
        </div>
      )}

      <TitleHeader payed={payed} title={getTranslation("538")} />
      <TitleBody title={about} />

      {payed && (
        <Buttons>
          <EditButtons>
            <Button
              color="#18C08F"
              textColor="#FFFFFF"
              label={getTranslation("537")}
              onClick={() => setEdit(true)}
            />
            <Button
              color="#E9E9E9"
              textColor="#949494"
              label={getTranslation("548")}
            />
          </EditButtons>

          {isOwner && (
            <Button
              fit
              color="#ff0000"
              label={getTranslation("1595")}
              onClick={handleDeleteBuilding}
            />
          )}
        </Buttons>
      )}

      {payStatus && (
        <EnterConfirmModal
          data={data}
          code={code}
          setPayStatus={setPayStatus}
          setPayed={setPayed}
          setLoading={setLoading}
        />
      )}
      {loading && <LoadingModal isMobile={isMobile} setOpen={setLoading} />}
    </Details>
  );

  const slider = <VideoSlider data={data} />;

  return (
    <Container>
      <EnterContainer>
        {isMobile ? details : slider}
        {isMobile ? slider : details}
      </EnterContainer>
    </Container>
  );
};

export default EnterInfo;
