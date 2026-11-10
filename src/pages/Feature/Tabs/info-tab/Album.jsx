import { useContext, useState } from "react";
import styled from "styled-components";
import Compressor from "compressorjs";
import PhotoActionButton from "./components/PhotoActionButton.jsx";
import Slider from "./Slider";
import FileUploader from "../../../../components/FileUploader/FileUploader.jsx";
import { Skeleton } from "../../../../components/Skeletons/Skeleton.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { UserContext } from "../../../../services/reducers/UserContext";
import {
  ToastSuccess,
  getTranslation,
} from "../../../../services/Utility";

const SKELETON_COUNT = 4;
const NO_FILES = []; // آپلودر کنترل‌شده است؛ فایل‌ها بلافاصله آپلود می‌شوند و نگه داشته نمی‌شوند
const MAX_IMAGES = 10;
/* ---------- Styles ---------- */
const ActionButton = styled(PhotoActionButton)`
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
`;
const AlbumWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
  margin-top: 30px;
  padding: 0 0 0 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

/* ---------- Component ---------- */

const Album = ({ feature, setFeature, isLoading }) => {
  const [user] = useContext(UserContext);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const images = feature?.images ?? [];
  const isOwner = String(user.id) === String(feature?.owner_id);

  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(images[0] ?? null);

  const uploadImage = (file) =>
    Request(
      `my-features/${user.id}/add-image/${feature.id}`,
      HTTP_METHOD.POST,
      { "images[]": [file] },
      { "Content-Type": "multipart/form-data" },
    )
      .then(({ data }) => {
        setFeature({ ...feature, images: [...data.data] });
        ToastSuccess(getTranslation(1628));
      })
      

  // اعتبارسنجی حجم و تعداد داخل FileUploader انجام می‌شود
  const handleUpload = (file) => {
    if (!file || !checkSecurity()) return;

    new Compressor(file, {
      quality: 0.6,
      maxWidth: 512,
      maxHeight: 512,
      success: uploadImage,
    });
  };

  const handleDelete = (imageId) => {
    if (!checkSecurity()) return;

    Request(
      `my-features/${user.id}/remove-image/${feature.id}/image/${imageId}`,
      HTTP_METHOD.POST,
    )
      .then(() => {
        const remaining = images.filter((item) => item.id !== imageId);
        setFeature({ ...feature, images: remaining });
        setActiveImage(remaining[0] ?? null);
        ToastSuccess(getTranslation(1631));
      })
      
  };

  // کلیک روی خود عکس (نه دکمه‌ی دانلود) به‌جای باز شدن تب جدید، اسلایدر را باز می‌کند
  const handlePreviewClick = (event, image) => {
    if (!event.target.closest("a")) return;

    event.preventDefault();
    setActiveImage(image);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <AlbumWrapper>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <Skeleton key={index} width="192px" height="171px" radius="10px" />
        ))}
      </AlbumWrapper>
    );
  }

  return (
    <>
      <AlbumWrapper>
        {images.map((image) => (
          <ImageWrapper
            key={image.id}
            onClickCapture={(event) => handlePreviewClick(event, image)}
          >
            <FileUploader
              mode="display"
              file={image.url}
              fit="contain"
              noDownload
            />
            <ActionButton
              image={image}
              isOwner={isOwner}
              onDelete={handleDelete}
              size="sm"
            />
          </ImageWrapper>
        ))}

        {isOwner && (
          <FileUploader
            mode="upload"
            files={NO_FILES}
            onFilesChange={([file]) => handleUpload(file)}
            accept="image/jpeg"
            multiple={false}
            maxFiles={MAX_IMAGES - images.length}
            maxFileSizeMB={1}
          />
        )}
      </AlbumWrapper>

      {open && (
        <Slider
          isOwner={isOwner}
          deleteHandler={handleDelete}
          images={images}
          setOpen={setOpen}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
        />
      )}
    </>
  );
};

export default Album;
