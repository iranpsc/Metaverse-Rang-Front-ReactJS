import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import styled from "styled-components";
import { getTranslation } from "../../services/Utility";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CropContainer = styled.div`
  position: relative;
  width: min(90vw, 500px);
  height: min(70vh, 500px);
  background: #222;
  border-radius: 10px;
  overflow: hidden;
`;

const Controls = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 20px;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
`;

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = reject;

    image.src = url;
  });
}

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not create cropped image"));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      0.9,
    );
  });
}

export default function ImageCropper({ image, onCancel, onComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    try {
      setProcessing(true);

      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);

      const croppedFile = new File([croppedBlob], "profile-image.jpeg", {
        type: "image/jpeg",
      });

      onComplete(croppedFile);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Overlay>
      <CropContainer>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />

        <Controls>
          <Button onClick={onCancel} disabled={processing}>
            {getTranslation(833)}
          </Button>

          <Button onClick={handleConfirm} disabled={processing}>
            {processing ? getTranslation(1824) : getTranslation(34)}
          </Button>
        </Controls>
      </CropContainer>
    </Overlay>
  );
}
