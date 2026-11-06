import { useCallback, useState } from "react";
import styled from "styled-components";
import MemberCard from "./MemberCard";
import Button from "../../../../../components/Button";
import ModalLg from "../../../../../components/Modal/ModalLg";
import OnOff from "../../../../Settings/Tabs/OnOff.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../../services/Utility";
import TitleBody from "../../../../../components/TitleBody.jsx";
const settings = [
  { id: 1, label: 836 },
  { id: 2, label: 837 },
  { id: 3, label: 838 },
  { id: 4, label: 839 },
  { id: 5, label: 840 },
  { id: 6, label: 841 },
  { id: 7, label: 138 },
  { id: 8, label: 842 },
  { id: 9, label: 843 },
  { id: 10, label: 844 },
];

const ScrollArea = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-inline-end: 8px;
  padding-bottom: 30px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;

const Texts = styled.div`
  margin-top: 30px;
`;

const Settings = styled.div`
  display: grid;
  gap: 20px;
  margin: 15px 0 30px;

  @media (min-width: 1366px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Setting = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
`;

const SubmitDynastyModal = ({
  setOpenDetails,
  selectedCitizen,
  setMode,
  memberType,
}) => {
  const [selectedRelation, setSelectedRelation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { Request, HTTP_METHOD } = useRequest();
  const isMinor = selectedCitizen?.age < 18;

  const handleAccept = useCallback(async () => {
    if (!selectedCitizen || !selectedRelation || submitting) return;

    const body = {
      user: selectedCitizen.id,
      relationship: selectedRelation,
    };

    if (isMinor) {
      body.permissions = settings.reduce((permissions, setting) => {
        permissions[setting.id] = true;
        return permissions;
      }, {});
    }

    setSubmitting(true);
    try {
      const response = await Request(
        "dynasty/add/member",
        HTTP_METHOD.POST,
        body,
      );

      if (response.status === 201) {
        ToastSuccess(getTranslation(1851));
        setOpenDetails(false);
        setMode({ mode: 1, type: null });
      }
    } catch (error) {
      ToastError(error.response.data.error);
    } finally {
      setSubmitting(false);
    }
  }, [
    selectedCitizen,
    selectedRelation,
    submitting,
    isMinor,
    Request,
    HTTP_METHOD,
    setOpenDetails,
    setMode,
  ]);

  const handleClose = useCallback(
    () => setOpenDetails(false),
    [setOpenDetails],
  );

  return (
    <ModalLg titleId={832} setShowModal={setOpenDetails}>
      <ScrollArea>
        <MemberCard
          selectedCitizen={selectedCitizen}
          memberType={memberType}
          setSelectedRelation={setSelectedRelation}
        />
        <Texts>
          {memberType === "children" && isMinor ? (
            <Settings>
              {settings.map((setting) => (
                <Setting key={setting.id}>
                  <TitleBody title={getTranslation(setting.label)} />
                  <OnOff label={getTranslation(setting.label)} />
                </Setting>
              ))}
            </Settings>
          ) : (
            <>
              <TitleBody
                title={[
                  getTranslation(1401),
                  getTranslation(1402),
                  selectedCitizen?.name,
                  getTranslation(1403),
                  getTranslation(1404),
                ].join(" ")}
              />
            </>
          )}
        </Texts>
        <Buttons>
          <Button
            label={getTranslation(823)}
            color="#18C08F"
            onclick={handleAccept}
            fit
            textColor="#D7FBF0"
            disabled={!selectedRelation || submitting}
          />
          <Button
            label={getTranslation(824)}
            color="#C30000"
            onclick={handleClose}
            fit
            textColor="#FFFFFF"
          />
        </Buttons>
      </ScrollArea>
    </ModalLg>
  );
};

export default SubmitDynastyModal;
