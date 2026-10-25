import { createContext, useReducer, useEffect } from "react";
import useRequest from "../../../../hooks/useRequest.js";

const initialState = {
  about: "",
  education: "",
  occupation: "",
  hobbies: [],
  country: "",
  language: "",
  city: "",
  memory: "",
  opportunity: "",
  prediction: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ABOUT":
      return { ...state, about: action.payload };
    case "SET_EDUCATION":
      return { ...state, education: action.payload };
    case "SET_OCCUPATION":
      return { ...state, occupation: action.payload };
    case "SET_HOBBIES":
      return { ...state, hobbies: action.payload };
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_MEMORY":
      return { ...state, memory: action.payload };
    case "SET_OPPORTUNITY":
      return { ...state, opportunity: action.payload };
    case "SET_PREDICTION":
      return { ...state, prediction: action.payload };
    default:
      return state;
  }
};

export const AboutStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { Request } = useRequest();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await Request("personal-info", "GET");

        if (response.data && response.data.data) {
          const data = response.data.data;

          dispatch({ type: "SET_ABOUT", payload: data.about });
          dispatch({ type: "SET_EDUCATION", payload: data.education });
          dispatch({ type: "SET_OCCUPATION", payload: data.occupation });
          dispatch({ type: "SET_HOBBIES", payload: data.passions });
          dispatch({ type: "SET_COUNTRY", payload: data.loved_country });
          dispatch({ type: "SET_CITY", payload: data.loved_city });
          dispatch({ type: "SET_LANGUAGE", payload: data.loved_language });
          dispatch({ type: "SET_MEMORY", payload: data.memory });
          dispatch({ type: "SET_OPPORTUNITY", payload: data.problem_solving });
          dispatch({ type: "SET_PREDICTION", payload: data.prediction });

        }
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    if (!state.about) {
      fetchData();
    }
  }, []);

  return (
    <AboutStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AboutStateContext.Provider>
  );
};
