import "swiper/css";
import "swiper/css/pagination";
import "../../../../styles/styles.css";

import { Autoplay, Pagination } from "swiper/modules";
import { LuImagePlus } from "react-icons/lu";
import { HiOutlineTrash } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import DOMPurify from "dompurify";
import shortid from "shortid";
import styled, { css } from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContextTypes } from "../../../../services/actions/UserContextAction";
import { UserContext } from "../../../../services/reducers/UserContext";
import useRequest from "../../../../hooks/useRequest.js";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import SliderSkeleton from "../../../../components/Skeletons/SliderSkeleton";
import ImageCropper from "../../../../components/ImageCropper/ImageCropper";
import { getTranslation } from "../../../../services/Utility";

/* ---------- Helpers ---------- */

const DEFAULT_IMAGE = { id: 0, url: DefaultProfile };

// پاسخ آپلود ممکنه با ساختارهای مختلفی برگرده؛ id و url رو یکدست میکنه
const normalizeImagePayload = (payload) => {
  const image = payload?.data?.data ?? payload?.data ?? payload ?? {};

  return {
    id: image?.id ?? image?.image_id ?? payload?.id ?? null,
    url: image?.url ?? image?.image ?? image?.image_url ?? image?.path ?? null,
  };
};

/* ---------- Styles ---------- */
const Container = styled.div`
  overflow: hidden;
  height: 317px;

  @media (min-width: 740px) {
    height: 300px;
  }
`;

const SwiperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .mySwiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .swiper-pagination-bullet {
    background-color: white;
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    opacity: 1;
  }
`;

const Icons = styled.div`
  position: absolute;
  right: 10px;
  bottom: 55px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 10px;
  width: fit-content;
  height: 100%;

  @media (min-width: 740px) {
    bottom: 10px;
  }

  @media (min-width: 840px) {
    bottom: 30px;
  }

  @media (min-width: 1024px) {
    bottom: 10px;
  }
`;

const iconCircle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  svg {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const IconButton = styled.button`
  ${iconCircle}
`;

const IconLabel = styled.label`
  ${iconCircle}
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
`;

/* ---------- Component ---------- */

export default function Slider() {
  const [profileImage, setProfileImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, dispatch] = useContext(UserContext);
  const swiperRef = useRef(null);
  const { Request, HTTP_METHOD } = useRequest();

  const hasRealPhoto = profileImage.some((image) => image.id !== 0);

  const updateUserImage = (value) =>
    dispatch({
      type: UserContextTypes.UPDATE_FIELD,
      payload: { key: "image", value },
    });

  useEffect(() => {
    Request("profilePhotos")
      .then((response) => {
        const images = response?.data?.data;
        setProfileImage(
          Array.isArray(images) && images.length > 0
            ? [...images].reverse()
            : [DEFAULT_IMAGE],
        );
      })
      .catch(() => setProfileImage([DEFAULT_IMAGE]))
      .finally(() => setLoading(false));
  }, [Request]);

  const clearSelectedImage = () => {
    if (selectedImage?.url) URL.revokeObjectURL(selectedImage.url);
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file?.type.startsWith("image/")) return;

    if (selectedImage?.url) URL.revokeObjectURL(selectedImage.url);
    setSelectedImage({ file, url: URL.createObjectURL(file) });
  };

  const handleDelete = (id) => {
    if (!id) return;

    Request(`profilePhotos/${id}`, HTTP_METHOD.DELETE).then(() => {
      const remaining = profileImage.filter((image) => image.id !== id);

      if (remaining.length === 0) {
        updateUserImage(null);
        setProfileImage([DEFAULT_IMAGE]);
      } else {
        updateUserImage(remaining[remaining.length - 1]?.url ?? null);
        setProfileImage(remaining);
      }

      setActiveIndex(0);
      swiperRef.current?.slideTo(0);
    });
  };

  const uploadCroppedImage = (croppedFile) => {
    if (!croppedFile) return;

    setUploading(true);

    const file = new File([croppedFile], `${shortid.generate()}.jpeg`, {
      type: "image/jpeg",
    });
    const formData = new FormData();
    formData.append("image", file);

    Request("profilePhotos", HTTP_METHOD.POST, formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((response) => {
        const { id, url } = normalizeImagePayload(response);

        if (!id) {
          console.error("Upload response did not contain image id.", response);
          return;
        }

        const imageUrl = url || URL.createObjectURL(file);

        setProfileImage((prev) => [
          { id, url: imageUrl },
          ...prev.filter((image) => image.id !== 0),
        ]);
        updateUserImage(imageUrl);
        clearSelectedImage();
      })
      .finally(() => setUploading(false));
  };

  if (loading) return <SliderSkeleton />;

  return (
    <Container>
      <SwiperContainer>
        <Swiper
          className="mySwiper"
          spaceBetween={30}
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {profileImage.map((image, index) => (
            <SwiperSlide key={image.id ?? `${image.url}-${index}`}>
              <img
                src={DOMPurify.sanitize(image.url)}
                alt="profile"
                onError={(e) => {
                  e.currentTarget.src = DefaultProfile;
                }}
              />
            </SwiperSlide>
          ))}

          <Icons>
            {hasRealPhoto && (
              <IconButton
                type="button"
                onClick={() => handleDelete(profileImage[activeIndex]?.id)}
              >
                <HiOutlineTrash />
              </IconButton>
            )}

            <IconLabel>
              <LuImagePlus />
              <HiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </IconLabel>
          </Icons>
        </Swiper>
      </SwiperContainer>

      {selectedImage && (
        <ImageCropper
          image={selectedImage.url}
          onCancel={clearSelectedImage}
          onComplete={uploadCroppedImage}
        />
      )}

      {uploading && <UploadOverlay>{getTranslation(1823)}</UploadOverlay>}
    </Container>
  );
}
