import { useContext, useRef, useState, useEffect } from "react";
import useRequest from "../../../../services/Hooks/useRequest";
import Alert from "../../../../components/Alert/Alert";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import Button from "../../../../components/Button";
import Description from "./Description";
import Inputs from "./Inputs";
import SendFiles from "./SendFiles";
import Title from "../../../../components/Title";
import styled from "styled-components";
import { useReportsGlobalState } from "../GlobalReportStateProvider";
import { getTranslation } from "../../../../services/Utility";
import { useLocation } from "react-router";
import Container from "../../../../components/Common/Container";
import ErrorMessage from "../../../../components/ErrorMessage";
import getModalHeaderFromPrevious from "../../../../services/TitleManager";
const StyledContent = styled.div`
  p {
    margin: 10px 0;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;

    span {
      font-weight: 600;
      color: ${(props) => props.theme.colors.newColors.shades.title};
    }
  }
`;

const ErrorReportTab = () => {
  const location = useLocation();
  // فقط اولین مسیر را ذخیره کن
  const initialPath = useRef(location.state?.from ?? location.pathname);

  // فقط یک بار محاسبه می‌شود
  const { title, page } = getModalHeaderFromPrevious(initialPath.current);

  const baseURL = `https://world.metarang.com${initialPath.current}`;

  const { Request, HTTP_METHOD } = useRequest();
  const { state, dispatch } = useReportsGlobalState();
  const { alert, setAlert } = useContext(AlertContext);

  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const containerRef = useRef(null);
  useEffect(() => {
    const loadImage = async () => {
      if (location?.state?.title === "photoReport") {
        dispatch({ type: "SET_SUBJECT", payload: "disrespect" });
        dispatch({
          type: "SET_TITLE",
          payload: getTranslation(1855),
        });

        try {
          const response = await fetch(location.state.photo);
          const blob = await response.blob();

          const file = new File([blob], location.state.photo.split("/").pop(), {
            type: blob.type,
          });

          dispatch({
            type: "SET_FILES",
            payload: [file],
          });
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadImage();
  }, []);

  const resetForm = () => {
    dispatch({ type: "SET_SUBJECT", payload: "" });
    dispatch({ type: "SET_TITLE", payload: "" });
    dispatch({ type: "SET_DESCRIPTION", payload: "" });
    dispatch({ type: "SET_FILES", payload: [] });
  };

  const sendReport = async () => {
    if (state.subject && state.title && state.description) {
      setIsSending(true);

      const attachments = [...state.files];

      if (attachments.length > 5) {
        setError("The attachment must not have more than 5 items.");
        setIsSending(false);
        return;
      }

      try {
        await Request(
          "reports",
          HTTP_METHOD.POST,
          {
            title: state.title,
            content: state.description,
            subject: state.subject,
            url: baseURL,
            attachments,
          },
          {
            "Content-Type": "multipart/form-data",
          },
        );

        setAlert(true);
        setError("");

        containerRef.current?.scrollTo(0, 0);

        setTimeout(() => {
          resetForm();
          setAlert(false);
        }, 3000);
      } catch (err) {
        console.error(err);
        setError(getTranslation("1387"));
      } finally {
        setIsSending(false);
      }
    }
  };

  const isDisabled = !(state.subject && state.title && state.description);

  return (
    <Container ref={containerRef}>
      {alert && <Alert type="success" text={getTranslation("461")} />}

      <StyledContent>
        <Title title={getTranslation("1386")} right />

        <p>
          {getTranslation("1376")} <span>{page}</span> {getTranslation("1377")}{" "}
          <span>{title}</span>
        </p>

        <Inputs />
        <Description />
        <SendFiles />

        <div>
          <Button
            fit
            label={getTranslation("193")}
            onclick={sendReport}
            disabled={isDisabled ? true : isSending ? "pending" : false}
          />
        </div>

        <ErrorMessage
          errors={[error]}
          maxList={5}
          containerRef={containerRef}
          onClear={() => setError("")}
        />
      </StyledContent>
    </Container>
  );
};

export default ErrorReportTab;
