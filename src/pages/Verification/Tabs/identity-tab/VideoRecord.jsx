// ضبط ویدیوی احراز هویت (KYC): کاربر تا ۳۰ ثانیه با دوربین ویدیو ضبط می‌کند، فایل با Resumable آپلود می‌شود و متن تأیید همراه کد کاربر نمایش داده می‌شود.
import { HiOutlineCamera, HiOutlineRefresh } from "react-icons/hi";
import styled, { keyframes, css } from "styled-components";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import Resumable from "resumablejs";
import * as Sentry from "@sentry/react";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation, convertToPersian } from "../../../../services/Utility";
import { BASE_URL } from "../../../../hooks/useRequest.js";
import ErrorMessage from "../../../../components/ErrorMessage/ErrorMessage.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
const MAX_DURATION = 30;

const Container = styled.div`
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 20px;
`;

const Div = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  margin-top: 15px;
  gap: 20px;
  @media (min-width: 700px) {
    gap: 0;
  }
`;

const Info = styled.div`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: 14px;
  font-weight: 400;

  p {
    margin: 20px 0 40px 0;
    text-transform: uppercase;
  }
  div {
    display: flex;
    align-items: center;
    gap: 5px;
    h3 {
      font-size: 14px;
    }
    h5 {
      color: ${({ theme }) => theme.colors.primary};
      span {
        font-weight: 500;
        color: ${({ theme }) => theme.colors.newColors.shades.title};
      }
    }
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  cursor: pointer;
  font-size: 24px;
`;

const ContainerRecorder = styled.div`
  display: flex;
  width: fit-content;
  flex-direction: column;
`;

// از رنگ فعلی border شروع می‌شود و به زرد می‌رسد
const toYellow = keyframes`
  to { border-color: yellow; }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  cursor: pointer;
`;

const Record = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 180px;
  height: 180px;
  border-radius: 100%;
  border: 3px dotted
    ${({ $hasError, theme }) =>
      $hasError ? "red" : theme.colors.newColors.otherColors.inputBorder};
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  cursor: pointer;
  ${({ $capturing }) =>
    $capturing &&
    css`
      animation: ${toYellow} 2s linear forwards;
    `}
  span {
    font-size: 14px;
  }
  video {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
    display: block;
  }
`;

const getSupportedMimeType = () =>
  [
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
    "video/x-matroska;codecs=avc1",
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "video/webm";

const VideoRecord = ({
  setVideoError,
  setVideoURLParent,
  setUploadResponse,
  textVerify,
  setTextVerify,
  setIsVideoUploaded,
}) => {
  const [capturing, setCapturing] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [error, setError] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [videoUploadError, setVideoUploadError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunks = useRef([]);
  const [user] = useContext(UserContext);

  useEffect(() => {
    axios
      .get("https://admin.metarang.com/api/kyc-verify-text")
      .then((res) => setTextVerify(res.data))
      .catch((err) => {
        Sentry.captureException(err);
        console.error("Error fetching verify text:", err);
      });
  }, []);

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setCapturing(false);
  };

  const uploadVideo = (file) => {
    const resumable = new Resumable({
      target: `${BASE_URL}upload`,
      chunkSize: 100 * 1024 * 1024,
      simultaneousUploads: 4,
      testChunks: false,
      throttleProgressCallbacks: 1,
    });

    resumable.on("fileAdded", () => resumable.upload());

    resumable.on("fileSuccess", (_, response) => {
      setUploadResponse(response);
      setVideoUploadError(false);
      setIsVideoUploaded(true);
    });

    resumable.on("fileError", (_, message) => {
      console.error("File upload error:", message);
      Sentry.captureException(new Error(`File upload error: ${message}`));
      setError(getTranslation(1933));
      setVideoUploadError(true);
      setIsVideoUploaded(false);
    });

    resumable.addFile(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      setError(null);
      setVideoError(false);
      setVideoUploadError(false);

      const recorder = new MediaRecorder(stream, {
        mimeType: getSupportedMimeType(),
        videoBitsPerSecond: 2500000,
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        setVideoURL(url);
        setVideoURLParent(url);
        stream.getTracks().forEach((track) => track.stop());
        uploadVideo(new File([blob], "video.mp4", { type: "video/mp4" }));
      };

      recorder.start();

      let countdown = MAX_DURATION;
      timerRef.current = setInterval(() => {
        setTimeLeft(--countdown);
        if (countdown === 0) stopRecording();
      }, 1000);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      Sentry.captureException(err);
      setError(
        getTranslation(1932),
      );
    }
  };

  const handleRecordClick = () => {
    if (videoURL) return;

    if (capturing) {
      stopRecording();
    } else {
      startRecording();
      setCapturing(true);
    }
  };

  const handlePlayClick = () => {
    videoRef.current.play();
    setShowPlayButton(false);
  };

  const handleDeleteClick = () => {
    setVideoURL(null);
    setTimeLeft(MAX_DURATION);
    setVideoError(true);
    setVideoUploadError(true);
    setVideoURLParent(null);
    setIsVideoUploaded(false);
    setShowPlayButton(true);
    chunks.current = [];
  };

  return (
    <Container>
      <TitleBody title={getTranslation("873")} />
      <Div>
        <ContainerRecorder>
          <Record
            onClick={handleRecordClick}
            $capturing={capturing}
            $hasError={videoUploadError}
          >
            {capturing ? (
              <video ref={videoRef} autoPlay muted playsInline />
            ) : videoURL ? (
              <video
                ref={videoRef}
                src={videoURL}
                onClick={handlePlayClick}
                playsInline
              />
            ) : (
              <>
                <HiOutlineCamera size={50} />
                <TitleBody title={getTranslation(1931)} />
              </>
            )}
            {videoURL && showPlayButton && (
              <PlayButton onClick={handlePlayClick}>▶</PlayButton>
            )}
          </Record>
          {videoURL && (
            <DeleteButton onClick={handleDeleteClick}>
              <HiOutlineRefresh />
            </DeleteButton>
          )}
        </ContainerRecorder>

        <Info>
          <TitleBody title={getTranslation("874")} />

          <TitleBody title={textVerify.text} />
          {user.code}

          <div>
            <TitleBody title={getTranslation("876")} />
            <h5>
              {convertToPersian(timeLeft)}
              <span> {getTranslation("778")} </span>
            </h5>
          </div>
        </Info>
      </Div>
      <ErrorMessage errors={[error]} onClear={() => setError(null)} />
    </Container>
  );
};
export default Sentry.withErrorBoundary(VideoRecord, {
  fallback: () => <div>{getTranslation(1934)}</div>,
});
