import { HiOutlineCamera, HiOutlineRefresh } from "react-icons/hi";
import styled, { keyframes, css } from "styled-components";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import Resumable from "resumablejs";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation } from "../../../../services/Utility";
import * as Sentry from "@sentry/react";
import { BASE_URL } from "../../../../services/Hooks/useRequest";
const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.newColors.shades.title};
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
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 14px;
  font-weight: 400;
  h4 {
    font-size: 16px;
    font-weight: 600 !important;
  }
  p {
    margin: 20px 0 40px 0;
    text-transform: uppercase;
  }
  div {
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    h3 {
      font-size: 14px;
    }
    h5 {
      color: ${(props) => props.theme.colors.primary};
      span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.newColors.shades.title};
      }
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  cursor: pointer;
  font-size: 24px;
`;

const ContainerRecorder = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  flex-direction: column;
`;

const changeBorderColor = keyframes`
  0% { border-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBorder}; }
    20%  { border-color: yellow; }
        70%  { border-color: yellow; }
  100% { border-color: yellow; }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  display: ${(props) => (props.showPlayButton ? "block" : "none")};
  cursor: pointer;
`;

const Record = styled.div`
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  width: 180px;
  height: 180px;
  border-radius: 100%;
  border: 3px dotted
    ${(props) =>
    props.hasError
      ? "red"
      : props.theme.colors.newColors.otherColors.inputBorder};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  position: relative;
  ${(props) =>
    props.capturing &&
    css`
      animation: ${changeBorderColor} 10s linear forwards;
    `}
  span {
    font-size: 14px;
  }
  video {
    border-radius: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const getSupportedMimeType = () => {
  const possibleTypes = [
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
    "video/x-matroska;codecs=avc1",
  ];

  return (
    possibleTypes.find((type) => {
      return MediaRecorder.isTypeSupported(type);
    }) || "video/webm"
  );
};

const VideoRecord = ({
  setVideoError,
  setVideoURLParent,
  setUploadResponse,
  textVerify,
  setTextVerify,
  setIsVideoUploaded, // Add this new prop
}) => {
  const [capturing, setCapturing] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [error, setError] = useState(null);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [videoUploadError, setVideoUploadError] = useState(false); // State for video upload error
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);
  const chunks = useRef([]);
  const [user] = useContext(UserContext);

  const handleRecordClick = () => {
    if (videoURL) {
      return;
    }

    if (capturing) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      clearInterval(timerRef.current);
    } else {
      startRecording();
      setCapturing(true);
    }
  };

  const handleDeleteClick = () => {
    setVideoURL(null);
    setTimeLeft(30);
    setVideoError(true);
    setVideoUploadError(true); // Set the error for video upload
    setVideoURLParent(null);
    setIsVideoUploaded(false); // Reset when video is deleted
    chunks.current = [];
    setShowPlayButton(true);
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
      setVideoUploadError(false); // Clear the error when recording starts

      const mimeType = getSupportedMimeType();

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // 2.5Mbps
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: "video/mp4" });
        const file = new File([blob], "video.mp4", { type: "video/mp4" });

        setVideoURL(URL.createObjectURL(blob));
        setVideoURLParent(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(timerRef.current);

        // Exit full-screen mode

        uploadVideo(file);
      };

      mediaRecorderRef.current.start();

      let countdown = 30;
      timerRef.current = setInterval(() => {
        countdown -= 1;
        setTimeLeft(countdown);
        if (countdown === 0) {
          mediaRecorderRef.current.stop();
          setCapturing(false);
          clearInterval(timerRef.current);
        }
      }, 1000);
    } catch (err) {
      console.error("Error accessing media devices.", err);
      Sentry.captureException(err);
      setError(
        "دسترسی به دوربین یا میکروفون ممکن نیست. لطفاً تنظیمات دستگاه خود را بررسی کنید."
      );
    }
  };

  const handlePlayClick = () => {
    videoRef.current.play();
    setShowPlayButton(false);
  };

  const uploadVideo = (file) => {
    const resumable = new Resumable({
      target: `${BASE_URL}upload`,
      chunkSize: 100 * 1024 * 1024,
      simultaneousUploads: 4,
      testChunks: false,
      throttleProgressCallbacks: 1,
    });

    resumable.addFile(file);

    resumable.on("fileAdded", () => {
      resumable.upload();
    });

    resumable.on("fileSuccess", (file, response) => {
      setUploadResponse(response);
      setVideoUploadError(false); // Clear the error if the upload is successful
      setIsVideoUploaded(true); // Set to true when upload succeeds
    });

    resumable.on("fileError", (file, message) => {
      console.error("File upload error:", message);
      Sentry.captureException(new Error(`File upload error: ${message}`));
      setError("خطا در آپلود ویدیو. لطفاً دوباره تلاش کنید.");
      setVideoUploadError(true); // Set the error if the upload fails
      setIsVideoUploaded(false); // Set to false on error
    });
  };

  useEffect(() => {
    axios
      .get("https://admin.metarang.com/api/kyc-verify-text")
      .then((res) => {
        setTextVerify(res.data);
      })
      .catch((err) => {
        Sentry.captureException(err);
        console.error("Error fetching verify text:", err);
      });
  }, []);

  return (
    <Container>
      <Title>{getTranslation("873")}</Title>
      <Div>
        <ContainerRecorder>
          <Record
            onClick={handleRecordClick}
            capturing={capturing}
            hasError={videoUploadError} // Add the error state to control border color
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
                <span>شروع ضبط</span>
              </>
            )}
            <PlayButton
              onClick={handlePlayClick}
              showPlayButton={!!videoURL && showPlayButton}
            >
              ▶
            </PlayButton>
          </Record>
          {videoURL && (
            <DeleteButton onClick={handleDeleteClick}>
              <HiOutlineRefresh />
            </DeleteButton>
          )}
        </ContainerRecorder>

        <Info>
          <h4>{getTranslation("874")}</h4>
          <p style={{ textWrap: "Wrap" }}>
            {textVerify.text} {user.code}
          </p>
          <div>
            <h3>{getTranslation("876")}</h3>
            <h5>
              {timeLeft}
              <span>{getTranslation("778")}</span>
            </h5>
          </div>
        </Info>
      </Div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

// Wrap the component with Sentry error boundary
export default Sentry.withErrorBoundary(VideoRecord, {
  fallback: () => <div>خطایی رخ داده است. لطفا صفحه را رفرش کنید.</div>,
});
