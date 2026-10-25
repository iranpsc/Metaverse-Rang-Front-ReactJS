import { createContext, useState } from "react";

export const SelectedEnvironmentContext = createContext();

export const SelectedEnvironmentProvider = ({ children }) => {
  const initialState = {
    selectedEnvironment: {},
    confirmation: false,
    hiddenModel: false,
    formState: {},
    isSelectable: false,
  };

  const [selectedEnvironment, setSelectedEnvironment] = useState(
    initialState.selectedEnvironment
  );
  const [confirmation, setConfirmation] = useState(initialState.confirmation);
  const [hiddenModel, setHiddenModel] = useState(initialState.hiddenModel);
  const [formState, setFormState] = useState(initialState.formState);
  const [isSelectable, setIsSelectable] = useState(initialState.isSelectable);

  const addSelectedEnvironment = (data) => {
    setSelectedEnvironment((prev) => {
      const updatedEnvironment = { ...prev, ...data };
      return updatedEnvironment;
    });
    toggleIsSelectable(); // Add this line to toggle isSelectable
  };

  const updateFormState = (data) => {
    setFormState((prev) => ({ ...prev, ...data }));
  };

  const toggleConfirmation = () => {
    setConfirmation(!confirmation);
  };

  const toggleIsSelectable = () => {
    setIsSelectable(!isSelectable);
  };

  const resetStates = () => {
    setSelectedEnvironment(initialState.selectedEnvironment);
    setConfirmation(initialState.confirmation);
    setHiddenModel(initialState.hiddenModel);
    setFormState(initialState.formState);
    setIsSelectable(initialState.isSelectable);
  };

  return (
    <SelectedEnvironmentContext.Provider
      value={{
        selectedEnvironment,
        addSelectedEnvironment,
        confirmation,
        toggleConfirmation,
        formState,
        updateFormState,
        hiddenModel,
        setHiddenModel,
        isSelectable,
        toggleIsSelectable,
        resetStates,
      }}
    >
      {children}
    </SelectedEnvironmentContext.Provider>
  );
};
