import { useCallback, useEffect, useRef, useState } from "react";
/* -------------------------------------------------------------------------- */
/* کد های کامنت شده برای بخش توجه کنید پایین اینپوت است اگر در توسعه بشود به چندین کاربر پیام ارسلال کرد   */
/* -------------------------------------------------------------------------- */

import { CgDanger } from "react-icons/cg";
import styled from "styled-components";
import { useLocation } from "react-router";
import { useGlobalState } from "./GlobalVodStateProvider";
import { getTranslation } from "../../../services/Utility";
import useRequest from "../../../services/Hooks/useRequest";
import Dropdown from "../../../components/Common/Dropdown";
const limitedUser = 9;
const Wrapper = styled.div``;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 20px;

  @media (min-width: 1366px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const Input = styled.input`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  border: 1px solid #454545;
  border-radius: 5px;

  padding: 10px 12px;

  outline: none;

  color: ${(props) => props.theme.colors.newColors.shades.title};

  width: 100%;

  font-size: 16px;
  font-weight: 400;
`;

const CitizenInputWrapper = styled.div`
  margin-top: 20px;
  position: relative;
`;

const SearchField = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 52px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: ${(props) => props.theme.colors.newColors.otherColors.inputBg};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: rgba(140, 170, 255, 0.65);
    box-shadow: 0 0 0 3px rgba(140, 170, 255, 0.14);
  }
`;

const SearchInputField = styled.input`
  flex: 1 1 120px;
  min-width: 120px;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 400;
  outline: none;
  padding: 6px 0;

  &::placeholder {
    color: rgba(160, 160, 171, 0.9);
  }
`;

const SelectedCitizens = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const SelectedCitizen = styled.div`
  background: rgba(255, 255, 255, 0.06);
  color: ${(props) => props.theme.colors.newColors.shades.title};
  padding: 5px 10px 5px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const DropdownInternal = styled.div`
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  margin-top: 8px;
  max-height: 170px;
  overflow-y: auto;
  position: absolute;
  top: calc(100% + 0px);
  left: 0;
  z-index: 50;
  width: 100%;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
`;

const DropdownItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.newColors.shades.title};
    background-color: ${(props) => props.theme.colors.newColors.otherColors.iconBg};

  &:hover {
  background-color: ${(props) => props.theme.colors.newColors.shades[90]};
  }
`;

const SelectedDropdownItem = styled(DropdownItem)`
  background-color: ${(props) => props.theme.colors.newColors.otherColors.iconBg};
`;
 const CitizenWarning = styled.div`
  color: #a0a0ab;
padding-top: 5px;
  font-size: 13px;
  font-weight: 400;

  display: flex;
  align-items: center;

  gap: 2px;
`;



const Inputs = () => {
  const location = useLocation();

  const options = [
    {
      id: 1,
      label: "382",
      value: "citizen",
    },
    {
      id: 2,
      label: "1321",
      value: "citizens_safety",
    },
    {
      id: 3,
      label: "1322",
      value: "technical_support",
    },
    {
      id: 4,
      label: "1323",
      value: "investment",
    },
    {
      id: 5,
      label: "1324",
      value: "inspection",
    },
    {
      id: 6,
      label: "1325",
      value: "protection",
    },
    {
      id: 7,
      label: "1326",
      value: "ztb",
    },
  ];

  const { state, dispatch } = useGlobalState();
  const { Request, HTTP_METHOD } = useRequest();
  const [selectedCitizens, setSelectedCitizens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCitizens, setFilteredCitizens] = useState([]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // index نتیجه‌ای که با ArrowUp / ArrowDown انتخاب می‌شود
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const searchTimeout = useRef(null);


  const handleCitizenSelect = useCallback(
    (citizen) => {
      if (!citizen) return;

      const alreadySelected = selectedCitizens.some(
        (selected) => selected.id === citizen.id
      );

      if (alreadySelected) {
        setSearchTerm("");
        setHighlightedIndex(-1);
        setDropdownOpen(false);
        return;
      }

      if (selectedCitizens.length >= limitedUser) {
        return;
      }

      const updatedCitizens = [
        ...selectedCitizens,
        citizen,
      ];

      setSelectedCitizens(updatedCitizens);

      dispatch({
        type: "SET_SELECTED_CITIZENS",
        payload: updatedCitizens,
      });

      // Reset search
      setSearchTerm("");
      setFilteredCitizens([]);
      setHighlightedIndex(-1);
      setDropdownOpen(false);
    },
    [selectedCitizens, dispatch]
  );
  useEffect(() => {
    const userCode = location?.state?.code;

    if (!userCode) return;

    dispatch({
      type: "SET_SUBJECT",
      payload: "citizen",
    });

    const searchCitizenByCode = async () => {
      try {
        const response = await Request("search/users", HTTP_METHOD.POST, {
          searchTerm: String(userCode),
        });

        const users = response?.data?.data ?? [];
        const matchedUser = users.find(
          (user) =>
            String(user?.code) === String(userCode) ||
            String(user?.id) === String(userCode)
        );

        if (!matchedUser) return;

        const alreadySelected = selectedCitizens.some(
          (selected) => selected.id === matchedUser.id
        );

        if (alreadySelected || selectedCitizens.length >= limitedUser) return;

        const updatedCitizens = [...selectedCitizens, matchedUser];

        setSelectedCitizens(updatedCitizens);
        dispatch({
          type: "SET_SELECTED_CITIZENS",
          payload: updatedCitizens,
        });
        setSearchTerm("");
        setFilteredCitizens([]);
        setHighlightedIndex(-1);
        setDropdownOpen(false);
      } catch (error) {
        console.error("Failed to auto-select citizen by code:", error);
      }
    };

    searchCitizenByCode();
  }, []);

  const removeCitizen = useCallback(
    (citizenId) => {
      const updatedCitizens = selectedCitizens.filter(
        (citizen) => citizen.id !== citizenId
      );

      setSelectedCitizens(updatedCitizens);

      dispatch({
        type: "SET_SELECTED_CITIZENS",
        payload: updatedCitizens,
      });
    },
    [selectedCitizens, dispatch]
  );


  const handleSubjectChange = useCallback(
    (value) => {
      dispatch({
        type: "SET_SUBJECT",
        payload: value,
      });

      if (value !== "citizen") {
        setSearchTerm("");
        setFilteredCitizens([]);
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [dispatch]
  );


  const handleTitleChange = useCallback(
    (event) => {
      const value = event.target.value;

      if (value.length <= 200) {
        dispatch({
          type: "SET_TITLE",
          payload: value,
        });
      }
    },
    [dispatch]
  );


  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (
      state.subject !== "citizen" ||
      !searchTerm.trim()
    ) {
      setFilteredCitizens([]);
      setHighlightedIndex(-1);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      Request(
        "search/users",
        HTTP_METHOD.POST,
        {
          searchTerm: searchTerm.trim(),
        }
      )
        .then((response) => {
          const users = response?.data?.data ?? [];

          setFilteredCitizens(users);

          setHighlightedIndex(
            users.length > 0 ? 0 : -1
          );
        })
        .catch(() => {
          setFilteredCitizens([]);
          setHighlightedIndex(-1);
        });
    }, 600);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [
    searchTerm,
    state.subject,

  ]);


  const handleKeyDown = useCallback(
    (event) => {
      if (!isDropdownOpen) {
        return;
      }

      // Escape
      if (event.key === "Escape") {
        event.preventDefault();

        setDropdownOpen(false);
        setHighlightedIndex(-1);

        return;
      }

      if (filteredCitizens.length === 0) {
        return;
      }

      // Enter
      if (event.key === "Enter") {
        event.preventDefault();

        const index =
          highlightedIndex >= 0
            ? highlightedIndex
            : 0;

        const selectedCitizen =
          filteredCitizens[index];

        if (selectedCitizen) {
          handleCitizenSelect(selectedCitizen);
        }

        return;
      }

      // ArrowDown
      if (event.key === "ArrowDown") {
        event.preventDefault();

        setHighlightedIndex((currentIndex) => {
          if (
            currentIndex >=
            filteredCitizens.length - 1
          ) {
            return 0;
          }

          return currentIndex + 1;
        });

        return;
      }

      // ArrowUp
      if (event.key === "ArrowUp") {
        event.preventDefault();

        setHighlightedIndex((currentIndex) => {
          if (currentIndex <= 0) {
            return filteredCitizens.length - 1;
          }

          return currentIndex - 1;
        });
      }
    },
    [
      isDropdownOpen,
      filteredCitizens,
      highlightedIndex,
      handleCitizenSelect,
    ]
  );

  /*                           Click Outside Handler                          */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  return (
    <Wrapper>
      <Container>
        {/* Subject */}
        <InputWrapper>
          <Label>
            {getTranslation("1318")}
          </Label>

          <Dropdown
            selected={state.subject}
            onSelect={handleSubjectChange}
            placeholder={getTranslation("1320")}
            selectPlaceHolder={false}
            options={options.map((option) => ({
              id: option.id,
              value: option.value,
              label: getTranslation(option.label),
            }))}
          />
        </InputWrapper>

        {/* Title */}
        <InputWrapper>
          <Label>
            {getTranslation("1319")}
          </Label>

          <Input
            type="text"
            placeholder={getTranslation("1319")}
            value={state.title || ""}
            onChange={handleTitleChange}
          />
        </InputWrapper>
      </Container>

      {/* Citizen */}
      {state.subject === "citizen" && (
        <CitizenInputWrapper ref={dropdownRef}>
          <Label>
            {getTranslation("133")}
          </Label>

          <SearchField>
            <SelectedCitizens>
              {selectedCitizens.map((citizen) => (
                <SelectedCitizen key={citizen.id}>
                  <RemoveButton
                    type="button"
                    onClick={() => removeCitizen(citizen.id)}
                  >
                    ×
                  </RemoveButton>

                  {citizen.name}
                </SelectedCitizen>
              ))}
            </SelectedCitizens>

            {selectedCitizens.length < limitedUser && (
              <SearchInputField
                type="text"
                placeholder={
                  selectedCitizens.length === 0
                    ? getTranslation("1329")
                    : getTranslation("1829")
                }
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => {
                  setDropdownOpen(true);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            )}
          </SearchField>

          {/* Results */}
          {isDropdownOpen &&
            searchTerm.trim() && (
              <DropdownInternal>
                {filteredCitizens.length > 0 ? (
                  filteredCitizens.map(
                    (citizen, index) => {
                      const isHighlighted =
                        index === highlightedIndex;

                      const alreadySelected =
                        selectedCitizens.some(
                          (selected) =>
                            selected.id ===
                            citizen.id
                        );

                      if (alreadySelected) {
                        return null;
                      }

                      return isHighlighted ? (
                        <SelectedDropdownItem
                          key={citizen.id}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleCitizenSelect(
                              citizen
                            );
                          }}
                        >
                          {citizen.name}
                        </SelectedDropdownItem>
                      ) : (
                        <DropdownItem
                          key={citizen.id}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleCitizenSelect(
                              citizen
                            );
                          }}
                        >
                          {citizen.name}
                        </DropdownItem>
                      );
                    }
                  )
                ) : (
                  <DropdownItem>
                    {getTranslation("1331")}
                  </DropdownItem>
                )}
              </DropdownInternal>
            )}

          {/* Warning */}
          { <CitizenWarning>
            <CgDanger size={20} />

            {getTranslation("1330")}
          </CitizenWarning> }
        </CitizenInputWrapper>
      )}
    </Wrapper>
  );
};

export default Inputs;
