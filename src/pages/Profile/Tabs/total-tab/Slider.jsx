import "swiper/css";
import "swiper/css/pagination";
import "../../../../styles/styles.css";

import { Autoplay, Pagination } from "swiper/modules";
import { LuImagePlus } from "react-icons/lu";
import { HiOutlineTrash } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import DOMPurify from "dompurify";

import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContextTypes } from "../../../../services/actions/UserContextAction";
import useRequest from "../../../../hooks/useRequest.js";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import shortid from "shortid";
import { Skeleton } from "../../../../components/Skeleton";
import ImageCropper from "../../../../components/ImageCropper/ImageCropper";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation } from "../../../../services/Utility";
const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  cursor: pointer;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    cursor: pointer;
    display: none;
  }

  svg {
    font-size: 20px;
    color: ${(props) =>
    props.theme.colors.newColors.shades.title};
  }
`;

const Icons = styled.div`
  display: flex;
  z-index: 1;
  flex-direction: column;
  justify-content: end;
  gap: 10px;
  position: absolute;
  right: 10px;
  bottom: 55px;
  height: 100%;
  width: fit-content;

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

const SkeletonContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SwiperContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

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
    background-color: white;
  }
`;

export default function Slider() {
  const [profileImage, setProfileImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const { Request, HTTP_METHOD } = useRequest();

  const defaultImage = {
    id: 0,
    url: DefaultProfile,
  };

  const hasRealPhoto = profileImage.some((image) => image.id !== 0);

  const normalizeImagePayload = (payload) => {
    const image = payload?.data?.data ?? payload?.data ?? payload ?? {};

    return {
      id: image?.id ?? image?.image_id ?? payload?.id ?? null,
      url: image?.url ?? image?.image ?? image?.image_url ?? image?.path ?? null,
    };
  };

  useEffect(() => {
    setLoading(true);

    Request("profilePhotos")
      .then((response) => {
        const images = response?.data?.data;

        if (Array.isArray(images) && images.length > 0) {
          setProfileImage([...images].reverse());
        } else {
          setProfileImage([defaultImage]);
        }
      })
      .catch((error) => {
        console.error("Error loading profile photos:", error);
        setProfileImage([defaultImage]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const deleteProfileImage = (id) => {
    if (!id || id === 0) return;

    Request(`profilePhotos/${id}`, HTTP_METHOD.DELETE)
      .then(() => {
        setProfileImage((prevImages) => {
          const updatedImages = prevImages.filter((image) => image.id !== id);

          if (updatedImages.length === 0) {
            dispatch({
              type: UserContextTypes.UPDATE_FIELD,
              payload: {
                key: "image",
                value: null,
              },
            });

            return [defaultImage];
          }

          const firstRemainingImage = updatedImages[updatedImages.length - 1];
          dispatch({
            type: UserContextTypes.UPDATE_FIELD,
            payload: {
              key: "image",
              value: firstRemainingImage?.url ?? null,
            },
          });

          return updatedImages;
        });

        if (swiperRef.current) {
          swiperRef.current.slideTo(0);
        }
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    if (selectedImage?.url) {
      URL.revokeObjectURL(selectedImage.url);
    }

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage({ file, url: imageUrl });
    e.target.value = "";
  };

  const uploadCroppedImage = (croppedFile) => {
    if (!croppedFile) return;

    setUploading(true);

    const fileName = `${shortid.generate()}.jpeg`;
    const file = new File([croppedFile], fileName, {
      type: "image/jpeg",
    });

    const formData = new FormData();
    formData.append("image", file);

    Request("profilePhotos", HTTP_METHOD.POST, formData, {
      "Content-Type": "multipart/form-data",
    })
      .then((response) => {
        const createdImage = normalizeImagePayload(response);
        const uploadedId = createdImage.id;
        const uploadedUrl = createdImage.url || URL.createObjectURL(file);

        if (!uploadedId || !uploadedUrl) {
          console.error("Upload response did not contain image id or url.", response);
          return;
        }

        const newImage = {
          id: uploadedId,
          url: uploadedUrl,
        };

        setProfileImage((prevImages) => {
          const withoutDefault = prevImages.filter((image) => image.id !== 0);
          return [newImage, ...withoutDefault];
        });

        dispatch({
          type: UserContextTypes.UPDATE_FIELD,
          payload: {
            key: "image",
            value: uploadedUrl,
          },
        });

        if (selectedImage?.url) {
          URL.revokeObjectURL(selectedImage.url);
        }

        setSelectedImage(null);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleCancelCrop = () => {
    if (selectedImage?.url) {
      URL.revokeObjectURL(selectedImage.url);
    }

    setSelectedImage(null);
  };


  if (loading) {
    return (
      <SkeletonContainer>
        <Skeleton
          width="100%"
          height="100%"
          radius="10px"
        />
      </SkeletonContainer>
    );
  }

  return (
    <>
      <SwiperContainer>
        <Swiper
          spaceBetween={30}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
        >
          {profileImage.map((image, index) => (
            <SwiperSlide key={image.id ?? `${image.url}-${index}`}>
              <img
                src={DOMPurify.sanitize(image.url)}
                alt="profile"
                onError={(e) => {
                  e.target.src = DefaultProfile;
                }}
              />
            </SwiperSlide>
          ))}

          <Icons>
            {hasRealPhoto ? (
              <IconWrapper onClick={() => deleteProfileImage(profileImage[activeIndex]?.id)}>
                <HiOutlineTrash />
              </IconWrapper>
            ) : null}

            <IconWrapper>
              <label htmlFor="add">
                <LuImagePlus />
              </label>

              <input
                onChange={handleImageChange}
                id="add"
                type="file"
                accept="image/*"
              />
            </IconWrapper>
          </Icons>
        </Swiper>
      </SwiperContainer>


      {selectedImage && (
        <ImageCropper
          image={selectedImage.url}
          onCancel={handleCancelCrop}
          onComplete={uploadCroppedImage}
        />
      )}


      {uploading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {getTranslation(1823)}        </div>
      )}
    </>
  );
}