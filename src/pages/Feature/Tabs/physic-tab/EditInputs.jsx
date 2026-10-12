import { FiSearch } from "react-icons/fi";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Button from "../../../../components/Button";
import CustomEditor from "../../../../components/Common/CustomEditor";
import useLanguage from "../../../../services/Hooks/useLanguage";
import useRequest from "../../../../services/Hooks/useRequest";
import { getTranslation } from "../../../../services/Utility";
import { FeatureContext } from "../../Context/FeatureProvider";
import Input from "./Input";

const MAX_ACTIVITIES = 3;
const SEARCH_DEBOUNCE_MS = 400;
const SCROLL_THRESHOLD = 40;

const buildInitialFields = (inputs = {}) => ({
  activity: parseActivities(inputs?.first_row_info?.[0]?.value),
  name: inputs?.first_row_info?.[1]?.value ?? "",
  address: inputs?.second_row_info?.[0]?.value ?? "",
  post: inputs?.third_row_info?.[0]?.value ?? "",
  web: inputs?.third_row_info?.[1]?.value ?? "",
  about: inputs?.target ?? "",
});

function parseActivities(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// یکسان‌سازی ی/ک عربی و فارسی برای مقایسه
const normalize = (text) =>
  (text || "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();


const useIsicCodes = (search, enabled) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const loadingRef = useRef(false);

  const fetchPage = useCallback(async (pageNumber, term) => {
    const id = ++requestId.current;
    loadingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNumber });
      if (term) params.set("search", term);
      const res = await Request(`isic-codes?${params}`, HTTP_METHOD.GET);
      if (id !== requestId.current) return;

      const list = res?.data?.data ?? [];
      const meta = res?.data?.meta;

      setOptions((prev) =>
        pageNumber === 1
          ? list
          : [...prev, ...list.filter((n) => !prev.some((p) => p.id === n.id))],
      );
      setPage(pageNumber);
      setHasMore(meta ? meta.current_page < meta.last_page : list.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      if (id === requestId.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    setOptions([]);
    setPage(0);
    setHasMore(true);
    fetchPage(1, search);
  }, [search, enabled, fetchPage]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || page === 0) return;
    fetchPage(page + 1, search);
  }, [fetchPage, hasMore, page, search]);

  return { options, loading, hasMore, loadMore };
};

/* ------------------------------ Styles ------------------------------ */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const Field = styled.div`
  position: relative;
  min-height: 50px;
  border-radius: 5px;
  padding: 8px 10px 8px 15px;
  outline: none;
  flex-wrap: nowrap;
  justify-content: space-between;
  flex-grow: 1;
  border: none;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  align-items: center;

  span {
    display: flex;
    align-items: start;
    justify-content: start;
    font-size: 18px;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    cursor: pointer;
  }

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    svg {
      color: ${(props) => props.theme.colors.newColors.shades.title};
      font-size: 24px;
    }

    input {
      width: 100px;
      height: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      color: ${(props) => props.theme.colors.newColors.shades.title};
      font-size: 16px;
      font-weight: 400;
    }
  }
`;

const IconButton = styled.span`
  display: flex;
  position: absolute;
  ${(props) => (props.isPersian ? "left: 1%;" : "right: 1%;")}
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  cursor: pointer;
  flex-shrink: 0;
  align-self: center;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${(props) => props.theme.colors.newColors.otherColors.iconBg};
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  color: ${(props) => props.theme.colors.newColors.shades.title};
  padding: 4px 8px;
  border-radius: 14px;
  font-size: 13px;
  white-space: nowrap;

  span {
    font-size: 14px !important;
    line-height: 1;
    color: ${(props) => props.theme.colors.newColors.otherColors.red};
    cursor: pointer;
  }
`;

const OptionsList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  inset-inline: 0;
  z-index: 20;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  border-radius: 5px;
  background-color: ${(p) => p.theme.colors.newColors.otherColors.menuBg};
  border: 1px solid ${(p) => p.theme.colors.newColors.otherColors.inputBorder};
`;

const OptionItem = styled.li`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  color: ${(p) => p.theme.colors.newColors.shades.title};

  &:hover {
    background-color: ${(p) => p.theme.colors.newColors.otherColors.iconBg};
  }
`;

const Status = styled.li`
  padding: 8px 12px;
  font-size: 13px;
  text-align: center;
  color: ${(p) => p.theme.colors.newColors.shades.title};
  opacity: 0.7;
`;

const First = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Third = styled.div`
  display: flex;
  gap: 10px;
`;

const Text = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  line-height: 1.5rem;
  margin-top: 5px;

  @media (max-width: 1023px) {
    font-size: 12px;
  }
`;

const createInitialErrors = () => ({
  address: false,
  post: false,
  web: false,
});


const EditInputs = ({ hasData, inputs, setEdit, buildingID, featureID }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const { isPersian } = useLanguage();
  const [, setFeature] = useContext(FeatureContext);

  const [activityInput, setActivityInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
  const [fields, setFields] = useState(() => buildInitialFields(inputs));
  const [errors, setErrors] = useState(createInitialErrors);
  const fieldRef = useRef(null);

  useEffect(() => {
    setFields(buildInitialFields(inputs));
  }, [inputs]);

  const isLimitReached = fields.activity.length >= MAX_ACTIVITIES;

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(activityInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [activityInput]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target)) {
        setIsActivityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // وقتی سقف پر شد لیست بسته شود
  useEffect(() => {
    if (isLimitReached) setIsActivityDropdownOpen(false);
  }, [isLimitReached]);

  const { options, loading, loadMore } = useIsicCodes(
    debouncedSearch,
    isActivityDropdownOpen && !isLimitReached,
  );

  const availableOptions = useMemo(() => {
    const selected = fields.activity.map(normalize);
    return options.filter((o) => !selected.includes(normalize(o.name)));
  }, [options, fields.activity]);

  const handleListScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
      loadMore();
    }
  };

  const addActivity = (rawValue) => {
    if (isLimitReached) return;

    const value = (rawValue || "").trim();
    if (!value) return;

    setFields((prev) => {
      if (prev.activity.length >= MAX_ACTIVITIES) return prev;
      const alreadyExists = prev.activity.some(
        (item) => normalize(item) === normalize(value),
      );

      if (alreadyExists) return prev;
      return { ...prev, activity: [...prev.activity, value] };
    });

    setActivityInput("");
  };

  const removeActivity = (index) => {
    setFields((prev) => ({
      ...prev,
      activity: prev.activity.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleActivityKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addActivity(activityInput);
    }
  };

  const isValidWebsite = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[a-zA-Z]{2,}$/;
    return pattern.test((url || "").trim());
  };

  const validateFields = (data) => {
    const nextErrors = {
      address: Boolean(data.address) && data.address.length < 10,
      post: Boolean(data.post) && data.post.length < 10,
      web: Boolean(data.web) && !isValidWebsite(data.web),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const updateField = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    const payload = {
      activity: fields.activity,
      name: fields.name.trim(),
      address: fields.address.trim(),
      post: fields.post.trim(),
      web: fields.web.trim(),
      about: fields.about.trim(),
    };

    if (!validateFields(payload)) return;

    const formData = new FormData();
    formData.append("activity_line", payload.activity.join(","));
    formData.append("name", payload.name);
    formData.append("address", payload.address);
    formData.append("postal_code", payload.post);
    formData.append("website", payload.web);
    formData.append("description", payload.about);

    try {
      await Request(
        `features/${featureID}/build/buildings/${buildingID}`,
        HTTP_METHOD.PATCH,
        formData,
      );

      setFeature((prev) => ({
        ...prev,
        buildings: (prev?.buildings ?? []).map((item) =>
          item.id === buildingID
            ? {
              ...item,
              building: {
                ...item.building,
                information: {
                  ...(item.building?.information ?? {}),
                  activity_line: payload.activity.join(","),
                  name: payload.name,
                  address: payload.address,
                  postal_code: payload.post,
                  website: payload.web,
                  description: payload.about,
                },
              },
            }
            : item,
        ),
      }));

      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <First>
        <Field ref={fieldRef}>
          <TagsWrapper>
            <FiSearch />

            {fields.activity.map((item, index) => (
              <Tag key={`${item}-${index}`}>
                {item}
                <span onClick={() => removeActivity(index)}>×</span>
              </Tag>
            ))}

            {!isLimitReached && (
              <input
                value={activityInput}
                onChange={(event) => {
                  setActivityInput(event.target.value);
                  setIsActivityDropdownOpen(true);
                }}
                onFocus={() => setIsActivityDropdownOpen(true)}
                onKeyDown={handleActivityKeyDown}
                maxLength={25}
                placeholder={
                  fields.activity.length === 0 ? getTranslation("360") : ""
                }
              />
            )}

            <IconButton
              isPersian={isPersian}
              disabled={isLimitReached}
              onClick={() => {
                if (isLimitReached) return;
                setIsActivityDropdownOpen((prev) => !prev);
              }}
            >
              +
            </IconButton>
          </TagsWrapper>

          {isActivityDropdownOpen && !isLimitReached && (
            <OptionsList onScroll={handleListScroll}>
              {availableOptions.map((option) => (
                <OptionItem
                  key={option.id}
                  onClick={() => {
                    addActivity(option.name);
                    setIsActivityDropdownOpen(false);
                  }}
                >
                  {option.name}
                </OptionItem>
              ))}
              {loading && <Status>...</Status>}
              {!loading && availableOptions.length === 0 && (
                <Status>موردی یافت نشد</Status>
              )}
            </OptionsList>
          )}
        </Field>

        <Input
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder={getTranslation("361")}
        />
      </First>

      <Input
        value={fields.address}
        onChange={(event) => {
          const value = event.target.value;
          updateField("address", value);
          if (errors.address && (value.length === 0 || value.length >= 10)) {
            setErrors((prev) => ({ ...prev, address: false }));
          }
        }}
        placeholder={getTranslation(554)}
        maxLength={100}
        error={errors.address}
      />

      <Third>
        <Input
          type="text"
          inputMode="numeric"
          maxLength={10}
          value={fields.post}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "");
            updateField("post", value);
            if (errors.post && (value.length === 0 || value.length >= 10)) {
              setErrors((prev) => ({ ...prev, post: false }));
            }
          }}
          placeholder={getTranslation("363")}
          error={errors.post}
        />

        <Input
          type="url"
          value={fields.web}
          onChange={(event) => {
            const value = event.target.value.replace(/[^\w\-.:/?#=&%]/g, "");
            updateField("web", value);
            if (errors.web && (value.length === 0 || isValidWebsite(value))) {
              setErrors((prev) => ({ ...prev, web: false }));
            }
          }}
          placeholder={getTranslation("364")}
          error={errors.web}
        />
      </Third>

      <CustomEditor
        showToolbar={false}
        border
        value={fields.about}
        placeholder={getTranslation(365)}
        onChange={(value) => updateField("about", value)}
      />

      <Text>{getTranslation("556")}</Text>
      <Button
        edit
        onClick={handleSend}
        label={hasData ? getTranslation("537") : getTranslation("629")}
        fit
      />
    </Container>
  );
};

export default EditInputs;