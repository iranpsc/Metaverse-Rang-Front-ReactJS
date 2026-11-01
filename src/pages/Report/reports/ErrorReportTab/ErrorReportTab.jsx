import { useContext, useRef, useState, useEffect } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import Alert from "../../../../components/Alert/Alert";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import Button from "../../../../components/Button";
import Inputs from "./Inputs";
import TitleHeader from "../../../../components/TitleHeader";
import { getTranslation } from "../../../../services/Utility";
import { useLocation } from "react-router";
import Container from "../../../../components/Common/Container";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage.jsx";
import getModalHeaderFromPrevious from "../../../../services/TitleManager";
import TitleBody from "../../../../components/TitleBody.jsx";
import CustomEditor from "../../../../components/Common/CustomEditor.jsx";
import FileUploader from "../../../../components/FileUploader/FileUploader.jsx";
const ErrorReportTab = () => {
  const location = useLocation();
  // فقط اولین مسیر را ذخیره کن
  const initialPath = useRef(location.state?.from ?? location.pathname);

  // فقط یک بار محاسبه می‌شود
  const { title, page } = getModalHeaderFromPrevious(initialPath.current);

  const baseURL = `https://world.metarang.com${initialPath.current}`;

  const { Request, HTTP_METHOD } = useRequest();
  const { alert, setAlert } = useContext(AlertContext);

  const [report, setReport] = useState({
    subject: "",
    title: "",
    description: "",
    files: [],
  });
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const containerRef = useRef(null);
  useEffect(() => {
    const loadImage = async () => {
      if (location?.state?.title === "photoReport") {
        setReport((currentReport) => ({
          ...currentReport,
          subject: "disrespect",
          title: getTranslation(1855),
        }));

        try {
          const response = await fetch(location.state.photo);
          const blob = await response.blob();

          const file = new File([blob], location.state.photo.split("/").pop(), {
            type: blob.type,
          });

          setReport((currentReport) => ({
            ...currentReport,
            files: [file],
          }));
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadImage();
  }, []);

  const resetForm = () => {
    setReport({
      subject: "",
      title: "",
      description: "",
      files: [],
    });
  };

  const sendReport = async () => {
    if (report.subject && report.title && report.description) {
      setIsSending(true);

      const attachments = [...report.files];

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
            title: report.title,
            content: report.description,
            subject: report.subject,
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

  const isDisabled = !(report.subject && report.title && report.description);

  return (
    <Container ref={containerRef}>
      {alert && <Alert type="success" text={getTranslation("461")} />}

      <div>
        <TitleHeader title={getTranslation("1386")} />
        <TitleBody
          title={`${getTranslation("1376")} ${page} ${getTranslation("1377")} ${title}`}
        />
        <Inputs
          subject={report.subject}
          title={report.title}
          onSubjectChange={(subject) =>
            setReport((currentReport) => ({ ...currentReport, subject }))
          }
          onTitleChange={(title) =>
            setReport((currentReport) => ({ ...currentReport, title }))
          }
        />
        <CustomEditor
          label={getTranslation("20")}
          value={report.description}
          onChange={(description) =>
            setReport((currentReport) => ({ ...currentReport, description }))
          }
        />
        <FileUploader
          files={report.files}
          onFilesChange={(files) =>
            setReport((currentReport) => ({ ...currentReport, files }))
          }
          accept="image/*"
        />

        <Button
          fit
          label={getTranslation("193")}
          onclick={sendReport}
          disabled={isDisabled ? true : isSending ? "pending" : false}
        />
        <ErrorMessage
          errors={[error]}
          maxList={5}
          containerRef={containerRef}
          onClear={() => setError("")}
        />
      </div>
    </Container>
  );
};

export default ErrorReportTab;
