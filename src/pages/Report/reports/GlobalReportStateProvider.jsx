import { createContext, useReducer } from "react";

const initialState = {
  subject: "",
  title: "",
  description: "",
  files: [],
};




const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SUBJECT":
      return { ...state, subject: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_FILES":
      return { ...state, files: action.payload };
    default:
      return state;
  }
};

export const ReportStateContext = createContext();

export const ReportStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  
 
  return (
    <ReportStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ReportStateContext.Provider>
  );
};
